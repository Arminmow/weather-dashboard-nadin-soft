import { createContext } from "react";
import AuthService from "../auth/authService";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { AppBar, Box, IconButton, Toolbar, Typography, useTheme } from "@mui/material";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const theme = useTheme();
  return (
    <AppBar position="static" sx={{ bgcolor: theme.palette.surface.main }}>
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
            color: theme.palette.text.primary,
            display: { xs: "none", sm: "block", md: "block" },
          }}
        >
          {t("headerTitle")}
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
              border: `1px solid ${theme.palette.text.primary}`,
              borderRadius: "8px",
            }}
          >
            <SettingsOutlinedIcon sx={{ color: theme.palette.text.primary }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Dashboard.Footer = function () {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "fa";
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        background: `linear-gradient(90deg, ${theme.palette.surface.card} 0%, ${theme.palette.surface.item} 50.5%, ${theme.palette.surface.main} 98%)`,
        padding: "32px 20px",
        boxSizing: "border-box",
        color: theme.palette.text.primary,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          rowGap: "20px",
          direction: isRtl ? "rtl" : "ltr",
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
          <Typography variant="body2">{t("footer.text")}</Typography>
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
            <MailOutlineOutlinedIcon />
            <Typography variant="body2">{t("footer.contact")}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CalendarMonthOutlinedIcon />
            <Typography variant="body2">12:25 · Monday 23 December 2023</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
