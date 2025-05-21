import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { City } from "../dashboard/types";
import { Autocomplete, TextField } from "@mui/material";
import WeatherService from "./weatherService";
import type { WeatherData } from "./types";

interface DashboardContextType {
  weather: WeatherData | null;
  setWeather: React.Dispatch<React.SetStateAction<WeatherData | null>>;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const Weather = ({ children }: { children: React.ReactNode }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  return <DashboardContext.Provider value={{ weather, setWeather }}>{children}</DashboardContext.Provider>;
};

Weather.LocationSearch = function () {
  const [value, setValue] = useState<City | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [options, setOptions] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { setWeather } = useContext(DashboardContext)!;

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

Weather.SummeryCard = function () {
  const { weather } = useContext(DashboardContext)!;

  if (!weather) return null;
  return (
    <div>
      <h1>{weather.description}</h1>
    </div>
  );
};
