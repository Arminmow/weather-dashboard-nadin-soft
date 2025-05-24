import React from "react";
import { useTranslation } from "react-i18next";
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from "@mui/material";

const LanguageSelect: React.FC = () => {
  const { i18n , t } = useTranslation();
  const currentLang = i18n.language === "fa" ? "fa" : "en";

  // Use MUI's SelectChangeEvent type here
  const handleLangChange = (event: SelectChangeEvent<"en" | "fa">) => {
    const newLang = event.target.value as "en" | "fa";
    if (newLang !== currentLang) {
      i18n.changeLanguage(newLang);
    }
  };

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel id="lang-select-label">{t('settings.Language')}</InputLabel>
      <Select
        labelId="lang-select-label"
        id="lang-select"
        value={currentLang}
        label="Language"
        onChange={handleLangChange}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="fa">فارسی</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelect;
