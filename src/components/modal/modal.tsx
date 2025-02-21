import React from "react";
import ReactDOM from "react-dom";
import { Modal, Box, IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Ensure modal root exists
const modalRoot =
  document.getElementById("modal-root") ||
  (() => {
    const root = document.createElement("div");
    root.id = "modal-root";
    document.body.appendChild(root);
    return root;
  })();

const CustomModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // Prevent modal close when overlay is clicked, unless `isOpen` is true
  const handleOverlayClick = (event: React.MouseEvent) => {
    console.log(event);
    // Only close modal if isOpen is true and event target is the overlay
    if (isOpen && event.target === event.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <Modal open={isOpen} onClose={onClose} closeAfterTransition>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 700, // 90% width of the viewport
          transform: "translate(-50%, -50%)",
          maxWidth: "90%",
          minHeight:"200px",
          bgcolor: "white", // Clean white background for the modal
          borderRadius: 8, // Rounded corners
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)", // Soft shadow for the modal
          outline: "none",
          zIndex: 1300,
          overflow: "hidden",
        }}
      >
        {/* Modal background blur effect */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.6)", // Soft white overlay with a touch of opacity
            backdropFilter: "blur(8px)", // Subtle blur effect
            zIndex: -1,
            borderRadius: 8,
          }}
          onClick={handleOverlayClick} // Handle overlay click
        />

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "rgba(0, 0, 0, 0.6)", // Softer dark gray for better visibility
            backgroundColor: "transparent",
            transition:
              "background-color 0.2s ease-in-out, transform 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.1)", // Subtle hover effect
              transform: "scale(1.1)", // Slight scaling effect on hover
            },
            "&:active": {
              transform: "scale(0.9)", // Press effect for a better UX
            },
          }}
        >
          <CloseRoundedIcon fontSize="medium" />
        </IconButton>

        {/* Modal Content */}
        <Box
          sx={{
            color: "#333", // Dark gray text for better readability
            lineHeight: 1.6,
            fontSize: "1rem",
            fontWeight: "300", // Lighter font weight for a minimalist feel
            marginTop: 5,
          }}
        >
          {children}
        </Box>
      </Box>
    </Modal>,
    modalRoot
  );
};

export default CustomModal;
