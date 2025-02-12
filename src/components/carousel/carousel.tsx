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
import CustomButton from "../../shared/buttons/customButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../store/stateContext";
import { ActionType as actions } from "../../constants/actions/action.enum";
import apiConfig from "../../api.config";
import CardContentSkelton from "../../shared/skeltons/carouselCardContentSkelton";
import { Question } from "../../models/carousel/assessment.model";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import useApi from "../../services/useCustomApiService";
import Error from "../../shared/error/error";

export interface AssessmentProps {
  questions: Question[];
}

const AssessementCarousel: React.FC<AssessmentProps> = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("StoreContext must be used within a StoreProvider");
  }
  const { state, dispatch } = context;
  const { post, loading, error } = useApi();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user_id = searchParams.get("user_id");
  const assessment_id = searchParams.get("assessment_id");

  const [curIndex, setCurIndex] = useState(state.curIndex);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [isAssessmentCompleted, setIsAssessmentCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [total, setTotal] = useState<number | null>(0);

  const answeredQuestions = selectedAnswers.filter(
    (answer) => answer !== null && answer !== undefined && answer !== ""
  ).length;

  useEffect(() => {
    const storedQuestions = sessionStorage.getItem("questions");
    const storedTotal = sessionStorage.getItem("total");
    if (storedTotal) {
      setTotal(JSON.parse(storedTotal));
    }
    if (storedQuestions) {
      dispatch({
        type: actions.SET_QUESTIONS,
        payload: JSON.parse(storedQuestions),
      });
    }
  }, []);

  const hasMoreQuestions = state.questions.length < (total ?? 0);

  useEffect(() => {
    const storedAnswers = sessionStorage.getItem("selectedAnswers");
    if (storedAnswers) {
      setSelectedAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  useEffect(() => {
    const cur_index = sessionStorage.getItem("curIndex");
    if (cur_index) {
      setCurIndex(JSON.parse(cur_index));
    } else {
      setCurIndex(state.curIndex);
    }
  }, []);

  const checkMoreQuestions = async () => {
    if (
      curIndex === state.questions.length - 1 &&
      state.questions.length < (total ?? 0)
    ) {
      const data = await post(apiConfig.ENDPOINTS.QUESTIONS, {
        assessmentId: assessment_id || "",
        userId: user_id || "",
      });

      if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
        const { questions } = data.data[0];
        const updatedQuestions = [...state.questions, ...questions];
        dispatch({
          type: actions.SET_QUESTIONS,
          payload: updatedQuestions,
        });
        sessionStorage.setItem("questions", JSON.stringify(updatedQuestions));
        setCurIndex(curIndex + 1);
      }
    } else {
      dispatch({
        type: actions.SET_SNACKBAR,
        payload: [
          {
            message: "No more questions available",
            show: true,
            severity: "info",
            close: () => dispatch({ type: actions.SET_SNACKBAR, payload: [] }),
          },
        ],
      });
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[curIndex] = event.target.value;
    setSelectedAnswers(updatedAnswers);
    sessionStorage.setItem("selectedAnswers", JSON.stringify(updatedAnswers));
    setCurIndex((prevIndex) => {
      if (prevIndex < state.questions.length - 1) {
        const newIndex = prevIndex + 1;
        sessionStorage.setItem("curIndex", JSON.stringify(newIndex));
        return newIndex;
      }
      return prevIndex;
    });
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    const newIndex = value - 1;
    setCurIndex(newIndex);
    dispatch({
      type: actions.SET_CURRENT_QUESTION_INDEX,
      payload: newIndex,
    });
  };

  const handleSubmit = () => {
    if (answeredQuestions > 0) {
      setConfirmSubmit(true);
    } else {
      dispatch({
        type: actions.SET_SNACKBAR,
        payload: [
          {
            message: "Atleast one question should be answered",
            show: true,
            severity: "warning",
            close: () => dispatch({ type: actions.SET_SNACKBAR, payload: [] }),
          },
        ],
      });
      return;
    }
  };

  const confirmSubmission = () => {
    const assessmentResults = state.questions.map((question, index) => ({
      id: question.id,
      selectedAnswer: selectedAnswers[index],
    }));

    console.log("POST_REQ:", { request: assessmentResults });
    setIsAssessmentCompleted(true);
    setIsModalOpen(true);
    setConfirmSubmit(false);
    sessionStorage.clear();
    sessionStorage.setItem("complete", "true");

    setTimeout(() => {
      navigate("/assessment/post_submit");
    }, 2000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 1,
        marginTop: {
          xs: "",
          sm: "",
          md: "",
          lg: "80px",
          xl: "",
        },
        width: {
          xs: "100%",
          sm: "90%",
          md: "80%",
          lg: "70%",
          xl: "60%",
        },
        scale: {
          xs: ".8",
          sm: ".9",
          md: "1",
          lg: "1",
          xl: "1",
        },
      }}
    >
      <Card sx={{ borderRadius: 10, width: "90%", mb: 2, p: 1 }}>
        {state.questions.length === 0 && (
          <Error message="Questions not found !" />
        )}
        {state.questions.length > 0 && (
          <>
            <LinearProgress
              variant="determinate"
              value={(answeredQuestions / (total ?? 0)) * 100 || 0}
              sx={{
                m: "var(--font-size-xs)",
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  background: "var(--theme-bg-danger)",
                },
              }}
            />

            {loading ? (
              <CardContentSkelton />
            ) : (
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid rgb(18, 15, 15)",
                    padding: "6px var(--font-size-xs)",
                    borderRadius: "32px",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography
                      sx={{ fontWeight: 600, fontSize: "var(--font-size-xs)" }}
                    >
                      Question
                    </Typography>
                    <NavigateNext fontSize="small" sx={{ mx: 1 }} />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "var(--font-size-xs)" }}
                    >
                      {curIndex + 1} / {total}
                    </Typography>
                  </Box>
                  <CustomButton
                    variant="contained"
                    onClick={handleSubmit}
                    isDisabled={isAssessmentCompleted}
                    text="Submit"
                    sx={{ backgroundImage: "var(--theme-bg-danger)" }}
                  />
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    marginBottom: 2,
                    fontSize: "var(--font-size-md)",
                    lineHeight: "1.2",
                    padding: "2px 4px",
                  }}
                >
                  {state.questions[curIndex].question}
                </Typography>

                <FormControl
                  component="fieldset"
                  sx={{ width: "100%", padding: "2px 4px" }}
                >
                  <FormLabel
                    component="legend"
                    sx={{
                      fontSize: "var(--font-size-xs)",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Choose an answer:
                  </FormLabel>
                  <RadioGroup
                    value={selectedAnswers[curIndex] || ""}
                    onChange={handleOptionChange}
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    {state.questions[curIndex].options.map((option, index) => (
                      <FormControlLabel
                        key={index}
                        value={option}
                        control={
                          <Radio
                            sx={{
                              "&.Mui-checked": {
                                transform: "scale(1.2)",
                                transition: "transform 0.3s ease",
                              },
                            }}
                          />
                        }
                        label={
                          <Typography
                            sx={{
                              fontSize: "var(--font-size-xs)",
                              fontWeight: 500,
                            }}
                          >
                            {option}
                          </Typography>
                        }
                        sx={{ marginBottom: "var(--font-size-xs)" }}
                      />
                    ))}
                  </RadioGroup>

                  <Box
                    display="flex"
                    flexWrap="wrap"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Pagination
                      count={state.questions.length}
                      page={curIndex + 1}
                      onChange={handlePageChange}
                      shape="rounded"
                      size="small"
                      renderItem={(item) => (
                        <PaginationItem
                          {...item}
                          sx={{
                            mx: 0.5,
                            borderRadius: "50%",
                            ...(item.type === "page" && {
                              backgroundImage:
                                item.page && selectedAnswers[item.page - 1]
                                  ? "var(--theme-bg-success)"
                                  : "transparent",
                              color:
                                item.page && selectedAnswers[item.page - 1]
                                  ? "white"
                                  : "inherit",
                              "&.Mui-selected": {
                                backgroundImage: "var(--theme-bg-danger)",
                                color: "white",
                              },
                            }),
                          }}
                        />
                      )}
                    />

                    {curIndex === state.questions.length - 1 &&
                      curIndex < (total ?? 0) &&
                      hasMoreQuestions && (
                        <IconButton onClick={checkMoreQuestions} sx={{ ml: 1 }}>
                          <ArrowForwardIcon
                            sx={{
                              color: "#b34262",
                            }}
                          />
                        </IconButton>
                      )}
                  </Box>
                </FormControl>
              </CardContent>
            )}

            <Typography
              variant="body2"
              sx={{
                fontSize: "var(--font-size-xs)",
                color: "gray",
                mb: 2,
                textAlign: "center",
              }}
            >
              {hasMoreQuestions
                ? "More questions available. Navigate using the buttons or number selector."
                : "No more questions."}
            </Typography>
          </>
        )}
      </Card>

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
            padding: "var(--font-size-xs)",
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
            sx={{
              fontSize: "var(--font-size-md)",
              color: "text.secondary",
              mb: 2,
            }}
          >
            You have answered {answeredQuestions} of {total} questions.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "var(--font-size-xs)",
              fontStyle: "italic",
              color:
                answeredQuestions === total ? "success.main" : "warning.main",
            }}
          >
            {answeredQuestions === total
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
