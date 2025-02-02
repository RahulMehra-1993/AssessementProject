import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import createSagaMiddleware from "redux-saga";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import { reducers } from "./reducers/index"; // Corrected import path
import rootSaga from "./sagas/index"; // Corrected import path

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure Redux store
const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// Run sagas
sagaMiddleware.run(rootSaga);

// Render application
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
