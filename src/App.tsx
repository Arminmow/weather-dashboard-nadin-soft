import { useEffect } from "react";
import "./App.css";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { CustomThemeProvider } from "./features/theme/ThemeContext";
import AuthService from "./features/auth/authService";
import { Routes, Route, useNavigate, BrowserRouter } from "react-router-dom";
import { LoginPage } from "./features/auth/LoginPage";
import { ProtectedRoute } from "./features/routes/ProtectedRoute";

// I dont like comments , I think the code should be self explanatory , But...
//Imma leave you some comments whereever I think I need to explain myself
//Re deploy

function AppRouter() {
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.isLoggedIn()) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
function App() {
  return (
    <CustomThemeProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </CustomThemeProvider>
  );
}

export default App;
