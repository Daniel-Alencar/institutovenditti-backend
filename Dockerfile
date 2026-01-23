# ===== STAGE 1: build =====
FROM node:20-alpine AS build

WORKDIR /app

# Copia arquivos de dependência primeiro (cache)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

RUN npm ci

# Copia o restante do código
COPY . .

# Se usar TypeScript / NestJS
RUN npm run build || echo "No build step"


# ===== STAGE 2: production =====
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Cria usuário não-root
RUN addgroup -S app && adduser -S app -G app
USER app

# Copia apenas o necessário
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Se não usar TS, comente a linha acima e use:
# COPY --from=build /app ./

# Porta do backend
EXPOSE 3333

# Ajuste conforme seu framework
CMD ["node", "dist/main.js"]
