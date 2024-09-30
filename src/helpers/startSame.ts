export default function startSame(string: string, start: string): boolean {
  if (string.toLocaleLowerCase().startsWith(start.toLocaleLowerCase())) return true;
  return false;
}
