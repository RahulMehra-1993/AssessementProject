import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import styles from "./error.module.css"; // Import module CSS
import CustomButton from "../../shared/buttons/custom-button";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container className={styles.errorContainer}>
      <Box className={styles.errorBox}>
        <ErrorOutlineIcon className={styles.errorIcon} />
        <Typography variant="h1" className={styles.errorCode}>
          404
        </Typography>
        <Typography variant="h5" className={styles.errorMessage}>
          Oops! Page Not Found
        </Typography>
        <Typography variant="body1" className={styles.errorDescription}>
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </Typography>
        <CustomButton
          onClick={() => navigate("/assessment/")}
          text="Back"
          isDisabled={false}
          variant={"contained"}
          sx={{
            backgroundImage: "var(--theme-bg-danger)",
            color: "white",
            mt:2
          }}
        />
      </Box>
    </Container>
  );
};

export default ErrorPage;
