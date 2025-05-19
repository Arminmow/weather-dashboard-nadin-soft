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
        height: "100%", // or any height you want
        backgroundColor: "#D3E1E7",
        position: "relative",
        overflow: "hidden", // this keeps clouds from peeking outside
      }}
    >
      <BannerItem top="45%" left="30%" src="/images/sun-cloud-angled-rain.png" />
      <BannerItem top="70%" left="70%" src="/images/moon-cloud-fast-wind.png" />
      <BannerItem top="25%" left="70%" src="/images/moon-cloud-mid-rain.png" />
    </Box>
  );
};

function BannerItem({ src, top, left }: { src: string; top: string; left: string }) {
  return (
    <Box
      sx={{
        position: "absolute",
        top,
        left,
        width: "clamp(250px, 50%, 300px)", // clamps size between 150px and 300px, scaling with 15% parent width
        height: "auto",
        transform: "translate(-50%, -50%)",
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
          filter: "drop-shadow(-12.8px 51.21px 64.01px rgba(18,6,67,0.4))",
          transform: "none",
        }}
      />
    </Box>
  );
}


