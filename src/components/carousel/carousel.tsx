import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  PaginationItem,
  IconButton,
} from "@mui/material";
import { CheckCircle, NavigateNext } from "@mui/icons-material";
import CustomModal from "../modal/modal";
import CustomSnackBar from "../../shared/snackbar/snackbar";
import CustomButton from "../../shared/buttons/custom-button";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../store/state-context";
import { ActionType as actions } from "../../constants/actions/action.enum";
import { getData } from "../../services/api-services";
import {
  QUESTIONS,
  TOTAL_QUESTIONS,
} from "../../constants/api-constants/apis.enum";
import CardContentSkelton from "../../shared/skeltons/carousel-card-content-skelton";
import { Question } from "../../models/carousel/assessment.model";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export interface AssessmentProps {
  questions: Question[];
}

const AssessementCarousel: React.FC<AssessmentProps> = () => {
  // use context-srore
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("StoreContext must be used within a StoreProvider");
  }
  const { state, dispatch } = context;
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    state.currentQuestionIndex
  );
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [isAssessmentCompleted, setIsAssessmentCompleted] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const storedAnswers = sessionStorage.getItem("selectedAnswers");
    if (storedAnswers) {
      setSelectedAnswers(JSON.parse(storedAnswers));
    }
    console.log(state.questions);
    console.log(storedAnswers);
  }, []);

  useEffect(() => {
    const questionsStroed = sessionStorage.getItem("questions");
    if (questionsStroed) {
      dispatch({
        type: actions.SET_QUESTIONS,
        payload: JSON.parse(questionsStroed),
      });
    }
    console.log(questionsStroed);
  }, []);

  useEffect(() => {
    const currentQuestionIndexStored = sessionStorage.getItem(
      "currentQuestionIndex"
    );
    if (currentQuestionIndexStored) {
      setCurrentQuestionIndex(JSON.parse(currentQuestionIndexStored));
    } else {
      setCurrentQuestionIndex(state.currentQuestionIndex);
    }
    console.log(state.questions);
  }, []);

  const checkMoreQuestions = () => {
    console.log(loader);
    // Fetch next question set from DB if needed
    if (
      currentQuestionIndex === state.questions.length - 1 &&
      state.questions.length < TOTAL_QUESTIONS
    ) {
      console.log("Fetching more questions...");
      setLoader(true);

      getData(QUESTIONS).then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          const updatedQuestions = [...state.questions, ...data]; // Stack old and new data

          dispatch({
            type: actions.SET_QUESTIONS,
            payload: updatedQuestions,
          });

          sessionStorage.setItem("questions", JSON.stringify(updatedQuestions));
        }

        // Delay hiding the loader to ensure it is visible
        setTimeout(() => {
          setLoader(false);
        }, 2000);
      });
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = event.target.value;
    setSelectedAnswers(updatedAnswers);

    // Store in session storage
    sessionStorage.setItem("selectedAnswers", JSON.stringify(updatedAnswers));

    // Only update index if it's not the last question
    setCurrentQuestionIndex((prevIndex) => {
      if (prevIndex < state.questions.length - 1) {
        const newIndex = prevIndex + 1;
        sessionStorage.setItem(
          "currentQuestionIndex",
          JSON.stringify(newIndex)
        );
        return newIndex;
      }
      return prevIndex; // Keep it at the last question
    });
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    const newIndex = value - 1;
    setCurrentQuestionIndex(newIndex);
    dispatch({
      type: actions.SET_CURRENT_QUESTION_INDEX,
      payload: newIndex,
    });
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
      setSnackbarMessage(`Please answer at least one question.`);
      setShowSnackbar(true);
      return;
    }
  };

  const confirmSubmission = () => {
    const assessmentResults = state.questions.map((question, index) => ({
      id: question.id,
      question: question.question,
      selectedAnswer: selectedAnswers[index],
    }));

    console.log("POST_REQ:", assessmentResults);
    setIsAssessmentCompleted(true);
    setIsModalOpen(true);
    setSnackbarMessage("Assessment completed successfully!");
    setShowSnackbar(true);
    setConfirmSubmit(false);
    sessionStorage.removeItem("selectedAnswers");
    sessionStorage.removeItem("user");
    sessionStorage.setItem("complete", "true");

    // Add a delay (e.g., 3 seconds) before reloading the page
    setTimeout(() => {
      navigate("/assessment/post_submit");
    }, 3000); // 3000 milliseconds = 3 seconds
  };

  const answeredQuestions = selectedAnswers.filter(
    (answer) => answer !== null
  ).length;

  const hasMoreQuestions = state.questions.length < TOTAL_QUESTIONS; // Check if there are more questions

  return state.questions.length === 0 ? (
    <Box>Something went wrong</Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 1,
        marginTop: {
          xs: "", // Full width on extra small screens
          sm: "", // Slightly smaller on small screens
          md: "", // Medium screens
          lg: "80px", // Large screens
          xl: "", // Extra large screenslg:"80px"},
        },
        width: {
          xs: "100%", // Full width on extra small screens
          sm: "90%", // Slightly smaller on small screens
          md: "80%", // Medium screens
          lg: "70%", // Large screens
          xl: "60%", // Extra large screens
        },
        scale: {
          xs: ".8", // Full width on extra small screens
          sm: ".9", // Slightly smaller on small screens
          md: "1", // Medium screens
          lg: "1", // Large screens
          xl: "1", // Extra large screens
        },
      }}
    >
      <Card
        sx={{
          borderRadius: 10,
          width: "90%",
          maxWidth: "auto",
          minHeight: 250,
          mb: 2,
          p: 1,
        }}
      >
        <LinearProgress
          variant="determinate"
          value={
            state.questions.length > 0
              ? (answeredQuestions / TOTAL_QUESTIONS) * 100
              : 0
          }
          sx={{
            m: "var(--font-size-md)",
            backgroundColor: "#e0e0e0", // Light gray background for the track
            "& .MuiLinearProgress-bar": {
              background: "var(--theme-bg-danger)", // Your gradient
            },
          }}
        />
        {loader ? (
          <CardContentSkelton></CardContentSkelton>
        ) : (
          <CardContent sx={{}}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid rgb(18, 15, 15)",
                padding: "6px 12px",
                borderRadius: "32px",
                mb: 2,
              }}
            >
              {/* Left-aligned Question Info (Breadcrumb "link") */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography sx={{ fontWeight: 600, fontSize: "12px" }}>
                  Question
                </Typography>
                {/* Separator (if needed) */}
                <NavigateNext fontSize="small" sx={{ mx: 1 }} />{" "}
                {/* Add some margin */}
                <Typography variant="body2" sx={{ fontSize: "12px" }}>
                  {currentQuestionIndex + 1} / {TOTAL_QUESTIONS}
                </Typography>
              </Box>

              {/* Right-aligned Submit Button */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CustomButton
                  variant="contained"
                  onClick={handleSubmit}
                  isDisabled={isAssessmentCompleted}
                  text="Submit"
                  sx={{
                    backgroundImage: "var(--theme-bg-danger)",
                  }}
                />
              </Box>
            </Box>

            <Typography
              variant="body1"
              sx={{
                marginBottom: 2,
                fontWeight: "",
                fontSize: "14px",
                lineHeight: "1.2",
                padding: "2px 4px",
              }}
            >
              {state.questions[currentQuestionIndex].question}
            </Typography>
            <FormControl
              component="fieldset"
              sx={{ width: "100%", padding: "2px 4px" }}
            >
              <FormLabel
                component="legend"
                sx={{
                  fontSize: "12px", // Updated to 14px for the header
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
                {state.questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={
                        <Radio
                          sx={{
                            fontSize: "12px", // Font size for the radio button itself
                            "&.Mui-checked": {
                              backgroundImage: "var(--theme-bg-dange)", // Selected radio button color
                              transform: "scale(1.2)", // Slight scale effect when selected
                              transition:
                                "transform 0.3s ease, color 0.3s ease", // Smooth transition on selection
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
                  )
                )}
              </RadioGroup>
              <Box display="flex" flexWrap={"wrap"} alignItems="center" justifyContent={"center"}>
                <Pagination
                  count={state.questions.length}
                  page={currentQuestionIndex + 1}
                  defaultPage={state.currentQuestionIndex + 1}
                  onChange={handlePageChange}
                  shape="rounded"
                  size="small"
                  renderItem={(item) => {
                    if (item.type !== "page") {
                      return <PaginationItem {...item} />;
                    }

                    const isAnswered =
                      item.page !== null &&
                      selectedAnswers[item.page - 1] &&
                      state.questions[item.page - 1].options.includes(
                        selectedAnswers[item.page - 1] || ""
                      );

                    return (
                      <PaginationItem
                        {...item}
                        sx={{
                          mx: 0.5,
                          borderRadius: "50%",
                          backgroundImage: isAnswered
                            ? "var(--theme-bg-success)"
                            : "transparent",
                          color: isAnswered ? "white" : "inherit",
                          "&.Mui-selected": {
                            backgroundImage: "var(--theme-bg-danger)",
                            color: isAnswered ? "white" : "inherit",
                          },
                        }}
                      />
                    );
                  }}
                />

                {/* Render the button only when on the last question */}
                {currentQuestionIndex === state.questions.length - 1 && (
                  <IconButton onClick={checkMoreQuestions} sx={{ ml: 1 }}>
                    <ArrowForwardIcon />
                  </IconButton>
                )}
              </Box>
            </FormControl>
          </CardContent>
        )}

        <Typography
          variant="body2"
          sx={{ fontSize: "12px", color: "gray", mb: 2, textAlign: "center" }}
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
            Assessment Submitted!
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
            You have answered {answeredQuestions} of {TOTAL_QUESTIONS}{" "}
            questions.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "12px",
              fontStyle: "italic",
              color:
                answeredQuestions === TOTAL_QUESTIONS
                  ? "success.main"
                  : "warning.main",
            }}
          >
            {answeredQuestions === TOTAL_QUESTIONS
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
