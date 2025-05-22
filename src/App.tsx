import "./App.css";
import { LoginPage } from "./features/auth/LoginPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";

// I dont like comments , I think the code should be self explanatory , But...
//Imma leave you some comments whereever I think I need to explain myself

function App() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <DashboardPage />
    </div>
  );
}

export default App;
