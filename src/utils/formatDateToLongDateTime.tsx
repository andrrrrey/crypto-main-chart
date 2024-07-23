export default function formatToLongDateTime(
  input: number | string | Date
): string | null {
  let date: Date;

  // Convert input to a Date object if it's not already
  if (typeof input === "number") {
    date = new Date(input);
  } else if (typeof input === "string") {
    date = new Date(input);
    if (Number.isNaN(date.getTime())) {
      // If the string cannot be parsed into a valid date, return null
      return null;
    }
  } else if (input instanceof Date) {
    date = input;
  } else {
    // If input is not a number, string, or Date, return null
    return null;
  }

  // Format the date
  const options: Intl.DateTimeFormatOptions = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    day: "2-digit",
    year: "numeric",
  };
  const formattedDate: string = date.toLocaleString("en-US", options);
  return formattedDate;
}
