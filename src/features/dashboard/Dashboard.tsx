import { createContext, useEffect, useMemo, useState } from "react";
import AuthService from "../auth/authService";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import ApiService from "./apiService";
import type { City } from "./types";

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
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const debounceTimeout = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    return (callback: () => void, delay: number) => {
      clearTimeout(timeout);
      timeout = setTimeout(callback, delay);
    };
  }, []);

  useEffect(() => {
    if (inputValue.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    debounceTimeout(() => {
      ApiService.getCities(inputValue)
        .then((cities) => {
          console.log(cities);

          setOptions(cities);
          setLoading(false);
        })
        .catch(() => {
          setOptions([]);
          setLoading(false);
        });
    }, 400);
  }, [inputValue, debounceTimeout]);

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => setValue(newValue)}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      options={options}
      getOptionLabel={(option) => `${option.name} - ${option.country}`}
      loading={loading}
      filterOptions={(x) => x}
      noOptionsText={inputValue.length < 2 ? "Type at least 2 characters" : "No cities found"}
      renderInput={(params) => <TextField {...params} label="Search Your Location" variant="outlined" size="small" />}
      sx={{ minWidth: 300 }}
    />
  );
};
