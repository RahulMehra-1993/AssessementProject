import "./App.css";
import ErrorPage from "./pages/error/error";
import Layout from "./pages/layout/layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";




function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="*" element={<ErrorPage />} /> {/* Catch-all route */}
        </Routes>
      </Router>  
    </div>
  );
}

export default App;
