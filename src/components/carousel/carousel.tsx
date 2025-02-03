import React, { useState } from "react";
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
  Snackbar,
  Alert,
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
import { Question } from "../../models/Assessement";

interface QuizProps {
  questions: Question[];
}

const AssessementCarousel: React.FC<QuizProps> = ({ questions }) => {
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

  const handleJumpToNext10 = () => {
    const nextIndex = Math.min(currentQuestionIndex + 10, questions.length - 1);
    setCurrentQuestionIndex(nextIndex);
  };

  const handleJumpToPrevious10 = () => {
    const previousIndex = Math.max(currentQuestionIndex - 10, 0); // Ensure index doesn't go below 0
    setCurrentQuestionIndex(previousIndex);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = event.target.value;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    const unanswered = selectedAnswers.filter(
      (answer) => answer === null
    ).length;
    if (unanswered > 0) {
      setSnackbarMessage(`Please answer all questions. ${unanswered} left.`);
      setShowSnackbar(true);
      return;
    }

    setConfirmSubmit(true);
  };

  const confirmSubmission = () => {
    const assessmentResults = questions.map((question, index) => ({
      id: question.id,
      question: question.question,
      selectedAnswer: selectedAnswers[index],
    }));

    console.log("Quiz Results:", assessmentResults);
    setIsQuizCompleted(true);
    setIsModalOpen(true);
    setSnackbarMessage("Quiz completed successfully!");
    setShowSnackbar(true);
    setConfirmSubmit(false);
  };

  const answeredQuestions = selectedAnswers.filter(
    (answer) => answer !== null
  ).length;
  const totalPages = Math.ceil(questions.length / 10);
  const currentPage = Math.floor(currentQuestionIndex / 10);
  const hasMoreQuestions = currentPage < totalPages - 1;
  const hasPreviousQuestions = currentPage > 0; // Check if there are previous questions

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
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
            backgroundImage:
              "linear-gradient(to left, #bb462b, #bc423a, #bb4049, #b84056, #b34262)", // Your gradient
          },
        }}
      />
      <Typography
        variant="body2"
        sx={{ mb: 1, fontWeight: "bold", fontSize: "0.75rem" }}
      >
        Showing questions {currentPage * 10 + 1} -{" "}
        {Math.min((currentPage + 1) * 10, questions.length)} of{" "}
        {questions.length}
      </Typography>
      <Grid container spacing={1} justifyContent="center" sx={{ mb: 2 }}>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleJumpToPrevious10}
            disabled={!hasPreviousQuestions} 
            sx={{
              mr: 2, 
              borderRadius: 30,
              backgroundImage:
                "linear-gradient(to left, #bb462b, #bc423a, #bb4049, #b84056, #b34262) !important",
              ...(hasPreviousQuestions
                ? {}
                : {
                    opacity: 0.5,
                    cursor: "default",
                    "&:hover": {
                      backgroundColor: "initial",
                      backgroundImage:
                        "linear-gradient(to left, #bb462b, #bc423a, #bb4049, #b84056, #b34262) !important",
                    },
                  }),
            }}
          >
            {"<<"} Previous 10
          </Button>
        </Grid>
        {questions
          .slice(currentPage * 10, (currentPage + 1) * 10)
          .map((_, index) => (
            <Grid item key={index}>
              <IconButton
                onClick={() => handleJumpToQuestion(currentPage * 10 + index)}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  backgroundColor: selectedAnswers[currentPage * 10 + index]
                    ? "#26c579"
                    : "#d3d3d3",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#1b8a5a" },
                }}
              >
                {currentPage * 10 + index + 1}
              </IconButton>
            </Grid>
          ))}
        <Grid item>
          <Button
            variant="contained"
            onClick={handleJumpToNext10}
            disabled={!hasMoreQuestions}
            sx={{
              ml: 2,
              borderRadius: 30,
              backgroundImage:
                "linear-gradient(to left, #bb462b, #bc423a, #bb4049, #b84056, #b34262) !important",
              ...(hasMoreQuestions
                ? {}
                : {
                    opacity: 0.5,
                    cursor: "default",
                    "&:hover": {
                      backgroundColor: "initial",
                      backgroundImage:
                        "linear-gradient(to left, #bb462b, #bc423a, #bb4049, #b84056, #b34262) !important",
                    },
                  }),
            }}
          >
            Next 10 {">>"}
          </Button>
        </Grid>
      </Grid>
      <Card
        sx={{
          borderRadius: 10,
          width: "90%",
          maxWidth: "auto", 
          minHeight: 250,
          mb: 3,
          p: 2,
          overflow: "auto",
        }}
      >
        <CardContent>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{ mb: 1 }}
          >
            <Typography variant="body2">Assessment</Typography>
            <Typography variant="body2" sx={{ fontSize: ".75rem" }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
          </Breadcrumbs>
          <Typography
            variant="body1"
            sx={{
              marginBottom: 2,
              fontWeight: "",
              fontSize: "1rem", 
              lineHeight: "1.2",
            }}
          >
            {questions[currentQuestionIndex].question}
          </Typography>
          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <FormLabel component="legend" sx={{ fontSize: ".75rem" }}>
              Choose an answer:
            </FormLabel>
            <RadioGroup
              value={selectedAnswers[currentQuestionIndex] || ""}
              onChange={handleOptionChange}
            >
              {questions[currentQuestionIndex].options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={
                    <Typography sx={{ fontSize: ".75rem" }}>
                      {option}
                    </Typography>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          sx={{
            borderRadius: 30,
            backgroundImage:
              "linear-gradient(to left, #bb462b, #bc423a, #bb4049, #b84056, #b34262) !important",
            ...(currentQuestionIndex !== 0
              ? {}
              : {
                  opacity: 0.5,
                  cursor: "default",
                  "&:hover": {
                    backgroundColor: "initial",
                    backgroundImage:
                      "linear-gradient(to left, #bb462b, #bc423a, #bb4049, #b84056, #b34262) !important",
                  },
                }),
          }}
        >
          {"<"} Previous
        </Button>
        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            sx={{
              borderRadius: 30,
            }}
            variant="contained"
            disabled={isQuizCompleted}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNextQuestion}
            sx={{
              borderRadius: 30,
              backgroundImage:
                "linear-gradient(to left, #bb462b, #bc423a, #bb4049, #b84056, #b34262) !important",
              ...(currentQuestionIndex < questions.length - 1
                ? {}
                : {
                    opacity: 0.5,
                    cursor: "default",
                    "&:hover": {
                      backgroundColor: "initial",
                      backgroundImage:
                        "linear-gradient(to left, #bb462b, #bc423a, #bb4049, #b84056, #b34262) !important",
                    },
                  }),
            }}
          >
            Next {">"}
          </Button>
        )}
      </Box>
      <Typography
        variant="body2"
        sx={{ color: "gray", mb: 2, textAlign: "center" }}
      >
        {hasMoreQuestions
          ? "More questions available. Navigate using the buttons or number selector."
          : "No more questions."}
      </Typography>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert severity="info" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{ padding: 4, textAlign: "center" }}>
          <CheckCircle sx={{ fontSize: 50, color: "#26c579" }} />
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Assessment Completed!
          </Typography>
        </Box>
      </CustomModal>
      <Dialog
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
        sx={{ borderRadius: 8 }}
      >
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to submit your answers?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmSubmit(false)}
            variant="outlined"
            sx={{
              mt: 3,
              color: "gray", // Modern UI gray for cancel
              borderColor: "gray", // Gray border
              fontWeight: 600,
              borderRadius: 30,
              padding: "10px 24px",
              textTransform: "none",
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)", // Very light gray hover background
                borderColor: "gray", // Maintain gray border on hover
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmSubmission}
            color="primary"
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#26c579",
              color: "#fff",
              fontWeight: 600,
              borderRadius: 30,
              padding: "10px 24px",
              textTransform: "none",
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "#1e9c61",
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessementCarousel;
