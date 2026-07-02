export const parseDate = (value?: string | null) => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);

  return result;
};

export const isSameDay = (first: Date, second: Date) => {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
};

export const toIsoAtLocalTime = (
  dateValue: string | null | undefined,
  hours: number,
  minutes = 0,
) => {
  const date = parseDate(dateValue);
  if (!date) return null;

  date.setHours(hours, minutes, 0, 0);

  return date.toISOString();
};
