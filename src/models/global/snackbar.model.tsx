export  interface Snackbar {
    message: string;
    show: boolean;
    severity: "error" | "warning" | "info" | "success";
    close: () => void;
  }
  