export function shortText(message: string, length: number) {
  return message.length > length ? message.slice(0, 50) + '...' : message;
}
