import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { StoreProvider } from "./store/stateContext";
import ErrorBoundary from "./components/error-boundary/errorBoundary";

// Render application
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary> 
      <StoreProvider>
        <App />
      </StoreProvider>
    </ErrorBoundary> 
  </StrictMode>
);
