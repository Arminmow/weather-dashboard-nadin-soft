import React from "react";
import { IconButton, useTheme } from "@mui/material";
import { useThemeContext } from "./ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ThemeToggleButton: React.FC = () => {
  const { mode, toggleMode } = useThemeContext();
  const theme = useTheme();

  return (
    <IconButton onClick={toggleMode} sx={{ color: theme.palette.text.primary }}>
      {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
};

export default ThemeToggleButton;
