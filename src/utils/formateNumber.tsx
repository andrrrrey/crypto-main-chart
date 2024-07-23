export default function formatNumber(
  number: number | string | undefined
): string {
  if (typeof number === "undefined") return ""; // Return empty string if number is undefined

  let parsedNumber = typeof number === "string" ? parseFloat(number) : number;

  if (Number.isNaN(parsedNumber)) return ""; // Return empty string if conversion fails or if input is not a number

  const symbols = ["", "K", "M", "B", "T"]; // Symbols for thousand, million, billion, trillion, etc.

  // Determine the index of the symbol to use
  let index = Math.floor(Math.log10(Math.abs(parsedNumber)) / 3);

  // Adjust index and number for decimal numbers less than 1
  if (parsedNumber < 1) {
    index--;
    parsedNumber /= 10; // Multiply by 1,000,000 to approximate to 6 digits
  }

  // Check if the index is out of bounds
  if (index >= symbols.length) {
    // If index is out of bounds, return the original number without formatting
    return parsedNumber.toFixed(2);
  }

  // Calculate the formatted number with the appropriate symbol
  let formattedNumber = "";
  if (index > 0) {
    const suffix = symbols[index];
    const prefix = (parsedNumber / Math.pow(1000, index)).toFixed(2);
    formattedNumber = `${prefix}${suffix}`;
  } else {
    formattedNumber = parsedNumber.toFixed(2);
  }

  return formattedNumber;
}
