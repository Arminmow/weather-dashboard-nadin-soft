import { createContext } from "react";
import AuthService from "../auth/authService";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";

interface DashboardContextType {
  username: string | null;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const Dashboard = ({ children }: { children: React.ReactNode }) => {
  const username = AuthService.getUsername();

  return (
    <DashboardContext.Provider value={{ username }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </DashboardContext.Provider>
  );
};

Dashboard.Header = function ({ children }: { children: React.ReactNode }) {
  return (
    <AppBar position="static" sx={{ bgcolor: "#F3FAFE" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: {
            xs: "center", // center on mobile
            sm: "space-between", // normal layout on desktop
          },
          alignItems: "center",
          paddingTop: "12px",
          paddingRight: "24px",
          paddingBottom: "12px",
          paddingLeft: "24px",
        }}
      >
        {/* Left side - Title (hidden on small screens) */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontFamily: "Roboto",
            fontWeight: 400,
            fontSize: "1.5rem",
            lineHeight: "150%",
            letterSpacing: "0.15px",
            color: "#3D4852",
            display: { xs: "none", sm: "block", md: "block" },
          }}
        >
          Weather Dashboard
        </Typography>

        {/* Right side - Selector and Icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          {children}
          <IconButton
            color="inherit"
            aria-label="settings"
            sx={{
              fontWeight: "bold",
              color: "#3D4852",
              border: "1px solid #3D4852",
              borderRadius: "8px",
            }}
          >
            <SettingsOutlinedIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
