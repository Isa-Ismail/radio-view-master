import AppButton from "@/app/components/Button";
import FilterDialog from "@/app/components/FilterDialog";
import { StyledDatePicker, StyledTimePicker } from "@/app/components/Input";
import { setDefaultDateRange } from "@/store/activities/activitiesSlice";
import { DateRangeDefaults, getDateRangeFromDefault } from "@/utils/DateRange";
import { Typography } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";

export default function DateTimeFilter({
  dialogOpen,
  setDialogOpen,
  value,
  onConfirm,
  defaultValue,
  hideTimeFilter = false,
  nonce,
}: {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  value?: {
    dateRange?: dayjs.Dayjs[];
    timeRange?: string[];
    defaultDateRange?: DateRangeDefaults;
  };
  onConfirm: (value: {
    dateRange?: dayjs.Dayjs[];
    timeRange?: string[];
    defaultDateRange?: DateRangeDefaults;
  }) => void;
  nonce: string;
  defaultValue: {
    dateRange?: dayjs.Dayjs[];
    timeRange?: string[];
    defaultDateRange?: DateRangeDefaults;
  };
  hideTimeFilter?: boolean;
}) {
  const [props, setProps] = useState<
    | {
        dateRange?: dayjs.Dayjs[];
        timeRange?: string[];
        defaultDateRange?: DateRangeDefaults;
      }
    | undefined
  >({
    dateRange: value?.dateRange,
    timeRange: value?.timeRange,
    defaultDateRange: value?.defaultDateRange,
  });

  const [dateRangeError, setDateRangeError] = useState<string | undefined>(
    undefined
  );

  const selectDefaultDateRange = (range: DateRangeDefaults) => {
    setDateRangeError(undefined);

    if (range == props?.defaultDateRange) {
      setProps({
        ...props,
        defaultDateRange: undefined,
      });
      return;
    }

    setProps({
      ...props,
      ...getDateRangeFromDefault(range),
    });
  };
  let startDate: dayjs.Dayjs | undefined;
  let endDate: dayjs.Dayjs | undefined;
  if (props?.dateRange) {
    if (props?.dateRange.length > 0) {
      startDate = props?.dateRange[0];
    }
    if (props?.dateRange.length > 1) {
      endDate = props?.dateRange[1];
    }
  }

  const reset = () => {
    setDateRangeError(undefined);
    setProps(defaultValue);
    onConfirm(defaultValue);
  };

  const confirm = () => {
    setDateRangeError(undefined);
    onConfirm({
      dateRange: props?.dateRange,
      timeRange: props?.timeRange,
      defaultDateRange: props?.defaultDateRange,
    });
  };
  return (
    <FilterDialog
      nonce={nonce}
      shouldConfirm={dateRangeError === undefined}
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      onConfirm={confirm}
      onCancel={() => {
        setDateRangeError(undefined);

        setProps({
          dateRange: value?.dateRange,
          timeRange: value?.timeRange,
          defaultDateRange: value?.defaultDateRange,
        });
      }}
      setProps={setProps}
      onReset={reset}
    >
      <div className="mb-4" id="Activity-range-filter">
        <>
          <div className="flex flex-row space-x-2 mb-2">
            {Object.values(DateRangeDefaults).map((range) => {
              return (
                <AppButton
                  nonce={nonce}
                  key={range}
                  variant={
                    props?.defaultDateRange === range ? "contained" : "outlined"
                  }
                  onClick={(_) => {
                    selectDefaultDateRange(range);
                  }}
                >
                  {range}
                </AppButton>
              );
            })}
          </div>
        </>
        <div>
          <div className="flex flex-row space-x-2">
            <div>
              <Typography variant="h6">Starting Date</Typography>
              <StyledDatePicker
                value={startDate}
                views={["year", "month", "day"]}
                onChange={(date) => {
                  if (date) {
                    let after = props?.dateRange?.[1];
                    let range: dayjs.Dayjs[];
                    if (after) {
                      range = [date, after];
                    } else {
                      range = [date];
                    }
                    setProps({
                      ...props,
                      dateRange: range,
                      defaultDateRange: undefined,
                    });
                    const isBefore = date.isBefore(props?.dateRange?.[1]);
                    const isSame = date.isSame(props?.dateRange?.[1]);
                    if (!isBefore && !isSame) {
                      setDateRangeError("Start date must be before end date");
                    } else {
                      setDateRangeError(undefined);
                    }
                  }
                }}
              ></StyledDatePicker>
            </div>
            <div>
              <Typography variant="h6">Ending Date</Typography>
              <StyledDatePicker
                value={endDate}
                views={["year", "month", "day"]}
                onChange={(date) => {
                  if (date) {
                    setDefaultDateRange(undefined);
                    let before = props?.dateRange?.[0];
                    let range: dayjs.Dayjs[];
                    if (before) {
                      range = [before, date];
                    } else {
                      range = [date];
                    }
                    setProps({
                      ...props,
                      dateRange: range,
                      defaultDateRange: undefined,
                    });
                    const isAfter = date.isAfter(props?.dateRange?.[0]);
                    const isSame = date.isSame(props?.dateRange?.[0]);
                    if (!isAfter && !isSame) {
                      setDateRangeError("End date must be after start date");
                    } else {
                      setDateRangeError(undefined);
                    }
                  }
                }}
              ></StyledDatePicker>
            </div>
          </div>
          {!hideTimeFilter && (
            <div className="flex flex-row space-x-2 mt-2">
              <div>
                <Typography variant="h6">Starting Time</Typography>
                <StyledTimePicker
                  value={startDate}
                  onChange={(date) => {
                    if (date) {
                      setDefaultDateRange(undefined);
                      let after = props?.dateRange?.[1];

                      setProps({
                        ...props,
                        dateRange: after ? [date, after] : [date],
                        defaultDateRange: undefined,
                      });
                      const isBefore = date.isBefore(props?.dateRange?.[1]);
                      const isSame = date.isSame(props?.dateRange?.[1]);

                      if (!isBefore && !isSame) {
                        setDateRangeError("Start date must be before end date");
                      } else {
                        setDateRangeError(undefined);
                      }
                    }
                  }}
                ></StyledTimePicker>
              </div>
              <div>
                <Typography variant="h6">Ending Time</Typography>
                <StyledTimePicker
                  value={endDate}
                  onChange={(date) => {
                    if (date) {
                      setDefaultDateRange(undefined);
                      let before = props?.dateRange?.[0];

                      setProps({
                        ...props,
                        dateRange: before ? [before, date] : [date],
                        defaultDateRange: undefined,
                      });
                      const isAfter = date.isAfter(props?.dateRange?.[0]);
                      const isSame = date.isSame(props?.dateRange?.[0]);
                      if (!isAfter && !isSame) {
                        setDateRangeError("End date must be after start date");
                      } else {
                        setDateRangeError(undefined);
                      }
                    }
                  }}
                ></StyledTimePicker>
              </div>
            </div>
          )}
          {dateRangeError && (
            <Typography color="error">{dateRangeError}</Typography>
          )}
        </div>
      </div>
    </FilterDialog>
  );
}
