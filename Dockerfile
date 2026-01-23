# ===== STAGE 1: build =====
FROM node:20-alpine AS build

WORKDIR /app

# Dependências
COPY package.json package-lock.json* ./
RUN npm install

# Código
COPY . .

# Build TypeScript (gera dist/server.js)
RUN npm run build


# ===== STAGE 2: production =====
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copia apenas o necessário
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

EXPOSE 3333

CMD ["node", "dist/server.js"]
