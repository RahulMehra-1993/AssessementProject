import "./App.css";
import ErrorPage from "./pages/error-page/errorPage";
import Layout from "./pages/layout-page/layoutPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import PostSubmission from "./pages/post-submit-page/postSubmitPage";
import { useEffect, useState } from "react";

import { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const completed = sessionStorage.getItem("complete");

  useEffect(() => {
    if (completed && JSON.parse(completed) === true) {
      navigate("/assessment/post_submit", { replace: true });
    }
  }, [completed, navigate]);

  return completed && JSON.parse(completed) === true ? (
    <Navigate to="/assessment/post_submit" replace />
  ) : (
    children
  );
}

function App() {
  useEffect(() => {
    // Prevent going back to a restricted route
    const handleBackButton = () => {
      if (sessionStorage.getItem("complete") === "true") {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/assessment/user_id/assessement_id" replace />}
          />
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          />
          <Route path="/assessment/post_submit" element={<PostSubmission />} />
          <Route path="*" element={<ErrorPage />} /> {/* Catch-all route */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
