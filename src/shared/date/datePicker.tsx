import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker"; // Import DatePickerProps
import { useState } from "react";
import { Dayjs } from "dayjs";
import React from "react";

interface CustomDatePickerProps
  extends Omit<DatePickerProps<Dayjs>, "onChange"> {
  onChange: (newValue: Dayjs | null) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  onChange,
  ...rest
}) => {
  const [passingYear, setPassingYear] = useState<Dayjs | null>(null);

  const handleChange = (newValue: Dayjs | null) => {
    setPassingYear(newValue);
    onChange(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Year of Passing"
        value={passingYear}
        onChange={handleChange} // Use the wrapper function
        views={["year"]}
        format="YYYY"
        {...rest} // Spread other DatePicker props
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "preventOverflow",
                options: {
                  boundary: "window",
                },
              },
            ],
          },
          desktopPaper: {
            sx: {
              width: "300px",
              height: "200px",
              overflow: "hidden",
              "& .MuiPickersYear-yearButton": {
                fontSize: "12px !important",
                padding: "0",
              },
              "& .MuiPickersYear-yearButton.Mui-selected": {
                backgroundImage: "var(--theme-bg-danger) !important",
                color: "white !important",
                padding: "0 !important",
              },
            },
          },
        }}
        sx={{
          mb: 4,
          width: "100%",
          font: "initial",
          "& .MuiInputLabel-root": {
            fontSize: "var(--font-size-xs)",
          },
          "& .MuiInputBase-input": {
            fontSize: "var(--font-size-xs)",
          },
          "& .MuiOutlinedInput-root": {
            fontSize: "var(--font-size-xs)",
          },
          "& .MuiInputLabel-shrink": {
            fontSize: "var(--font-size-xs)",
          },
          "& .MuiOutlinedInput-notchedOutline": {},
          "& .MuiPickersDay-root.Mui-selected": {
            backgroundColor: "red !important",
            color: "white !important",
          },
          "& .MuiPickersYear-yearButton.Mui-selected": {
            backgroundColor: "red !important",
            color: "white !important",
          },
        }}
        
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
