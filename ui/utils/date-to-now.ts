import { formatDistanceToNow } from "date-fns";

export function dateToNow(date: string | Date): string {
  const result = formatDistanceToNow(new Date(date), { addSuffix: true });

  return result;
}
