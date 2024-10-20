export default function containsLink(text: string) {
  const regex = /(?:https?:\/\/|www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?/gi;
  return regex.test(text);
}
