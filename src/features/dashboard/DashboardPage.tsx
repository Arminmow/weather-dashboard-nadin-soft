import { Weather } from "../weather/weather";
import WeatherService from "../weather/weatherService";
import { Dashboard } from "./Dashboard";

export function DashboardPage() {
  return (
    <div>
      <Dashboard>
        <Weather>
          <Dashboard.Header>
            <Weather.LocationSearch />
          </Dashboard.Header>
          <Weather.SummeryCard />
          <button onClick={() => WeatherService.getDailyTemp(35.6892, 51.389)}>Test</button>
        </Weather>
      </Dashboard>
    </div>
  );
}
