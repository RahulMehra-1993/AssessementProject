import { useContext } from "react";
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
import { StoreContext } from "../../store/stateContext";
import useApi from "../../services/useCustomApiService";

const Navbar = () => {
  const context = useContext(StoreContext);
  if (!context)
    throw new Error("StoreContext must be used within a StoreProvider");

  const { state } = context;
  const { loading } = useApi();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));


  return (
    <AppBar
      className={styles.navbar}
      sx={{
        boxShadow: 4,
        "& .MuiToolbar-root": {
          fontWeight: "bold",
          fontSize: "var(--font-size-sm)",
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
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img src="/assets/optimus.png" alt="Logo" className={styles.logo} />
          {!isSmallScreen && (
            <>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ backgroundColor: "white", mx: 1 }}
              />
              <Typography className={styles.projectName}>Assessment</Typography>
            </>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AccountCircleIcon className={styles.userIcon} />
          <Divider
            orientation="vertical"
            flexItem
            sx={{ backgroundColor: "white", mx: 1 }}
          />

          {loading ? (
            <UserSkelton />
          ) : (
            <Typography className={styles.userEmail}>
              {state?.user?.[0]?.name || "User"}
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
