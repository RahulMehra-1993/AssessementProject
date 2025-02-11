import { Alert, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Snackbar as SnackbarProps } from "../../models/global/snackbar.model";

const CustomSnackBar: React.FC<SnackbarProps> = ({
  message,
  show,
  close,
  severity,
}) => {
  const [open, setOpen] = useState(show);

  useEffect(() => {
    console.log("Snackbar Severity:", severity);
    console.log("Snackbar Message:", message);
    console.log("Snackbar Show:", show);
    
    setOpen(show);
  }, [message, show, severity]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
    close();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity || "info"} // Default to "info" if severity is undefined
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackBar;
