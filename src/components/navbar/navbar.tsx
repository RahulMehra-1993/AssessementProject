import React, { useEffect, useState } from "react";
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

interface NavbarProps {
  data: {
    createdAt: string;
    name: string;
    email: string;
    avatar: string;
    id: string;
    message: string;
  }[];
}

const Navbar: React.FC<NavbarProps> = ({ data }) => {
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    avatar?: string;
    message?: string;
  } | null>(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Correctly using breakpoints for small screens

  useEffect(() => {
    if (data.length > 0) {
      setUser(data[0]); // Take the first item from the passed data
    }
  }, [data]);

  return (
    <AppBar position="sticky" className={styles.navbar} sx={{ boxShadow: 4 }}>
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
          {/* Avatar or Account Icon */}
          {user?.avatar ? (
            <Avatar
              src={user.avatar}
              alt={user.name}
              className={styles.userAvatar}
              sx={{ width: 40, height: 40 }}
            />
          ) : (
            <AccountCircleIcon
              className={styles.userIcon}
              sx={{ fontSize: 40 }}
            />
          )}

          {/* Divider */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ backgroundColor: "white", ml: 1, mr: 1 }}
          />

          {/* User Email / Guest */}
          {user?.email ? (
            <Typography
              variant="body1"
              className={styles.userEmail}
              sx={{ display: "flex", alignItems: "center" }}
            >
              {user.email}
            </Typography>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1">Guest User</Typography>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
