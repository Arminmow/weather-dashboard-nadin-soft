import "./App.css";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { CustomThemeProvider } from "./features/theme/ThemeContext";

// I dont like comments , I think the code should be self explanatory , But...
//Imma leave you some comments whereever I think I need to explain myself

function App() {
  return (
    <CustomThemeProvider>
      <div style={{ width: "100%", height: "100%" }}>
        <DashboardPage />
      </div>
    </CustomThemeProvider>
  );
}

export default App;
