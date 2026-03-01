import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const VIETNAM_TZ = 'Asia/Ho_Chi_Minh';

export function formatDateTimeVN(
  date: Date,
  pattern = 'HH:mm dd/MM/yyyy',
): string {
  const zonedDate = toZonedTime(date, VIETNAM_TZ);
  return format(zonedDate, pattern);
}
