/**
 *  datetime取得
 *  @param date String
 */
export const GetDatetime = (date: string): string => {
  const d: Date = new Date(date);
  return `${String(d.getFullYear())}-${String(d.getMonth() + 1)}-${String(
    d.getDate()
  )}T${String(d.getHours())}:${String(d.getMinutes())}`;
};

/**
 *  yyyy年mm月dd日 hh:mmを取得
 *  @param date String
 */
export const GetFullDate = (date: string): string => {
  const d: Date = new Date(date);
  return `${String(d.getFullYear())}年${String(d.getMonth() + 1)}月${String(
    d.getDate()
  )}日 ${String(d.getHours())}:${String(d.getMinutes())}`;
};
