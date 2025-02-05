import { useEffect, useState } from "react";
import styles from "./layout.module.css";
import Navbar from "../../components/navbar/navbar";
import CustomModal from "../../components/modal/modal";
import { Typography, Box, TextField } from "@mui/material";
import { getData } from "../../services/api-services";
import { getData as getNgData } from "../../services/ngrok-api-service";
import AssessmentCarousel from "../../components/carousel/carousel";
import { Question } from "../../models/carousel/assessment.model";
import CarouselSKeleton from "../../shared/skeltons/carousel-skelton";
import UserSkelton from "../../shared/skeltons/user-skelton";
import CustomDatePicker from "../../shared/date/date-picker";
import CustomButton from "../../shared/buttons/custom-button";
import { Dayjs } from "dayjs";
import { User } from "../../models/user/user.model";
import { QUESTIONS, USER } from "../../constants/api-constants/apis.enum";

interface NavbarProps {
  data: User[]; // Accepts an array of users
}

const Layout: React.FC<NavbarProps> = () => {
  const [user, setUser] = useState<User[]>([]);
  const [assessmentQuestions, setAssessmentQuestions] = useState<Question[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [isQuestionsFetched, setIsQuestionsFetched] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false); // Show form after welcome message
  const [collegeName, setCollegeName] = useState<string>("");
  const [passingYear, setPassingYear] = useState<Dayjs | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
      setIsModalOpen(false);
      fetchAssessmentQuestions();
    } else {
      getData(USER).then((data) => {
        setUser(data);
        setLoading(false);
      });
    }
  }, []);

  const handleModalClose = () => {
    if (!showForm) {
      setShowForm(true); // Show form after the welcome message is closed
    } 
  };

  const fetchAssessmentQuestions = () => {
    setLoading(true);
    getData(QUESTIONS).then((data) => {
      setAssessmentQuestions(data);
      setIsQuestionsFetched(true);
      setLoading(false);
    });
  };

  const handleSubmit = () => {
    if (collegeName.trim() && passingYear) {
      sessionStorage.setItem("user", JSON.stringify(user));
      setShowForm(false); // Hide form after submission
      fetchAssessmentQuestions(); // Fetch the questions after form completion
      setIsModalOpen(false);
    }
  };

  const handleYearChange = (newYear: Dayjs | null) => {
    setPassingYear(newYear);
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.blurOverlay}></div>
      <div className={styles.content}>
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
              <>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",

                    textTransform: "capitalize",
                    mb: 3,
                    textAlign: "center",
                  }}
                >
                  {user ? user[0]?.email : "No user found"}
                  <br />
                  Welcome! Please fill out your details to proceed.
                </Typography>
                <CustomButton
                  onClick={handleModalClose}
                  text="Continue"
                  variant={"contained"}
                  sx={{
                    backgroundImage: "var(--theme-bg-primary)",
                    color: "white",
                  }}
                />
              </>
            ) : (
              <>
                <Typography
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "18px",
                    color: "#222",
                    textTransform: "capitalize",
                    mb: 3, // Increased margin bottom
                    textAlign: "center", // Center the title
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
                      fontSize: "14px", // Example: Reduced font size
                      "&:hover": {
                        // borderColor: "#f57c00",
                      },
                      "&.Mui-focused": {
                        borderColor: "#f57c00",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      // Target the label
                      fontSize: "14px", // Smaller label font
                    },
                    "& .MuiInputLabel-shrink": {
                      // Target the shrunk label (when input has focus)
                      fontSize: "14px", // Even smaller shrunk label
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "2px solid grey",
                    },
                  }}
                />
                <CustomDatePicker onChange={handleYearChange} />
                <br />
                <CustomButton
                  onClick={handleSubmit}
                  text={"Continue"}
                  variant={"contained"}
                  sx={{
                    backgroundImage: "var(--theme-bg-primary)",
                    color: "white",
                  }}
                />
              </>
            )}
          </Box>
        </CustomModal>

        <Navbar data={user} />
        {isQuestionsFetched ? (
          <AssessmentCarousel questions={assessmentQuestions} />
        ) : (
          <CarouselSKeleton />
        )}
      </div>
    </div>
  );
};

export default Layout;
