import { Box, useTheme } from "@mui/material";
import { Weather } from "../weather/weather";
import { Dashboard } from "./Dashboard";
import ThemeToggleButton from "../theme/ThemeToggleButton";
import LanguageToggle from "../i18n/LanguageToggle";

export function DashboardPage() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: "100vh", // full screen height
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.surface.main, // optional
      }}
    >
      {/* Main dashboard content */}
      <Box sx={{ flexGrow: 1 }}>
        <Dashboard>
          <Weather>
            <Dashboard.Header>
              <Weather.LocationSearch />
              <ThemeToggleButton/>
              <LanguageToggle/>
            </Dashboard.Header>

            {/* Main content */}
            <Box
              data-name="dashboard-data"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "50px",
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
                <Box sx={{ width: { xs: "100%", md: "40%" }, boxSizing: "border-box" }}>
                  <Weather.SummeryCard />
                </Box>

                <Box sx={{ width: { xs: "100%", md: "60%" }, boxSizing: "border-box" }}>
                  <Weather.TemperatureChart />
                </Box>
              </Box>

              <Box sx={{ width: "100%", boxSizing: "border-box" }}>
                <Weather.ForecastWrapper />
              </Box>
            </Box>
          </Weather>
        </Dashboard>
      </Box>

      {/* Footer at the bottom after all content */}
      <Dashboard.Footer />
    </Box>
  );
}
