import { Alert as MuiAlert, Snackbar } from "@mui/material";

interface CustomAlertProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ open, onClose, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
    >
      <MuiAlert onClose={onClose} severity="success" sx={{ width: "100%" }}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default CustomAlert;
