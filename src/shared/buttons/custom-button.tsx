import { Button, ButtonProps, SxProps, Theme } from "@mui/material";
import React from "react";

interface CustomButtonProps extends ButtonProps {
  text?: string;
  variant: "contained" | "outlined" | "text"; // Renamed 'style' to 'variant' for clarity;
  isDisabled?:boolean ;
  sx?: SxProps<Theme>; // Use sx prop for styling
  onClick: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  variant, 
  onClick,
  isDisabled,
  sx
}) => {
  return (
    <Button
    disabled={isDisabled}
      onClick={onClick}
      variant={variant} // Use the variant prop directly
      sx={{
        fontSize: "12px",
        backgroundImage: variant === "outlined"  // Conditional background
          ? "var(--theme-bg-neutral) !important"
          : "none",
        color: variant === "contained" ? "#fff" : "inherit", // Conditional color
        fontWeight: 600,
        borderRadius: "24px !important",
        padding: "6px 16px",
        textTransform: "none",
        transition: "0.3s",
        opacity:isDisabled ? 0.5 : .8,
        "&:hover": {
          opacity:.8,

        },
        ...sx,
      }}
    >
      {text}
    </Button>
  );
};

export default CustomButton;