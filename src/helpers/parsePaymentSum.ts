const min_val = 500;

export default function parsePaymentSum(value: string | number) {
  let parsedValue = parseInt(value.toString(), 10);

  if (isNaN(parsedValue) || parsedValue < min_val) {
    parsedValue = min_val;
  }

  return parsedValue;
}
