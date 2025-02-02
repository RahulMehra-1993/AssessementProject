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
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
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

    // Creating an object to store results   to update or post to the server
  const asssessmentResults = questions.map((question, index) => ({
    id: question.id, // Assuming each question has an 'id' field
    question: question.question,
    selectedAnswer: selectedAnswers[index],
  }));

  console.log("Quiz Results:", asssessmentResults); // Log results to console

    setIsQuizCompleted(true);
    setIsModalOpen(true);
    setSnackbarMessage("Quiz completed successfully!");
    setShowSnackbar(true);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredQuestions = selectedAnswers.filter(
    (answer) => answer !== null
  ).length;

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
        sx={{ width: "90%", mb: 2 }}
      />

      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
        {questions.map((_, index) => (
          <IconButton
            key={index}
            onClick={() => handleJumpToQuestion(index)}
            sx={{
              width: 35,
              height: 35,
              borderRadius: "50%",
              backgroundColor: selectedAnswers[index] ? "#26c579" : "#d3d3d3",
              color: "#fff",
              fontSize: "0.9rem",
              fontWeight: "bold",
              transition: "0.3s",
              "&:hover": {
                backgroundColor: selectedAnswers[index] ? "#1b8a5a" : "#b0b0b0",
              },
            }}
          >
            {index + 1}
          </IconButton>
        ))}
      </Box>

      <Typography
        variant="body2"
        sx={{ alignSelf: "center", fontWeight: "bold" }}
      >
        Question {currentQuestionIndex + 1} of {questions.length}
      </Typography>

      <Card
        sx={{
          borderRadius: 10,
          width: "90%",
          maxWidth: 600,
          minHeight: 250,
          marginBottom: 3,
          padding: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="body1"
            sx={{ marginBottom: 2, fontWeight: "bold" }}
          >
            {currentQuestion.question}
          </Typography>
          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <FormLabel component="legend">Choose an answer:</FormLabel>
            <RadioGroup
              value={selectedAnswers[currentQuestionIndex] || ""}
              onChange={handleOptionChange}
            >
              {currentQuestion.options.map((option: string | null| undefined, index: React.Key | null | undefined) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '14px', // Adjust font size as needed
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 5, mb: 3 }}>
        <Button
          variant="outlined"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          sx={{
            backgroundColor: currentQuestionIndex === 0 ? "#d3d3d3" : "#1976d2",
            color: currentQuestionIndex === 0 ? "#808080" : "#fff",
            "&:hover": {
              backgroundColor:
                currentQuestionIndex === 0 ? "#d3d3d3" : "#0d3b69",
            },
            borderRadius: 25,
            padding: "8px 16px",
          }}
        >
          Previous
        </Button>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            variant="contained"
            disabled={isQuizCompleted}
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#26c579",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1e9c61",
              },
              "&:disabled": {
                backgroundColor: "#d3d3d3",
                color: "#808080",
              },
              borderRadius: 25,
              padding: "8px 16px",
            }}
          >
            Submit
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNextQuestion}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#0d3b69",
              },
              "&:disabled": {
                backgroundColor: "#d3d3d3",
                color: "#808080",
              },
              borderRadius: 25,
              padding: "8px 16px",
            }}
          >
            Next
          </Button>
        )}
      </Box>

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
        <Box
          sx={{
            padding: 4,
            backgroundColor: "#fff",
            borderRadius: 5,
            textAlign: "center",
          }}
        >
          <CheckCircle sx={{ fontSize: 50, color: "#26c579" }} />
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Assessment Completed!
          </Typography>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default AssessementCarousel;
