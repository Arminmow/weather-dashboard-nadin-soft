import { Box, TextField, Button, Paper, Typography, useTheme } from "@mui/material";
import { createContext, useContext, useState, type ReactNode } from "react";
import AuthService from "./authService";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface LoginContextType {
  username: string;
  setUsername: (val: string) => void;
  handleLogin: () => void;
  error: string;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const Login = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "fa";
  const navigate = useNavigate();

  const validate = (name: string) => {
    if (name.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (val: string) => {
    setUsername(val);
    validate(val);
  };

  const handleLogin = () => {
    if (!validate(username)) return;

    AuthService.login(username.trim());
    navigate("/dashboard");
  };

  return (
    <LoginContext.Provider value={{ username, setUsername: handleChange, handleLogin, error }}>
      <Paper
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        sx={{
          width: {
            xs: "95%",
            sm: "95%",
            md: "calc(100% * 2 / 4)",
          },
          height: "calc(100% * 560 / 960)",
          display: "flex", 
          flexDirection: isRtl ? "row-reverse" : "row",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
        }}
      >
        {children}
      </Paper>
    </LoginContext.Provider>
  );
};

const useLoginCtx = () => {
  const ctx = useContext(LoginContext);
  if (!ctx) throw new Error("Login.* used outside of <Login />");
  return ctx;
};

Login.Input = function LoginInput() {
  const { username, setUsername, error } = useLoginCtx();
  const { t } = useTranslation();
  return (
    <TextField
      sx={{
        width: "100%",
        input: { color: "text.primary" },
        label: { color: "text.secondary" },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "text.primary",
          },
          "&:hover fieldset": {
            borderColor: "primary.main",
          },
          "&.Mui-focused fieldset": {
            borderColor: "primary.main",
          },
        },
      }}
      label={t("login.Input")}
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      error={!!error}
      helperText={error || " "}
    />
  );
};

Login.Button = function LoginButton() {
  const { error, username } = useLoginCtx();
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Button
      sx={{ width: "100%", bgcolor: theme.palette.primary.main, px: "22px", py: "8px" }}
      variant="contained"
      type="submit"
      disabled={!!error || username.trim().length === 0}
    >
      {t("login.Btn")}
    </Button>
  );
};

Login.Title = function LoginTitle() {
  const { t } = useTranslation();
  return (
    <Typography
      variant="h4"
      sx={{
        fontWeight: 700,
        fontFamily: "Roboto",
        color: "text.primary",
        mb: 4,
        fontSize: "1.5rem",
      }}
    >
      {t("login.Title")}
    </Typography>
  );
};

Login.Banner = function LoginBanner() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: theme.palette.surface.item,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <BannerItem src="/images/sun-cloud-angled-rain.png" sx={{ top: "45%", left: "30%" }} />
      <BannerItem src="/images/moon-cloud-fast-wind.png" sx={{ top: "70%", left: "70%" }} />
      <BannerItem src="/images/moon-cloud-mid-rain.png" sx={{ top: "25%", left: "70%" }} />
    </Box>
  );
};

function BannerItem({ src, sx = {} }: { src: string; sx?: object }) {
  return (
    <Box
      sx={{
        position: "absolute",
        width: "clamp(250px, 50%, 300px)",
        height: "auto",
        transform: "translate(-50%, -50%)",
        ...sx,
      }}
    >
      <Box
        component="img"
        src={src}
        alt="Banner Item"
        sx={{
          width: "100%",
          height: "auto",
          display: "block",
          filter: "drop-shadow(-12.8px 51.21px 30px rgba(18, 6, 67, 0.4))",
        }}
      />
    </Box>
  );
}
