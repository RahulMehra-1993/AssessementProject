import { useEffect, useState } from "react";
import styles from "./layout.module.css";
import Navbar from "../../components/navbar/navbar";
import CustomModal from "../../components/modal/modal";
import {
  Typography,
  Skeleton,
  Box,
  Button,
} from "@mui/material";
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true); // Modal opens initially
  const [loading, setLoading] = useState<boolean>(true); // To track loading state for user
  const [isQuestionsFetched, setIsQuestionsFetched] = useState<boolean>(false); // Track questions fetching status

  useEffect(() => {
    //testing environement
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log("API URL:", apiUrl);
    // Fetch user data
    getData("/useremail").then((data) => {
      if (data.length > 0) {
        setUser(data);
      }
      setLoading(false); // Set loading to false after user data is fetched
    });
  }, []);

  // Handle closing the modal and fetching assessment questions
  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
    fetchAssessmentQuestions(); // Fetch the questions in the background
  };

  const fetchAssessmentQuestions = () => {
    setLoading(true); // Show loader

    setTimeout(() => {
      getData("/assessementquestion").then((data) => {
        if (data.length > 0) {
          setAssessmentQuestions(data);
        }
        setIsQuestionsFetched(true); // Mark questions as fetched
        setLoading(false); // Hide loader after data is set
      });
    }, 5000); // Simulating a 5-second delay
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
          </Box>
        </CustomModal>
        <Navbar data={user} />
        {/* Conditionally render the AssessmentCarousel after questions are fetched */}
        {isQuestionsFetched ? (
          <AssessmentCarousel questions={assessmentQuestions} />
        ) : (
          // Skeleton Loader for the entire layout
          <CarouselSKeleton />
        )}
      </div>
    </div>
  );
};

export default Layout;
