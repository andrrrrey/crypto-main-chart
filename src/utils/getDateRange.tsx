import isStockMarketClosed from "./isStockMarketClosed";

interface DateRange {
  formattedStartDate: string;
  formattedEndDate: string;
  pointValue: string;
}
export type Interval =
  | "1day"
  | "5day"
  | "1month"
  | "6month"
  | "ytd"
  | "1year"
  | "5year"
  | "max";
export default function getDateRange(interval: Interval): DateRange {
  const today: Date = new Date(); // Get today's date
  let pointValue = "1day";
  // Calculate start date based on the interval
  const startDate: Date = new Date(today);

  switch (interval) {
    case "1day":
      // console.log(startDate, "start");
      if (isStockMarketClosed()) {
        startDate.setDate(today.getDate() - 3); // 3day ago
      } else {
        startDate.setDate(today.getDate() - 1); // 1 day ago
      }
      pointValue = "15min";
      break;
    case "5day":
      startDate.setDate(today.getDate() - 5); // 5 days ago
      pointValue = "1h";
      break;
    case "1month":
      startDate.setMonth(today.getMonth() - 1); // 1 month ago
      pointValue = "1day";
      break;
    case "6month":
      startDate.setMonth(today.getMonth() - 6); // 6 months ago
      pointValue = "1week";
      break;
    case "ytd": {
      startDate.setFullYear(today.getFullYear(), 0, 1); // Start of the year
      const monthsElapsed = today.getMonth(); // Months elapsed since start of the year
      if (monthsElapsed < 1) {
        pointValue = "1day";
      } else if (monthsElapsed < 4) {
        pointValue = "1week";
      } else if (monthsElapsed >= 10 && monthsElapsed <= 11) {
        pointValue = "1month";
      }
      break;
    }
    case "1year":
      startDate.setFullYear(today.getFullYear() - 1); // 1 year ago
      pointValue = "1week";
      break;
    case "5year":
      startDate.setFullYear(today.getFullYear() - 5); // 5 years ago
      pointValue = "1month";
      break;
    case "max":
      // Assuming "max" means no specific end date, so return today's date as end date
      startDate.setFullYear(today.getFullYear() - 10); // 5 years ago
      pointValue = "1month";
      break;
    default:
      throw new Error("Invalid interval specified");
  }

  // Format dates to yyyy-mm-dd
  const formattedStartDate: string = startDate.toISOString().split("T")[0];
  const formattedEndDate: string = today.toISOString().split("T")[0];
  return { formattedStartDate, formattedEndDate, pointValue };
}
