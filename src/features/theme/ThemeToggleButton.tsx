import React from "react";
import { IconButton, ToggleButton, ToggleButtonGroup, useTheme } from "@mui/material";
import { useThemeContext } from "./ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ThemeToggleButton: React.FC = () => {
  const { mode, toggleMode } = useThemeContext();
  const theme = useTheme();

  const handleModeChange = (_: any, newMode: "light" | "dark" | null) => {
    if (newMode !== null && newMode !== mode) {
      toggleMode(); // stays raw just like your logic
    }
  };

  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={handleModeChange}
      fullWidth
      size="small"
      sx={{ color: theme.palette.text.primary }}
    >
      <ToggleButton value="light" aria-label="Light mode" sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <LightModeIcon fontSize="small" />
        Light
      </ToggleButton>
      <ToggleButton value="dark" aria-label="Dark mode" sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <DarkModeIcon fontSize="small" />
        Dark
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ThemeToggleButton;
