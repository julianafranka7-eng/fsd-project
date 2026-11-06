// Minimal className combiner so we don't need an extra dependency.
export function clsx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}
