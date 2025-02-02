import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import styles from "./error.module.css"; // Import module CSS

const ErrorPage: React.FC = () => {
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
          The page you are looking for might have been removed or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          className={styles.errorButton}
        >
          Go Back Home
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;
