export const date2Obj = (date = Date.now()) => {
  const parseDate = new Date(date);
  const [year, month, day] = [parseInt(parseDate.getFullYear()), parseInt(parseDate.getMonth() + 1), parseInt(parseDate.getDate())];
  return { year, month, day };
};

export const obj2Date = (dateObj = date2Obj()) => {
  return new Date(dateObj.year, dateObj.month - 1, dateObj.day, 0, 0, 0, 0);
};
