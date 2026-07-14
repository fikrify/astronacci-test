/** Render the YYYY-MM-DD a date input produces as DD-MM-YYYY. */
export function toDisplayDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) {
    return value
  }

  const [, year, month, day] = match

  return `${day}-${month}-${year}`
}
