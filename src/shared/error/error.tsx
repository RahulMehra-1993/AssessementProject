import { Box, Typography } from "@mui/material";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import useApi from "../../services/useCustomApiService";

interface ErrorProps {
  message: string;
}

const Error = ({ message }: ErrorProps) => {
  const { error } = useApi();

  // Function to select an icon based on error message
  const getErrorIcon = () => {
    if (!error) return <ErrorOutlineIcon color="error" />; // Default error icon
    if (error.toLowerCase().includes("user")) return <PersonOffIcon color="error" />; // User not found error
    if (error.toLowerCase().includes("question")) return <HelpOutlineIcon color="error" />; // Question not found error
    return <ErrorOutlineIcon color="error" />; // Fallback error icon
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="200px"
      gap={1}
    >
      {getErrorIcon()}
      <Typography variant="h5" align="center">
        {error ? error : message}
      </Typography>
    </Box>
  );
};

export default Error;
