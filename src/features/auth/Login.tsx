import { Box, TextField, Button, Paper } from "@mui/material";
import { createContext, type ReactNode } from "react";

interface LoginContextType {
  username: string;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const Login = ({ children }: { children: ReactNode }) => {
  return (
    <LoginContext.Provider value={{ username: "" }}>
      <Paper
        component="form"
        sx={{
          width: "calc(100% * 2 / 3)",
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

Login.Input = function LoginInput() {
  return <TextField sx={{ width: "100%" }} label="Enter Your Name" />;
};

Login.Button = function LoginButton() {
  return (
    <Button sx={{ width: "100%" }} variant="contained" color="primary" type="submit">
      Login
    </Button>
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
      }}
    >
      <BannerItem top="20%" left="3%" src="/images/sun-cloud-angled-rain.png" />
      <BannerItem top="45%" left="45%" src="/images/moon-cloud-fast-wind.png" />
      <BannerItem top="0%" left="45%" src="/images/moon-cloud-mid-rain.png" />
    </Box>
  );
};

function BannerItem({ src, top, left }: { src: string; top: string; left: string }) {
  return (
    <Box
      sx={{
        width: "40%",
        height: "50%",
        position: "absolute", // 👈 needed for top & left
        top: top,
        left: left,
        overflow: "hidden",
        backgroundColor: "transparent",
      }}
    >
      <img style={{ width: "100%", height: "100%" }} src={src} alt="Banner Item" />
    </Box>
  );
}
