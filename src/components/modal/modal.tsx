import React from "react";
import ReactDOM from "react-dom";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
    console.log(event)
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
          transform: "translate(-50%, -50%)",
          width: 400,
          maxWidth: "90%",
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

        {/* Close Icon */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "#666", // Soft gray for the close icon
            backgroundColor: "transparent", // Transparent background for the icon button
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.1)", // Subtle hover effect
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Modal Content */}
        <Box
          sx={{
            color: "#333", // Dark gray text for better readability
            lineHeight: 1.6,
            fontSize: "1rem",
            fontWeight: "300", // Lighter font weight for a minimalist feel
            marginTop: 3,
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
