import { Box } from "@mui/material";
import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            width: "100dvw",
            textAlign: "center",
            padding: "20px",
            color: "red",
          }}
        >
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or try again later.</p>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
