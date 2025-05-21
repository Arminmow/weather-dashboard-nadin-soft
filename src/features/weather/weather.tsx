import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Autocomplete, Box, Paper, TextField, Typography } from "@mui/material";
import { interBase, size14, size16, size32, size40, typographyBase } from "./styles";
import WeatherService from "./weatherService";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { City } from "../dashboard/types";
import type { WeatherData } from "./types";

interface DashboardContextType {
  weather: WeatherData | null;
  setWeather: React.Dispatch<React.SetStateAction<WeatherData | null>>;
}

const WeatherContext = createContext<DashboardContextType | null>(null);

export const Weather = ({ children }: { children: React.ReactNode }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  return <WeatherContext.Provider value={{ weather, setWeather }}>{children}</WeatherContext.Provider>;
};

Weather.LocationSearch = function () {
  const [value, setValue] = useState<City | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [options, setOptions] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { setWeather } = useContext(WeatherContext)!;

  //Its the debounce methoed to prevent multiple API calls on each key stroke
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
      WeatherService.getCities(inputValue)
        .then((cities) => {
          setOptions(cities);
          setLoading(false);
        })
        .catch(() => {
          setOptions([]);
          setLoading(false);
        });
    }, 400);
  }, [inputValue, debounceTimeout]);

  const hangleChange = (newValue: City | null) => {
    if (!newValue) return;
    setValue(newValue);

    WeatherService.getWeather(newValue.lat, newValue.lon).then((data) => {
      setWeather(data);
      console.log("weatherInfo", data);
    });
  };

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => hangleChange(newValue)}
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

function LocationBadge({ city }: { city: string }) {
  return (
    <Box
      sx={{
        bgcolor: "#CDD9E0",
        p: "10px 13px",
        borderRadius: "50px",
        display: "flex",
        gap: 1.5,
        alignItems: "center",
        width: "fit-content",
      }}
    >
      <LocationOnIcon />
      <Typography sx={{ ...interBase, ...size16 }}>{city}</Typography>
    </Box>
  );
}

function DayDate({ day, date, time }: { day: string; date: string; time: string }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <Typography sx={{ ...typographyBase, ...size32 }}>{day}</Typography>
      <Box sx={{ display: "flex", gap: "20px" }}>
        <Typography sx={{ ...typographyBase, ...size14 }}>{date}</Typography>
        <Typography sx={{ ...typographyBase, ...size14 }}>{time}</Typography>
      </Box>
    </Box>
  );
}

function Temperature({ temp, temp_min, temp_max }: { temp: number; temp_min: number; temp_max: number }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography sx={{ ...typographyBase, ...size40 }}>{`${temp}°C`}</Typography>
      <Typography sx={{ ...typographyBase, ...size14 }}>
        High: {temp_max} Low: {temp_min}
      </Typography>
    </Box>
  );
}

function WeatherIcon({ code, alt }: { code: string; alt: string }) {
  return (
    //OpenWeatherMap weather icon api. Not gonna download and store your Figma provided weather icons in /public, sorry 
    <Box
      component="img"
      src={`https://openweathermap.org/img/wn/${code}@4x.png`}
      alt={alt}
      sx={{ width: 100, height: 100 }}
    />
  );
}

function WeatherDescription({ desc, feels_like }: { desc: string; feels_like: number }) {
  return (
    <>
      <Typography sx={{ ...interBase, ...size32 }}>{desc}</Typography>
      <Typography sx={{ ...interBase, ...size16 }}>Feels Like {feels_like}°C</Typography>
    </>
  );
}

Weather.SummeryCard = function () {
  const { weather } = useContext(WeatherContext)!;

  if (!weather) return null;
  return (
    <Paper elevation={4} sx={{ bgcolor: "#E1E9EE", borderRadius: 3, p: 3, width: "450px", mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <LocationBadge city={weather.city} />
          <DayDate day={weather.day} date={weather.date} time={weather.time} />
          <Temperature temp={weather.temp} temp_min={weather.temp_min} temp_max={weather.temp_max} />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <WeatherIcon code={weather.icon} alt={weather.description} />
          <WeatherDescription desc={weather.description} feels_like={weather.feels_like} />
        </Box>
      </Box>
    </Paper>
  );
};
