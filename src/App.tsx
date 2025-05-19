import "./App.css";
import { LoginPage } from "./features/auth/LoginPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";

function App() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <DashboardPage />
    </div>
  );
}

export default App;
