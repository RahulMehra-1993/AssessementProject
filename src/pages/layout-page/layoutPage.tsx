import { useContext, useEffect, useState } from "react";
import styles from "./layoutPage.module.css";
import Navbar from "../../components/navbar/navbar";
import CustomModal from "../../components/modal/modal";
import { Typography, Box, TextField, Divider } from "@mui/material";
import AssessmentCarousel from "../../components/carousel/carousel";
import CarouselSkeleton from "../../shared/skeltons/carouselSkelton";
import CustomDatePicker from "../../shared/date/datePicker";
import CustomButton from "../../shared/buttons/customButton";
import { Dayjs } from "dayjs";
import apiConfig from "../../api.config";
import { StoreContext } from "../../store/stateContext";
import { ActionType as actions } from "../../constants/actions/action.enum";
import UserSkelton from "../../shared/skeltons/user-skelton";
import CustomSnackBar from "../../shared/snackbar/snackbar";
import { useSearchParams } from "react-router-dom";
import useApi from "../../services/useCustomApiService";
import Error from "../../shared/error/error";

const UserWelcome = ({ user }: { user: any[] }) => (
  <>
    <Typography
      variant="h5"
      fontSize={"var(--font-size-xl)"}
      sx={{
        backgroundImage: "var(--theme-bg-danger-dark)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {user[0]?.name}
    </Typography>
    <Typography sx={{ mb: 3, fontSize: "var(--font-size-sm)" }}>
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
    <TextField
      autoComplete="off"
      fullWidth
      label="College Name"
      value={collegeName}
      onChange={(e) => setCollegeName(e.target.value)}
      sx={{
        mb: 3,
        "& .MuiInputBase-input": {
          fontSize: "var(--font-size-xs)",
        },
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            fontSize: "var(--font-size-xs)",
          },
        },
        "& .MuiInputLabel-root": {
          fontSize: "var(--font-size-xs)",
          "&.Mui-focused": {
            fontSize: "var(--font-size-xs)",
          },
        },
      }}
    />
    <CustomDatePicker onChange={setPassingYear} />
    <CustomButton
      onClick={handleSubmit}
      text="Continue"
      variant="contained"
      sx={{
        backgroundImage: "var(--theme-bg-danger-dark)",
        color: "white",
        textAlign: "center",
        fontSize: "12px",
        borderRadius: "0px",
      }}
    />
  </>
);

const Layout: React.FC = () => {
  const { get, post, loading } = useApi();
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("StoreContext must be used within a StoreProvider");
  }
  const { state, dispatch } = context;

  const [searchParams] = useSearchParams();
  const user_id = searchParams.get("user_id");
  const assessment_id = searchParams.get("assessment_id");

  const [collegeName, setCollegeName] = useState("");
  const [passingYear, setPassingYear] = useState<Dayjs | null>(null);
  const [renderCarousel, setRenderCarousel] = useState(false);
  const [formSubmit, setFormSubmit] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [dispatch]);

  const fetchUserData = async () => {
    const storedUser = sessionStorage.getItem("user");
    const formSubmit = sessionStorage.getItem("form");
    if (storedUser && formSubmit) {
      const storedQuestions = sessionStorage.getItem("questions");
      dispatch({ type: actions.SET_USER, payload: JSON.parse(storedUser) });
      storedQuestions
        ? dispatch({
            type: actions.SET_QUESTIONS,
            payload: JSON.parse(storedQuestions),
          })
        : fetchQuestions();
      setFormSubmit(true);
      setRenderCarousel(true);
    } else {
      const data = await get(
        apiConfig.ENDPOINTS.USER +
          `assessment_id=${assessment_id}&user_id=${user_id}`
      );

      if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
        const { user, questions } = data.data[0]; // Destructuring first object
        dispatch({ type: actions.SET_USER, payload: [user] });
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("total", JSON.stringify(questions));
      }
    }
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

    const data = await post(apiConfig.ENDPOINTS.QUESTIONS, {
      userId: user_id || "",
      assessmentId: assessment_id || "",
    });
    if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
      const { questions } = data.data[0]; // Destructuring first object
      dispatch({ type: actions.SET_QUESTIONS, payload: questions });
      sessionStorage.setItem("questions", JSON.stringify(questions));
    }
  };

  const handleModalClose = () => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser && formSubmit) {
      setRenderCarousel(true);
      fetchQuestions();
    }
  };

  const handleSubmit = () => {
    if (collegeName && passingYear) {
      sessionStorage.setItem("user", JSON.stringify(state.user));
      sessionStorage.setItem("form", JSON.stringify(true));
      setFormSubmit(true);
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
        height: "100%",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box sx={{ flex: 1, textAlign: "center" }}>
        {loading ? (
          <UserSkelton />
        ) : state.user?.length ? (
          <UserWelcome user={state.user} />
        ) : (
          <Error message="User not Found !" />
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
          close={() => {
            setTimeout(() => {
              dispatch({
                type: actions.SET_SNACKBAR,
                payload: [],
              });
            }, 3000); // Corrected timeout value (3 seconds)
          }}
          severity={state.snackbars[0]?.severity}
        />

        {!formSubmit && (
          <CustomModal isOpen={state.isModalOpen} onClose={handleModalClose}>
            {renderModalContent()}
          </CustomModal>
        )}
        {formSubmit &&
          (renderCarousel ? (
            loading ? (
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
