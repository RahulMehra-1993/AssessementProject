import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./navbar.module.css";
import UserSkelton from "../../shared/skeltons/user-skelton";
import { User } from "../../models/user/user.model";
import { StoreContext } from "../../store/state-context";
import { Update } from "@mui/icons-material";

interface NavbarProps {
  data: User[]; // Accepts a single object instead of an array
}

const Navbar: React.FC<NavbarProps> = ({ data }) => {
  // context
  const context = useContext(StoreContext);
  if (!context)
    throw new Error("StoreContext must be used within a StoreProvider");
  const { state, dispatch } = context;


  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar className={styles.navbar} sx={{ boxShadow: 4 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo & Project Name */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img src="assets/optimus.png" alt="Logo" className={styles.logo} />
          {!isSmallScreen && (
            <>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ backgroundColor: "white", ml: 1, mr: 1 }}
              />
              <Typography variant="h6" className={styles.projectName}>
                Assessment
              </Typography>
            </>
          )}
        </Box>

        {/* User Section */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AccountCircleIcon
            className={styles.userIcon}
            sx={{ fontSize: 40 }}
          />

          {/* Divider */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ backgroundColor: "white", ml: 1, mr: 1 }}
          />

          {/* User Email / Guest */}
          {state.user && state.user.length > 0 ? (
            <Typography
              variant="body1"
              className={styles.userEmail}
              sx={{ display: "flex", alignItems: "center" }}
            >
              {state.user[0].name}
            </Typography>
          ) : (
            <UserSkelton />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
