import { createTheme, ThemeProvider } from "@mui/material";
import "./App.css";
import { LoginPage } from "./features/auth/LoginPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { useMemo, useState } from "react";
import getDesignTokens from "./features/theme/teme";

// I dont like comments , I think the code should be self explanatory , But...
//Imma leave you some comments whereever I think I need to explain myself

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
   const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

     const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ width: "100%", height: "100%" }}>
        <DashboardPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
