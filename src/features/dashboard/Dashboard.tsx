import { createContext } from "react";
import AuthService from "../auth/authService";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

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

Dashboard.Footer = function () {
  return (
    <Box
      sx={{
        width: "100%",
        background: "linear-gradient(90deg, #F3FAFE 0%, rgba(204, 221, 221, 0.619608) 51%, #F3FAFE 100%)",
        padding: "32px 20px",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          rowGap: "20px",
        }}
      >
        {/* Logo + copyright */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flex: "1 1 300px",
            minWidth: "280px",
          }}
        >
          <img src="/images/footerLogo.png" alt="Logo" style={{ width: "50px", height: "50px" }} />
          <Typography variant="body2" sx={{ color: "#3D4852" }}>
            All rights of this site are reserved for Nadin Sadr Aria Engineering Company.
          </Typography>
        </Box>

        {/* Contact info */}
        <Box
          sx={{
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            flex: "1 1 300px",
            minWidth: "280px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <MailOutlineOutlinedIcon sx={{ color: "#3D4852" }} />
            <Typography variant="body2" sx={{ color: "#3D4852" }}>
              contact us: info@nadin.ir
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CalendarMonthOutlinedIcon sx={{ color: "#3D4852" }} />
            <Typography variant="body2" sx={{ color: "#3D4852" }}>
              12:25 · Monday 23 December 2023
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
