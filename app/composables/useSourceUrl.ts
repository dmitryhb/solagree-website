export const useSourceUrl = (): string | null => {
  if (!import.meta.client) {
    return null
  }

  const sourceUrl = new URL(window.location.href)
  sourceUrl.hash = ''

  return sourceUrl.toString()
}
