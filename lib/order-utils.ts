export function getStatusColor(status: string): string {
  switch (status) {
    case "confirmed":
      return "bg-[var(--success-light)] text-[var(--success)] border-[var(--success)]"
    case "pending":
      return "bg-[var(--warning-light)] text-[var(--warning)] border-[var(--warning)]"
    case "shipped":
      return "bg-[var(--info-light)] text-[var(--info)] border-[var(--info)]"
    case "delivered":
      return "bg-[var(--purple-light)] text-[var(--purple)] border-[var(--purple)]"
    default:
      return "bg-muted text-muted-foreground border-muted"
  }
}
