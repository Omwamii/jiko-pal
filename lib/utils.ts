export function formatDate(dateString: string, showTime: boolean = false) {
  const date = new Date(dateString)
  return showTime ? (
    new Intl.DateTimeFormat('en-US', {
      timeZone: "Africa/Nairobi",
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  ) : (
    new Intl.DateTimeFormat('en-US', {
      timeZone: "Africa/Nairobi",
      year: 'numeric',
      month: 'short',
      day: 'numeric',}).format(date)
  )
}