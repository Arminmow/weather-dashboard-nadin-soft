import { Box } from "@mui/material";
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
          <Box
            data-name="dashboard-data"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "28px",
              width: "100%",
              overflow: "hidden",
              padding: "20px",
              boxSizing: "border-box",
            }}
          >
            <Box
              data-name="first row"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                width: "100%",
                gap: "50px",
                boxSizing: "border-box",
              }}
            >
              <Box sx={{ width: { xs: "100%", md: "33.33%" }, boxSizing: "border-box" }}>
                <Weather.SummeryCard />
              </Box>

              <Box sx={{ width: { xs: "100%", md: "66.66%" }, boxSizing: "border-box" }}>
                <Weather.TemperatureChart />
              </Box>
            </Box>

            <Box sx={{ width: "100%", boxSizing: "border-box" }}>
              <Weather.ForecastWrapper />
            </Box>
          </Box>
        </Weather>
      </Dashboard>
    </div>
  );
}
