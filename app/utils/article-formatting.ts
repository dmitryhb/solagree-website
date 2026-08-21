/** Formats the UTC publication date used by Git-managed resource content. */
export const formatArticleDate = (date: string): string => new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric'
}).format(new Date(`${date}T00:00:00.000Z`))
