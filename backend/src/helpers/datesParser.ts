export function safeParseBrazilianDate(value: string): Date {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) throw new Error('Invalid date format')

  const [, d, m, y] = match
  return new Date(Date.UTC(+y, +m - 1, +d))
}
