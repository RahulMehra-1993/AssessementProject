import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  LinearProgress,
  IconButton,
  Grid,
  Breadcrumbs,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { CheckCircle, NavigateNext } from "@mui/icons-material";
import CustomModal from "../modal/modal";
import { AssessmentProps } from "../../models/carousel/assessment.model";
import CustomSnackBar from "../../shared/snackbar/snackbar";
import CustomButton from "../../shared/buttons/custom-button";

const AssessementCarousel: React.FC<AssessmentProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleJumpToNext5 = () => {
    const nextIndex = Math.min(currentQuestionIndex + 5, questions.length - 1);
    setCurrentQuestionIndex(nextIndex);
  };

  const handleJumpToPrevious5 = () => {
    const previousIndex = Math.max(currentQuestionIndex - 5, 0); // Ensure index doesn't go below 0
    setCurrentQuestionIndex(previousIndex);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = event.target.value;
    setSelectedAnswers(updatedAnswers);

    //set local storage
    // Store in session storage
    sessionStorage.setItem("selectedAnswers", JSON.stringify(updatedAnswers));
  };

  const handleSubmit = () => {
    // const unanswered = selectedAnswers.filter(
    //   (answer) => answer === null
    // ).length;
    // if (unanswered > 0) {
    //   setSnackbarMessage(`Please answer all questions. ${unanswered} left.`);
    //   setShowSnackbar(true);
    //   return;
    // }
    if (answeredQuestions > 0) {
      setConfirmSubmit(true);
    } else {
      const unanswered = selectedAnswers.filter(
        (answer) => answer === null
      ).length;
      setSnackbarMessage(
        `You haven't started answering yet. Please answer at least one question.`
      );
      setShowSnackbar(true);
      return;
    }
  };

  const confirmSubmission = () => {
    const assessmentResults = questions.map((question, index) => ({
      id: question.id,
      question: question.question,
      selectedAnswer: selectedAnswers[index],
    }));

    console.log("Assessment Results:", assessmentResults);
    setIsQuizCompleted(true);
    setIsModalOpen(true);
    setSnackbarMessage("Quiz completed successfully!");
    setShowSnackbar(true);
    setConfirmSubmit(false);
    sessionStorage.removeItem("selectedAnswers");
    sessionStorage.removeItem("user");

    // Add a delay (e.g., 3 seconds) before reloading the page
    setTimeout(() => {
      window.location.reload(); // Reload the window after 3 seconds
    }, 3000); // 3000 milliseconds = 3 seconds
  };

  const answeredQuestions = selectedAnswers.filter(
    (answer) => answer !== null
  ).length;
  const totalPages = Math.ceil(questions.length / 5);
  const currentPage = Math.floor(currentQuestionIndex / 5);
  const hasMoreQuestions = currentPage < totalPages - 1;
  const hasPreviousQuestions = currentPage > 0; // Check if there are previous questions

  // Load saved answers from session storage when component mounts
  useEffect(() => {
    const savedAnswers = sessionStorage.getItem("selectedAnswers");
    if (savedAnswers) {
      setSelectedAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 1,
        width: {
          xs: "100%", // Full width on extra small screens
          sm: "90%", // Slightly smaller on small screens
          md: "80%", // Medium screens
          lg: "70%", // Large screens
          xl: "60%", // Extra large screens
        },
      }}
    >
      <LinearProgress
        variant="determinate"
        value={(answeredQuestions / questions.length) * 100}
        sx={{
          width: "90%",
          mb: 2,
          backgroundColor: "#e0e0e0", // Light gray background for the track
          "& .MuiLinearProgress-bar": {
            // Target the progress bar
            backgroundImage: "var(--theme-bg-danger)", // Your gradient
          },
        }}
      />

      <Grid
        container
        spacing={1}
        gap={1}
        justifyContent="center"
        sx={{ mb: 2 }}
      >
        <Grid item>
          <CustomButton
            onClick={handleJumpToPrevious5}
            text="<< Previous"
            isDisabled={!hasPreviousQuestions}
            variant={"contained"}
            sx={{
              backgroundImage: "var(--theme-bg-neutral)",
              color: "white",
            }}
          />
        </Grid>
        {questions
          .slice(currentPage * 5, (currentPage + 1) * 5)
          .map((_, index) => (
            <Grid item key={index}>
              <IconButton
                onClick={() => handleJumpToQuestion(currentPage * 5 + index)}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  backgroundColor: selectedAnswers[currentPage * 5 + index]
                    ? "#26c579"
                    : "#d3d3d3",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#1b8a5a" },
                }}
              >
                {currentPage * 5 + index + 1}
              </IconButton>
            </Grid>
          ))}
        <Grid item>
          <CustomButton
            onClick={handleJumpToNext5}
            text="Next >>"
            isDisabled={!hasMoreQuestions}
            variant={"contained"}
            sx={{
              backgroundImage: "var(--theme-bg-neutral)",
              color: "white",
            }}
          />
        </Grid>
      </Grid>

      <Typography
        variant="body2"
        sx={{ mb: 1, fontWeight: "bold", fontSize: "0.75rem" }}
      >
        Showing questions {currentPage * 5 + 1} -{" "}
        {Math.min((currentPage + 1) * 5, questions.length)} of{" "}
        {questions.length}
      </Typography>

      <Card
        sx={{
          borderRadius: 10,
          width: "90%",
          maxWidth: "auto",
          minHeight: 250,
          mb: 2,
          p: 1,
          overflow: "auto",
        }}
      >
        <CardContent>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "flex-start", // Aligns to the end (right)
              alignItems: "center", // Vertically centers the items
              fontWeight: 500, // More emphasis on the text
              color: "text.secondary", // Lighter text color for modern design
              fontSize: "0.875rem", // Slightly smaller font size for a cleaner look
            }}
          >
            <Typography sx={{ fontWeight: 600, color: "primary.main" }}>
              Question
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", color: "text.primary" }}
            >
              {currentQuestionIndex + 1} / {questions.length}
            </Typography>
          </Breadcrumbs>

          <Typography
            variant="body1"
            sx={{
              marginBottom: 2,
              fontWeight: "",
              fontSize: "14px",
              lineHeight: "1.2",
            }}
          >
            {questions[currentQuestionIndex].question}
          </Typography>
          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <FormLabel
              component="legend"
              sx={{
                fontSize: "14px", // Updated to 14px for the header
                fontWeight: 600,
                color: "text.primary",
                mb: 2,
              }}
            >
              Choose an answer:
            </FormLabel>
            <RadioGroup
              value={selectedAnswers[currentQuestionIndex] || ""}
              onChange={handleOptionChange}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              {questions[currentQuestionIndex].options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={
                    <Radio
                      sx={{
                        fontSize: "12px", // Font size for the radio button itself
                        "&.Mui-checked": {
                          color: "#e16a54", // Selected radio button color
                          transform: "scale(1.2)", // Slight scale effect when selected
                          transition: "transform 0.3s ease, color 0.3s ease", // Smooth transition on selection
                        },
                        "&:hover": {
                          backgroundColor: "rgba(245, 124, 32, 0.06)", // Hover effect (light orange)
                        },
                        transition: "background-color 0.3s ease",
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontSize: "12px", // Updated to 12px for the options labels
                        color: "text.primary",
                        fontWeight: 500,
                      }}
                    >
                      {option}
                    </Typography>
                  }
                  sx={{
                    "&.MuiFormControlLabel-root": {
                      marginBottom: "12px", // Spacing between options
                      transition: "transform 0.3s ease", // Smooth transition when hovering over the option
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </CardContent>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3 }}>
          {/* Previous Button */}
          <CustomButton
            onClick={handlePrevQuestion}
            text="<"
            isDisabled={currentQuestionIndex === 0}
            variant={"contained"}
            sx={{
              backgroundImage: "var(--theme-bg-danger)",
              color: "white",
            }}
          />

          {/* Conditional Button - Next or Submit */}

          <CustomButton
            onClick={handleNextQuestion}
            text=">"
            isDisabled={currentQuestionIndex === questions.length - 1}
            variant={"contained"}
            sx={{
              backgroundImage: "var(--theme-bg-danger)",
            }}
          />

          <CustomButton
            variant="contained"
            onClick={handleSubmit}
            isDisabled={isQuizCompleted}
            text="Submit"
          />
        </Box>
        <Typography
          variant="body2"
          sx={{ color: "gray", mb: 2, textAlign: "center" }}
        >
          {hasMoreQuestions
            ? "More questions available. Navigate using the buttons or number selector."
            : "No more questions."}
        </Typography>
      </Card>

      <CustomSnackBar
        message={snackbarMessage}
        show={showSnackbar}
        close={() => setShowSnackbar(false)}
      />

      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            padding: 4,
            textAlign: "center",
            opacity: 0, // Start with opacity 0
            transform: "scale(0.8)", // Start with a smaller scale
            animation: "fadeInScale 1s forwards", // Apply the custom animation
            "@keyframes fadeInScale": {
              // Define the animation using keyframes
              "0%": {
                opacity: 0,
                transform: "scale(0.8)",
              },
              "100%": {
                opacity: 1,
                transform: "scale(1)",
              },
            },
          }}
        >
          <CheckCircle sx={{ fontSize: 50, color: "#26c579" }} />
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Assessment Completed!
          </Typography>
        </Box>
      </CustomModal>

      <Dialog
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
        sx={{
          "& .MuiDialog-paper": {
            padding: "12px",
            borderRadius: "32px",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          Confirm Submission
        </DialogTitle>
        <DialogContent>
          {/* Added padding here */}
          <Typography
            variant="h6"
            sx={{ fontSize: "18px", fontWeight: "bold", mb: 2 }}
          >
            Are you sure you want to submit your answers?
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "14px", color: "text.secondary", mb: 2 }}
          >
            You have answered {answeredQuestions} of {questions.length}{" "}
            questions.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "14px",
              fontStyle: "italic",
              color:
                answeredQuestions === questions.length
                  ? "success.main"
                  : "warning.main",
            }}
          >
            {answeredQuestions === questions.length
              ? "All questions answered!"
              : "You still have unanswered questions."}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <CustomButton
            variant="contained"
            onClick={() => {
              setConfirmSubmit(false);
            }}
            text="Cancel"
            sx={{
              backgroundImage: "var(--theme-bg-neutral)",
            }}
          />
          <CustomButton
            variant="contained"
            onClick={confirmSubmission}
            text="Submit"
            sx={{
              backgroundImage: "var(--theme-bg-success)",
            }}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessementCarousel;
