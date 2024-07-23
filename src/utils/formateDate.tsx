function formatDate(dateParam: Date) {
  const date = dateParam;
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear().toString();

  return `${year}-${month}-${day}`;
}

export default formatDate;
