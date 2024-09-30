export default function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    let value = (hash >> (i * 8)) & 0xff;
    value = Math.min(255, Math.max(128, value + 128));
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}
