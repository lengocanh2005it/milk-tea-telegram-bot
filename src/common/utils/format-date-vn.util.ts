import { addHours, format, parse } from 'date-fns';

export function formatDateTimeVN(
  dateString: string,
  pattern = "'Lúc' HH:mm 'ngày' dd/MM/yyyy",
): string {
  const parsedDate = parse(dateString, 'HH:mm:ss d/M/yyyy', new Date());

  const plus7Hours = addHours(parsedDate, 7);

  return format(plus7Hours, pattern);
}
