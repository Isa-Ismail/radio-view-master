import dayjs from "dayjs";

export enum DateRangeDefaults {
  Day = "24 hours",
  Week = "1 week",
  Month = "1 month",
}

export function getDateRangeFromDefault(range: DateRangeDefaults): {
  dateRange: dayjs.Dayjs[];
  defaultDateRange: DateRangeDefaults;
} {
  let dateRange: dayjs.Dayjs[] = [];

  switch (range) {
    case DateRangeDefaults.Day:
      dateRange = [dayjs().subtract(24, "hours").startOf("day"), dayjs().endOf("day")];
      break;
    case DateRangeDefaults.Week:
      dateRange = [dayjs().subtract(7, "days").startOf("day"), dayjs().endOf("day")];
      break;
    case DateRangeDefaults.Month:
      dateRange = [dayjs().subtract(30, "days").startOf("day"), dayjs().endOf("day")];
      break;
  }
  return {
    dateRange,
    defaultDateRange: range,
  };
}

export function getDateRange(range: number): dayjs.Dayjs[] {
  return [dayjs().subtract(range, "days").startOf("day"), dayjs().endOf("day")];
}
