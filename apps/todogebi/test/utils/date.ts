import { DateTime } from 'luxon';

export class DateUtils {
  /**
   * Creates a Date object in UTC for the given year, month, and day.
   * @param year The year
   * @param month The month (1-12)
   * @param day The day of the month
   * @returns A Date object in UTC
   */
  static createDate(year: number, month: number, day: number): Date {
    return DateTime.utc(year, month, day).toJSDate();
  }

  /**
   * Converts a Date object to an ISO string in UTC
   * @param date The Date object to convert
   * @returns An ISO string representation of the date in UTC
   */
  static toISOString(date: Date): string {
    return date.toISOString();
  }

  /**
   * Parses an ISO string to a Date object
   * @param isoString The ISO string to parse
   * @returns A Date object
   */
  static fromISOString(isoString: string): Date {
    return new Date(isoString);
  }

  /**
   * Formats a Date object to a specific format in UTC
   * @param date The Date object to format
   * @param format The desired format (e.g., 'yyyy-MM-dd')
   * @returns A formatted string representation of the date in UTC
   */
  static formatUTC(date: Date, format: string): string {
    return DateTime.fromJSDate(date).toUTC().toFormat(format);
  }
}
