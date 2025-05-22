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
          <Weather.TemperatureChart/>
          <Weather.ForecastWrapper/>
        </Weather>
      </Dashboard>
    </div>
  );
}
