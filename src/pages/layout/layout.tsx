import { useEffect, useState } from "react";
import styles from "./layout.module.css";
import Navbar from "../../components/navbar/navbar";
import CustomModal from "../../components/modal/modal";
import { Typography, Skeleton, Box, Button, TextField } from "@mui/material";
import { getData } from "../../apis/apiService";
import AssessmentCarousel from "../../components/carousel/carousel";
import { Question } from "../../models/Assessement";
import CarouselSKeleton from "../../shared/skeltons/carouselSkelton";

const Layout = () => {
  const [user, setUser] = useState<
    {
      createdAt: string;
      name: string;
      email: string;
      avatar: string;
      id: string;
      message: string;
    }[]
  >([]);

  const [assessmentQuestions, setAssessmentQuestions] = useState<Question[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [isQuestionsFetched, setIsQuestionsFetched] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(true); // Track form visibility
  const [collegeName, setCollegeName] = useState<string>("");
  const [passingYear, setPassingYear] = useState<string>("");

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log("API URL:", apiUrl);
    getData("/useremail").then((data) => {
      if (data.length > 0) {
        setUser(data);
      }
      setLoading(false);
    });
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchAssessmentQuestions();
  };

  const fetchAssessmentQuestions = () => {
    setLoading(true);
    setTimeout(() => {
      getData("/assessementquestion").then((data) => {
        if (data.length > 0) {
          setAssessmentQuestions(data);
        }
        setIsQuestionsFetched(true);
        setLoading(false);
      });
    }, 5000);
  };

  const handleSubmit = () => {
    if (collegeName.trim() && passingYear.trim()) {
      setShowForm(false); // Hide form and show message
    }
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
            {showForm ? (
              <>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "1.4rem",
                    color: "#222",
                    textTransform: "capitalize",
                    mb: 2,
                  }}
                >
                  Enter Your Details
                </Typography>
                <TextField
                  fullWidth
                  label="College Name"
                  variant="outlined"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Year of Passing"
                  variant="outlined"
                  value={passingYear}
                  onChange={(e) => setPassingYear(e.target.value)}
                  sx={{ mb: 3 }}
                />
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{
                    backgroundImage:
                      "linear-gradient(to left, #bb462b, #bc423a, #bb4049, #b84056, #b34262) !important",
                    backgroundColor: "#26c579",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: 30,
                    padding: "10px 24px",
                    textTransform: "none",
                    transition: "0.3s",
                    // "&:hover": {
                    //   backgroundColor: "#1e9c61",
                    // },
                    "&:hover": {
                      backgroundColor: "initial",
                      backgroundImage:
                        "linear-gradient(to left, #bb462b, #bc423a, #bb4049, #b84056, #b34262) !important",
                    },
                  }}
                >
                  Submit
                </Button>
              </>
            ) : (
              <>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "1.4rem",
                    color: "#222",
                    textTransform: "capitalize",
                  }}
                >
                  Hello,{" "}
                  {loading ? (
                    <Skeleton variant="text" width={120} />
                  ) : Array.isArray(user) && user.length > 0 ? (
                    user[0].name
                  ) : (
                    "User"
                  )}
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    fontSize: "1rem",
                    color: "#555",
                    fontWeight: 400,
                    textAlign: "start",
                  }}
                >
                  {loading ? (
                    <Skeleton variant="text" width="80%" />
                  ) : Array.isArray(user) && user.length > 0 ? (
                    user[0].message
                  ) : (
                    "Welcome to our platform!"
                  )}
                </Typography>

                <Button
                  onClick={handleModalClose}
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
                  Continue
                </Button>
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
