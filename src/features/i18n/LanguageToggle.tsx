import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'fa' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={toggleLanguage}
      sx={{ minWidth: 100 }}
      aria-label="Toggle language"
      title="Toggle language"
    >
      {i18n.language === 'en' ? 'Fa' : 'En'}
    </Button>
  );
};

export default LanguageToggle;
