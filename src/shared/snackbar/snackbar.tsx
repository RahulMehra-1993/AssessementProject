import { Alert, Snackbar, AlertProps } from "@mui/material";
import React from "react";

interface CustomSnackBarProps {
  message: string | null |undefined;
  show: boolean;
  close: () => void; // Important: Define the close function type
  severity?: AlertProps["severity"]; // Make severity optional, and of correct type
}

const CustomSnackBar: React.FC<CustomSnackBarProps> = ({
  message,
  show,
  close,
  severity = "info", // Default severity to "info"
}) => {
  return (
    <Snackbar open={show} autoHideDuration={3000} onClose={close}>
      <Alert onClose={close} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackBar;