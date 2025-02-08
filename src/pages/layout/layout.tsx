import { useContext, useEffect, useState } from "react";
import styles from "./layout.module.css";
import Navbar from "../../components/navbar/navbar";
import CustomModal from "../../components/modal/modal";
import { Typography, Box, TextField, Container } from "@mui/material";
import { getData } from "../../services/api-services";
import AssessmentCarousel from "../../components/carousel/carousel";
import { Question } from "../../models/carousel/assessment.model";
import CarouselSkeleton from "../../shared/skeltons/carousel-skelton";
import CustomDatePicker from "../../shared/date/date-picker";
import CustomButton from "../../shared/buttons/custom-button";
import { Dayjs } from "dayjs";
import { User } from "../../models/user/user.model";
import { QUESTIONS, USER } from "../../constants/api-constants/apis.enum";
import { StoreContext } from "../../store/state-context";
import { ActionType as actions } from "../../constants/actions/action.enum";
import UserSkelton from "../../shared/skeltons/user-skelton";

const Layout: React.FC = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("StoreContext must be used within a StoreProvider");
  }
  const { state, dispatch } = context;

  const [user, setUser] = useState<User[]>([]);
  const [assessmentQuestions, setAssessmentQuestions] = useState<Question[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [collegeName, setCollegeName] = useState<string>("");
  const [passingYear, setPassingYear] = useState<Dayjs | null>(null);

  // Fetch user data from session storage or API
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsModalOpen(false);
      fetchAssessmentQuestions();
    } else {
      dispatch({ type: actions.SET_USER_LOADING, payload: true });
      getData(USER).then((data) => {
        setUser(data);
        sessionStorage.setItem("user", JSON.stringify(data));
        setIsModalOpen(true);
        // dispatch({type: actions.SET_USER_LOADING, payload: false});
      });
      // Delay hiding the loader to ensure it is visible
      setTimeout(() => {
        dispatch({ type: actions.SET_USER_LOADING, payload: false });
      }, 2000); // Show loader for at least 1 second
    }
  }, []);

  // Fetch assessment questions
  const fetchAssessmentQuestions = () => {
    dispatch({ type: actions.SET_QUESTIONS_LOADING, payload: true });

    getData(QUESTIONS).then((data) => {
      if (data) {
        setAssessmentQuestions(data);
        dispatch({ type: actions.SET_QUESTIONS, payload: data });
        setIsModalOpen(false); // Close modal only after fetching
      }

      // Delay hiding the loader to ensure it is visible
      setTimeout(() => {
        dispatch({ type: actions.SET_QUESTIONS_LOADING, payload: false });
      }, 2000); // Show loader for at least 1 second
    });
  };

  // Update global state when user and questions are fetched
  useEffect(() => {
    if (user.length > 0) {
      dispatch({ type: actions.SET_USER, payload: user });
    }
  }, [user, dispatch]);

  const handleModalClose = () => {
    if (!showForm) {
      setShowForm(true); // Show form when closing welcome message
    }
  };

  const handleSubmit = () => {
    if (collegeName.trim() && passingYear) {
      sessionStorage.setItem("user", JSON.stringify(user));
      fetchAssessmentQuestions(); // Fetch assessment questions after submitting form
    }
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.blurOverlay}></div>
      <div className={styles.content}>
        {/* Modal for Welcome Message & Form */}
        <CustomModal isOpen={isModalOpen} onClose={handleModalClose}>
          <Box
            sx={{
              padding: 4,
              borderRadius: 5,
              textAlign: "center",
              maxWidth: 400,
              mx: "auto",
            }}
          >
            {!showForm ? (
              <Container>
                <Box>
                  {!state.userLoading ? (
                    state.user && state.user.length > 0 ? (
                      <Typography variant="h5">
                        {state.user[0].email}
                      </Typography>
                    ) : (
                      <Typography variant="h5">No user found</Typography>
                    )
                  ) : (
                    <UserSkelton />
                  )}

                  <Typography variant="body1">
                    Welcome! Please fill out your details to proceed.
                  </Typography>
                  <br />
                  <CustomButton
                    onClick={handleModalClose}
                    isDisabled={
                      state.user && state.user.length > 0 ? false : true
                    }
                    text="Continue"
                    variant="contained"
                    sx={{
                      backgroundImage: "var(--theme-bg-primary)",
                      color: "white",
                    }}
                  />
                </Box>
              </Container>
            ) : (
              <>
                <Typography
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "18px",
                    textTransform: "capitalize",
                    mb: 3,
                    textAlign: "center",
                  }}
                >
                  Enter Your Details
                </Typography>

                <TextField
                  autoComplete="off"
                  fullWidth
                  label="College Name"
                  variant="outlined"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      fontSize: "14px",
                      "&.Mui-focused": {
                        borderColor: "#f57c00",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "14px",
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "2px solid grey",
                    },
                  }}
                />
                <CustomDatePicker onChange={setPassingYear} />
                <br />
                <CustomButton
                  onClick={handleSubmit}
                  text="Continue"
                  variant="contained"
                  sx={{
                    backgroundImage: "var(--theme-bg-primary)",
                    color: "white",
                  }}
                />
              </>
            )}
          </Box>
        </CustomModal>
        {/* Navbar display */}
        <Navbar />

        {/* Show Skeleton if questions are loading, otherwise show Carousel */}
        {state.questionsLoading ? (
          <CarouselSkeleton />
        ) : (
          <AssessmentCarousel questions={assessmentQuestions} />
        )}
      </div>
    </div>
  );
};

export default Layout;
