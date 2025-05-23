import { createContext, useState } from "react";
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AuthService from "../auth/authService";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LanguageToggle from "../i18n/LanguageToggle";
import ThemeToggleButton from "../theme/ThemeToggleButton";
import LogoutIcon from "@mui/icons-material/Logout";

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
            xs: "center", 
            sm: "space-between", 
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
          <Box
            color="inherit"
            aria-label="settings"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.text.primary}`,
              borderRadius: "8px",
              p: 0.5,
            }}
          >
            <Dashboard.SettingsDropdown />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Dashboard.SettingsDropdown = function () {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const { t } = useTranslation();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} aria-label="Settings" size="small" sx={{ color: "text.primary" }}>
        <SettingsOutlinedIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 4,
          sx: {
            borderRadius: 2,
            width: 240,
            mt: 1,
            overflow: "visible",
            px: 1,
            bgcolor: theme.palette.surface.main,
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* Theme toggle */}
        <Box px={1.5} py={1}>
          <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
            {t("settings.Mode")}
          </Typography>
          <ThemeToggleButton />
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Language toggle */}
        <Box px={1.5} py={1}>
          <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
            {t("settings.Language")}
          </Typography>
          <LanguageToggle />
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Exit option */}
        <MenuItem
          onClick={() => {
            handleClose();
            alert("Exiting...");
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={t("settings.Exit")} />
        </MenuItem>
      </Menu>
    </>
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
