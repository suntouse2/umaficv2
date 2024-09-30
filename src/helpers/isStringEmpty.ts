export default function isStringEmpty(input: string): boolean {
  const cleanedInput = input.replace(/\s+/g, '').trim();
  return cleanedInput.length == 0;
}
