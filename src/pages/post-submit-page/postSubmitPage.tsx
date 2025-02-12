import React from "react";
import { Container, Typography, Box } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import styles from "./postSubmitPage.module.css"; // Import module CSS

const PostSubmission: React.FC = () => {
  return (
    <Container className={styles.submissionContainer}>
      <Box className={styles.submissionBox}>
        <CheckCircleOutlineIcon className={styles.successIcon} />
        <Typography variant="h4" className={styles.submissionMessage}>
          Assessment has been submitted
        </Typography>
        <Typography variant="body1" className={styles.submissionDescription}>
          If you have any further queries, please check your email for details.
        </Typography>
      </Box>
    </Container>
  );
};

export default PostSubmission;
