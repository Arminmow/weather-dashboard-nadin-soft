import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { createContext, useContext, useState, type ReactNode } from "react";
import AuthService from "./authService";

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
          flexDirection: "row",
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
  return (
    <TextField
      sx={{ width: "100%" }}
      label="Enter Your Name"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      error={!!error}
      helperText={error || " "}
    />
  );
};

Login.Button = function LoginButton() {
  const { error, username } = useLoginCtx();
  return (
    <Button
      sx={{ width: "100%", bgcolor: "#2196F3", px: "22px", py: "8px" }}
      variant="contained"
      color="primary"
      type="submit"
      disabled={!!error || username.trim().length === 0}
    >
      Login
    </Button>
  );
};

Login.Title = function LoginTitle() {
  return (
    <Typography
      variant="h4"
      sx={{
        fontWeight: 700,
        fontFamily: "Roboto",
        color: "#050F24",
        mb: 4,
        fontSize: "1.5rem",
      }}
    >
      Login
    </Typography>
  );
};

Login.Banner = function LoginBanner() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "#D3E1E7",
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
