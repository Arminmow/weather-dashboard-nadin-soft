import React from "react";
import { useTranslation } from "react-i18next";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === "fa" ? "fa" : "en"; // fallback just in case

  const handleLangChange = (_: any, newLang: "en" | "fa" | null) => {
    if (newLang !== null) {
      i18n.changeLanguage(newLang);
    }
  };

  return (
    <ToggleButtonGroup
      value={currentLang}
      exclusive
      onChange={handleLangChange}
      fullWidth
      size="small"
      aria-label="Language toggle"
    >
      <ToggleButton value="en" aria-label="English">
        En
      </ToggleButton>
      <ToggleButton value="fa" aria-label="Farsi">
        Fa
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default LanguageToggle;
