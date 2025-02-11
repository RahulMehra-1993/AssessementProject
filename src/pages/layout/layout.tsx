import { useContext, useEffect, useState } from "react";
import styles from "./layout.module.css";
import Navbar from "../../components/navbar/navbar";
import CustomModal from "../../components/modal/modal";
import { Typography, Box, TextField, Divider } from "@mui/material";
import { getData, postData } from "../../services/api-services";
import AssessmentCarousel from "../../components/carousel/carousel";
import CarouselSkeleton from "../../shared/skeltons/carousel-skelton";
import CustomDatePicker from "../../shared/date/date-picker";
import CustomButton from "../../shared/buttons/custom-button";
import { Dayjs } from "dayjs";
import {
  QUESTIONS,
  USER as USER_PARAM,
} from "../../constants/api-constants/apis.enum";
import { StoreContext } from "../../store/state-context";
import { ActionType as actions } from "../../constants/actions/action.enum";
import UserSkelton from "../../shared/skeltons/user-skelton";
import CustomSnackBar from "../../shared/snackbar/snackbar";
import { useParams } from "react-router-dom";

const UserWelcome = ({ user }: { user: any[] }) => (
  <>
    <Typography variant="h5">{user[0]?.name}</Typography>
    <Typography sx={{ mb: 3 }}>
      Welcome! Please fill out your details to proceed.
    </Typography>
  </>
);

const UserForm = ({
  collegeName,
  setCollegeName,
  setPassingYear,
  handleSubmit,
}: {
  collegeName: string;
  setCollegeName: (value: string) => void;
  setPassingYear: (value: Dayjs | null) => void;
  handleSubmit: () => void;
}) => (
  <>
    <Typography
      sx={{ fontWeight: 600, fontSize: "18px", textAlign: "center", mb: 3 }}
    >
      Enter Your Details
    </Typography>
    <TextField
      fullWidth
      label="College Name"
      value={collegeName}
      onChange={(e) => setCollegeName(e.target.value)}
      sx={{ mb: 3 }}
    />
    <CustomDatePicker onChange={setPassingYear} />
    <CustomButton
      onClick={handleSubmit}
      text="Continue"
      variant="contained"
      sx={{
        backgroundImage: "var(--theme-bg-primary)",
        color: "white",
        textAlign: "center",
      }}
    />
  </>
);

const Layout: React.FC = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("StoreContext must be used within a StoreProvider");
  }

  const { id } = useParams(); // Get the 'id' from the URL
  const { assessmentId } = useParams(); // Get the 'assessmentId' from the URL
  const { state, dispatch } = context;
  const [collegeName, setCollegeName] = useState("");
  const [passingYear, setPassingYear] = useState<Dayjs | null>(null);
  const [renderCarousel, setRenderCarousel] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [dispatch]);

  const fetchUserData = async () => {
    dispatch({ type: actions.SET_USER_LOADING, payload: true });

    try {
      const storedUser = sessionStorage.getItem("user");

      if (storedUser) {
        dispatch({ type: actions.SET_USER, payload: JSON.parse(storedUser) });
        dispatch({ type: actions.TOGGLE_MODAL, payload: false });
        setRenderCarousel(true);
        fetchQuestions();
      } else {
        const data = await getData(
          USER_PARAM + `user_id=${id}&assessment_id=${assessmentId}`
        );
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          const { user } = data.data[0]; // Destructuring first object
          dispatch({ type: actions.SET_USER, payload: [user] });
          sessionStorage.setItem("user", JSON.stringify(user));
        } else {
          dispatch({
            type: actions.SET_SNACKBAR,
            payload: [
              {
                message: "Something went wrong",
                show: true,
                severity: "error",
                close: () =>
                  dispatch({ type: actions.SET_SNACKBAR, payload: [] }),
              },
            ],
          });
        }
      }
    } catch (error) {
      dispatch({
        type: actions.SET_SNACKBAR,
        payload: [
          {
            message: "User not found",
            show: true,
            severity: "error",
            close: () => dispatch({ type: actions.SET_SNACKBAR, payload: [] }),
          },
        ],
      });
    }
    dispatch({ type: actions.SET_USER_LOADING, payload: false });
  };

  const fetchQuestions = async () => {
    const storedQuestions = sessionStorage.getItem("questions");
    if (storedQuestions) {
      dispatch({
        type: actions.SET_QUESTIONS,
        payload: JSON.parse(storedQuestions),
      });
      return;
    }
    dispatch({ type: actions.SET_QUESTIONS_LOADING, payload: true });
    try {
      const data = await postData(QUESTIONS, {
        assessmentId: assessmentId,
        userId: id,
      });

      if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
        const { questions } = data.data[0]; // Destructuring first object
        dispatch({ type: actions.SET_QUESTIONS, payload: questions });
      }
    } catch {
      dispatch({
        type: actions.SET_SNACKBAR,
        payload: [
          {
            message: "Failed to fetch questions",
            show: true,
            severity: "error",
            close: () => {},
          },
        ],
      });
    }
    dispatch({ type: actions.SET_QUESTIONS_LOADING, payload: false });
  };

  const handleModalClose = () => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser && state.isModalOpen) {
      setRenderCarousel(true);
      fetchQuestions();
    } else {
      setRenderCarousel(true);
    }
  };

  const handleSubmit = () => {
    if (collegeName && passingYear) {
      sessionStorage.setItem("user", JSON.stringify(state.user));
      setRenderCarousel(true);
      fetchQuestions();
      dispatch({
        type: actions.TOGGLE_MODAL,
        payload: false,
      });
    }
  };

  const renderModalContent = () => (
    <Box
      sx={{
        padding: 4,
        borderRadius: 5,
        Width: "600px",
        mx: "auto",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box sx={{ flex: 1, textAlign: "center" }}>
        {state.userLoading ? (
          <UserSkelton />
        ) : state.user?.length ? (
          <UserWelcome user={state.user} />
        ) : (
          <Typography variant="h5">No user found</Typography>
        )}
      </Box>
      {state.user && state.user?.length > 0 && (
        <>
          <Divider
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            orientation="vertical"
            flexItem
          />
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <UserForm
              collegeName={collegeName}
              setCollegeName={setCollegeName}
              setPassingYear={setPassingYear}
              handleSubmit={handleSubmit}
            />
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <div className={styles.appContainer}>
      <div className={styles.blurOverlay}></div>
      <div className={styles.content}>
        <Navbar />
        <CustomSnackBar
          message={state.snackbars[0]?.message}
          show={state.snackbars[0]?.show}
          close={() =>
            dispatch({
              type: actions.SET_SNACKBAR,
              payload: [
                {
                  message: "",
                  show: false,
                  severity: "info",
                  close: () =>
                    dispatch({ type: actions.SET_SNACKBAR, payload: [] }),
                },
              ],
            })
          }
          severity={state.snackbars[0]?.severity}
        />
        {state.isModalOpen && (
          <CustomModal isOpen={state.isModalOpen} onClose={handleModalClose}>
            {renderModalContent()}
          </CustomModal>
        )}
        {!state.isModalOpen &&
          (renderCarousel ? (
            state.questionsLoading ? (
              <CarouselSkeleton />
            ) : (
              <AssessmentCarousel questions={state.questions} />
            )
          ) : null)}
      </div>
    </div>
  );
};

export default Layout;
