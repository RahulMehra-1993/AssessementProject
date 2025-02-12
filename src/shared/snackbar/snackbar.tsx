import { Alert, Snackbar } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Snackbar as SnackbarProps } from "../../models/global/snackbar.model";
import { StoreContext } from "../../store/stateContext";

const CustomSnackBar: React.FC<SnackbarProps> = ({
  message,
  show,
  close,
  severity,
}) => {
   const context = useContext(StoreContext);
    if (!context) {
      throw new Error("StoreContext must be used within a StoreProvider");
    }
    const { state } = context;
  const [open, setOpen] = useState(show);

  useEffect(() => {
   !state.isModalOpen && setOpen(show);
  }, [message, show, severity]);

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
    close();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
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
