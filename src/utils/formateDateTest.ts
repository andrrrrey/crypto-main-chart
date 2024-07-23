export default function encodeDates(dates: Date[]): string[] {
  const encodedDates: string[] = [];

  if (dates.length === 0) {
    return encodedDates;
  }

  encodedDates.push(dates[0].toISOString().split("T")[0]);

  for (let i = 1; i < dates.length; i++) {
    const currDate = dates[i];
    const prevDate = dates[i - 1];
    const currDay = currDate.getDate();
    const prevDay = prevDate.getDate();
    if (
      currDate.getMonth() === prevDate.getMonth() &&
      currDate.getFullYear() === prevDate.getFullYear()
    ) {
      encodedDates.push(currDay.toString().padStart(2, "0"));
    } else {
      encodedDates.push(currDate.toISOString().split("T")[0]);
    }
  }

  return encodedDates;
}
