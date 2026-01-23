const sentEmails = new Set<string>();

export function wasEmailSent(emailId: string): boolean {
  return sentEmails.has(emailId);
}

export function markEmailAsSent(emailId: string) {
  sentEmails.add(emailId);
}
