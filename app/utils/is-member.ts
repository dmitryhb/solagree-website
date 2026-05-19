/**
 * Narrows a string to one of the literal members in a readonly value list.
 */
export const isMember = <TValue extends string>(
  values: readonly TValue[],
  value: string
): value is TValue => {
  return values.includes(value as TValue)
}
