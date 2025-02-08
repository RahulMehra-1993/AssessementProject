import React, { useContext} from "react";
import {
  AppBar,
  Toolbar,
  Typography,

  Box,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./navbar.module.css";
import UserSkelton from "../../shared/skeltons/user-skelton";
import { StoreContext } from "../../store/state-context";



const Navbar = () => {
  // context
  const context = useContext(StoreContext);
  if (!context)
    throw new Error("StoreContext must be used within a StoreProvider");
  const { state, dispatch } = context;

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar
      className={styles.navbar}
      sx={{
        boxShadow: 4,
        "& .MuiToolbar-root": {
          fontWeight: "bold",
          fontSize: "12px",
          padding: "",
          minHeight: "48px",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo & Project Name */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img
            src="/public/assets/optimus.png"
            alt="Logo"
            className={styles.logo}
          />
          {!isSmallScreen && (
            <>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ backgroundColor: "white", ml: 1, mr: 1 }}
              />
              <Typography className={styles.projectName}>Assessment</Typography>
            </>
          )}
        </Box>

        {/* User Section */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AccountCircleIcon className={styles.userIcon} />
          {/* Divider */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ backgroundColor: "white", ml: 1, mr: 1 }}
          />

          {/* User Email / Guest */}
          {state.userLoading ? (
            <UserSkelton />
          ) : (
            <Typography
              className={styles.userEmail}
              sx={{ display: "flex", alignItems: "center" }}
            >
              {state.user ? state.user[0]?.name : "User not found"}
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
