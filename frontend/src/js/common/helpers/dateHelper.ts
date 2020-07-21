import {
  format,
  parse,
  addQuarters,
  lastDayOfQuarter,
  addMonths,
  endOfMonth,
  isValid,
  differenceInCalendarDays,
  formatDistance
} from "date-fns";

import { getDateLocale } from "../../localization";

// To save the date in this format in the state
const DATE_FORMAT = "yyyy-MM-dd";

export const formatDateDistance = (d1: Date, d2: Date, withSuffix = false) => {
  const dateLocale = getDateLocale();

  // @ts-ignore
  return formatDistance(d1, d2, { locale: dateLocale, addSuffix: withSuffix });
};

export const formatStdDate = (date: Date) => {
  return formatDate(date, DATE_FORMAT);
};

export const formatDate = (date: Date, dateFormat: string) => {
  return date ? format(date, dateFormat) : "";
};

export const formatDateFromState = (
  dateString: string,
  dateFormat: string
): string => {
  const date = parseDate(dateString, DATE_FORMAT);

  return date !== null ? format(date, dateFormat) : dateString;
};

export const parseDateToState = (date: Date) => {
  return format(date, DATE_FORMAT);
};

export const parseDate = (dateString: string, dateFormat: string) => {
  // Otherwise 15.06.2 parses years as 15.06.0002
  if (!dateString || dateString.length !== dateFormat.length) return null;

  const date = parse(dateString, dateFormat, new Date());

  return isValid(date) ? date : null;
};

export const parseStdDate = (dateString: string) => {
  return parseDate(dateString, DATE_FORMAT);
};

const DATE_PATTERN = {
  raw: /(^\d{8})$/,
  year: /^[yj][.]*(\d{4})$/,
  quarterYear: /^[q]([1-4]).(\d{4})$/,
  monthYear: /^[m](1[0-2]|[1-9]).(\d{4})$/
};

// @ts-ignore
function handleRaw(what, value, displayDateFormat) {
  const denseFormat = displayDateFormat.replace(/[-/.]/g, "");
  // Assuming the format consists of 2 M, 2 d, and 2 y

  const dIdx = denseFormat.indexOf("d");
  const d = value.substring(dIdx, dIdx + 2);

  const mIdx = denseFormat.indexOf("M");
  const m = value.substring(mIdx, mIdx + 2);

  const yIdx = denseFormat.indexOf("y");
  const y = value.substring(yIdx, yIdx + 4);

  let date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));

  // @ts-ignore
  date = isValid(date) ? date : null;

  if (what === "min") return { min: date, max: null };
  else return { min: null, max: date };
}

// @ts-ignore
function handleYear(what, value) {
  // @ts-ignore
  const year = parseInt(DATE_PATTERN.year.exec(value)[1]);

  const min = new Date(year, 0, 1);
  const max = new Date(year, 11, 31);

  return { min, max };
}

// @ts-ignore
function handleQuarter(what, value) {
  const match = DATE_PATTERN.quarterYear.exec(value);

  // @ts-ignore
  const quarter = parseInt(match[1]);
  // @ts-ignore
  const year = parseInt(match[2]);

  const min = addQuarters(new Date(year, 0, 1), quarter - 1);
  const max = lastDayOfQuarter(addQuarters(new Date(year, 0, 1), quarter - 1));

  return { min, max };
}

// @ts-ignore
function handleMonth(what, value) {
  const match = DATE_PATTERN.monthYear.exec(value);

  // @ts-ignore
  const month = parseInt(match[1]);
  // @ts-ignore
  const year = parseInt(match[2]);

  const min = addMonths(new Date(year, 0, 1), month - 1);
  const max = endOfMonth(addMonths(new Date(year, 0, 1), month - 1));

  return { min, max };
}

interface MinMax {
  min: string | null; // in DATE_FORMAT
  max: string | null; // in DATE_FORMAT
}

export const getDateStringFromShortcut = (
  what: "min" | "max",
  value: string,
  displayDateFormat: string
): MinMax => {
  const date = testRegexes(what, value, displayDateFormat);

  return {
    min: date.min ? format(date.min, DATE_FORMAT) : null,
    max: date.max ? format(date.max, DATE_FORMAT) : null
  };
};

interface DateMinMax {
  min: Date | null;
  max: Date | null;
}

export const testRegexes = (
  what: "min" | "max",
  value: string,
  displayDateFormat: string
): DateMinMax => {
  switch (true) {
    case DATE_PATTERN.raw.test(value):
      return handleRaw(what, value, displayDateFormat);
    case DATE_PATTERN.year.test(value):
      return handleYear(what, value);
    case DATE_PATTERN.quarterYear.test(value):
      return handleQuarter(what, value);
    case DATE_PATTERN.monthYear.test(value):
      return handleMonth(what, value);
    default:
      return { min: null, max: null };
  }
};

export function getDiffInDays(d1: Date, d2: Date) {
  return differenceInCalendarDays(d1, d2);
}
