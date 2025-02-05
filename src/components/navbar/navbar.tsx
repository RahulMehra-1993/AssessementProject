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
import UserSkelton from "../../shared/skeltons/user-skelton";
import { User } from "../../models/user/user.model";

interface NavbarProps {
  data: User[]; // Accepts a single object instead of an array
}

const Navbar: React.FC<NavbarProps> = ({ data }) => {
  const [user, setUser] = useState<User[] | null | undefined>([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (data.length > 0) {
      setUser(data); // Directly set data as user
    }
  }, [data]);

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
          {user && user[0]?.email ? (
            <Typography
              variant="body1"
              className={styles.userEmail}
              sx={{ display: "flex", alignItems: "center" }}
            >
              {user[0]?.email}
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
