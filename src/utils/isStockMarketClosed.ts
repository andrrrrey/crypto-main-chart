export default function isStockMarketClosed(): boolean {
  const currentDate = new Date();
  const currentDayOfWeek = currentDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  const currentHour = currentDate.getHours();

  // Check if it's Saturday or Sunday
  if (currentDayOfWeek === 0 || currentDayOfWeek === 6) {
    return true; // Stock market is closed on weekends
  }

  // Check if it's before 9:30 AM or after 4:00 PM
  if (
    currentHour < 9 ||
    (currentHour === 9 && currentDate.getMinutes() < 30) ||
    currentHour >= 16
  ) {
    return true; // Stock market is closed before 9:30 AM and after 4:00 PM
  }

  // Stock market is open
  return false;
}

// Example usage
