import { Weather } from "../weather/weather";
import { Dashboard } from "./Dashboard";

export function DashboardPage() {
  return (
    <div>
      <Dashboard>
        <Weather>
          <Dashboard.Header>
            <Weather.LocationSearch />
          </Dashboard.Header>
          <Weather.SummeryCard/>
        </Weather>
      </Dashboard>
    </div>
  );
}
