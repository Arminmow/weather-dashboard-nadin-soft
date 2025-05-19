import { createContext, useEffect, useState } from "react";
import AuthService from "../auth/authService";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";

interface DashboardContextType {
  username: string | null;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const Dashboard = ({ children }: { children: React.ReactNode }) => {
  const username = AuthService.getUsername();

  return (
    <DashboardContext.Provider value={{ username }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </DashboardContext.Provider>
  );
};

Dashboard.Header = function () {
  return (
    <AppBar position="static" sx={{ bgcolor: "#F3FAFE" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: {
            xs: "center", // center on mobile
            sm: "space-between", // normal layout on desktop
          },
          alignItems: "center",
          paddingTop: "12px",
          paddingRight: "24px",
          paddingBottom: "12px",
          paddingLeft: "24px",
        }}
      >
        {/* Left side - Title (hidden on small screens) */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontFamily: "Roboto",
            fontWeight: 400,
            fontSize: "1.5rem",
            lineHeight: "150%",
            letterSpacing: "0.15px",
            color: "#3D4852",
            display: { xs: "none", sm: "block", md: "block" },
          }}
        >
          Weather Dashboard
        </Typography>

        {/* Right side - Selector and Icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <Dashboard.Selector />
          <IconButton
            color="inherit"
            aria-label="settings"
            sx={{
              fontWeight: "bold",
              color: "#3D4852",
              border: "1px solid #3D4852",
              borderRadius: "8px",
            }}
          >
            <SettingsOutlinedIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Dashboard.Selector = function () {
  const [cities, setCities] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    setLoading(true);
    // Mock API call for cities
    setTimeout(() => {
      setCities([
        { id: 1, name: "Tehran" },
        { id: 2, name: "Mashhad" },
        { id: 3, name: "Isfahan" },
        { id: 4, name: "Shiraz" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (event) => {
    setSelectedCity(event.target.value);
    // You can handle city change logic here or via context/state lift later
    console.log("Selected city:", event.target.value);
  };

  return (
    <FormControl sx={{ minWidth: 300 }} size="small">
      <InputLabel id="city-select-label">Search Your Location</InputLabel>
      {loading ? (
        <CircularProgress size={24} sx={{ display: "block" }} />
      ) : (
        <Select
          sx={{ height: "100%" }}
          labelId="city-select-label"
          id="city-select"
          value={selectedCity}
          label="Search Your Location"
          onChange={handleChange}
          input={<OutlinedInput label="Search Your Location" />}
        >
          {cities.map((city) => (
            <MenuItem key={city.id} value={city.name}>
              {city.name}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};
