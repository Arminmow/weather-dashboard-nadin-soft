import { createContext, use, useContext, useEffect, useMemo, useState } from "react";
import { Autocomplete, Box, Paper, TextField, Typography, useTheme } from "@mui/material";
import { interBase, size14, size16, size32, size40, typographyBase } from "./styles";
import WeatherService from "./weatherService";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { City } from "../dashboard/types";
import type { WeatherData } from "./types";
import { LineChart } from "@mui/x-charts";
import { useTranslation } from "react-i18next";

interface DashboardContextType {
  weather: WeatherData | null;
  setWeather: React.Dispatch<React.SetStateAction<WeatherData | null>>;
  tempAvg: Record<string, number>;
  setTempAvg: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const WeatherContext = createContext<DashboardContextType | null>(null);

export const Weather = ({ children }: { children: React.ReactNode }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [tempAvg, setTempAvg] = useState<Record<string, number>>({});

  return <WeatherContext.Provider value={{ weather, setWeather, tempAvg, setTempAvg }}>{children}</WeatherContext.Provider>;
};

Weather.LocationSearch = function () {
  const { t } = useTranslation();
  const [value, setValue] = useState<City | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [options, setOptions] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { setWeather, setTempAvg } = useContext(WeatherContext)!;

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
    WeatherService.getDailyTemp(newValue.lat, newValue.lon).then((data) => {
      console.log("tempAvg", data);
      setTempAvg(data ?? {});
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
      renderInput={(params) => <TextField {...params} label={t("locationSearch")} variant="outlined" size="small" />}
      sx={{ minWidth: 300 }}
    />
  );
};

function LocationBadge({ city }: { city: string }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: theme.palette.surface.item,
        p: "10px 13px",
        borderRadius: "9999px",
        display: "flex",
        gap: 1.5,
        alignItems: "center",
      }}
    >
      <LocationOnIcon sx={{ color: theme.palette.text.primary, fontSize: 20 }} />
      <Typography
        sx={{
          ...interBase,
          ...size16,
          color: theme.palette.text.primary,
        }}
      >
        {city}
      </Typography>
    </Box>
  );
}

function DayDate({ day, date, time }: { day: string; date: string; time: string }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        color: theme.palette.text.primary,
        fontFamily: "'Google Sans', sans-serif",
        userSelect: "none",
      }}
    >
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: "2rem",
          lineHeight: 1.2,
          letterSpacing: "0.02em",
          color: theme.palette.text.primary,
        }}
      >
        {t(`weekDay.${day}`)}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2.5,
          fontSize: "0.875rem",
          fontWeight: 500,
          color: theme.palette.text.secondary,
          letterSpacing: "0.03em",
        }}
      >
        <Typography>{date}</Typography>
        <Typography>{time}</Typography>
      </Box>
    </Box>
  );
}

function Temperature({
  temp,
  temp_min,
  temp_max,
  showMinMax,
}: {
  temp: number;
  temp_min: number;
  temp_max: number;
  showMinMax: boolean;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        color: theme.palette.text.primary,
        gap: 1,
        userSelect: "none",
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "3rem",
          lineHeight: 1,
          fontFamily: "'Google Sans', sans-serif",
          color: theme.palette.text.primary,
        }}
      >
        {`${temp}°C`}
      </Typography>

      {showMinMax && (
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "0.875rem", // 14px, smaller but readable
            color: theme.palette.text.secondary,
            fontFamily: "'Google Sans', sans-serif",
            letterSpacing: "0.03em",
          }}
        >
          {`${t("temp.max")}: ${temp_max}°  |  ${t("temp.min")}: ${temp_min}°`}
        </Typography>
      )}
    </Box>
  );
}

function WeatherIcon({ code, alt }: { code: string; alt: string }) {
  return (
    //OpenWeatherMap weather icon api. Not gonna download and store your Figma provided weather icons in /public, sorry
    <Box component="img" src={code} alt={alt}  />
  );
}

function WeatherDescription({ desc, feels_like }: { desc: string; feels_like: number }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "fa";
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        color: theme.palette.text.primary,
        direction: isRtl ? "rtl" : "ltr",
      }}
    >
      <Typography
        sx={{
          ...interBase,
          ...size32,
          fontWeight: 600,
        }}
      >
        {t(`weather.${desc}`)}
      </Typography>

      <Typography
        sx={{
          ...interBase,
          ...size16,
          fontWeight: 400,
          textAlign: isRtl ? "right" : "left",
          opacity: 0.85,
        }}
      >
        {t("temp.feelsLike")} {feels_like}°C
      </Typography>
    </Box>
  );
}

Weather.SummeryCard = function () {
  const { weather } = useContext(WeatherContext)!;
  const theme = useTheme();
  const { i18n } = useTranslation();

  if (!weather) return null;

  const isRtl = i18n.language === "fa";

  return (
    <Paper
      elevation={4}
      sx={{
        bgcolor: theme.palette.surface.card,
        borderRadius: 3,
        p: 3,
        width: "100%",
        mt: 2,
        boxSizing: "border-box",
        height: "100%",
        direction: isRtl ? "rtl" : "ltr",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            textAlign: isRtl ? "right" : "left", 
          }}
        >
          <LocationBadge city={weather.city} />
          <DayDate day={weather.day} date={weather.date} time={weather.time} />
          <Temperature temp={weather.temp} temp_min={weather.temp_min} temp_max={weather.temp_max} showMinMax={true} />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <WeatherIcon code={weather.icon} alt={weather.description} />
          <WeatherDescription desc={weather.description} feels_like={weather.feels_like} />
        </Box>
      </Box>
    </Paper>
  );
};
Weather.TemperatureChart = function () {
  const { tempAvg } = useContext(WeatherContext)!;
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "fa";

  const months = isRtl ? Object.keys(tempAvg).reverse() : Object.keys(tempAvg);
  const temps = isRtl ? Object.values(tempAvg).reverse() : Object.values(tempAvg);

  return (
    <Paper
      elevation={4}
      sx={{
        height: "100%",
        bgcolor: theme.palette.surface.card,
        borderRadius: 3,
        p: 1,
        width: "100%",
        mt: 2,
        boxSizing: "border-box",
        direction: isRtl ? "rtl" : "ltr",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        <Typography
          sx={{
            fontFamily: "Google Sans, sans-serif",
            fontWeight: 700,
            fontSize: "18px",
            lineHeight: "100%",
            letterSpacing: "0%",
            m: 2,
            mb: 0,
            textAlign: isRtl ? "right" : "left",
          }}
        >
          {t("chartTitle")}
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <LineChart
            height={200}
            xAxis={[
              {
                scaleType: "point",
                data: months,
                disableLine: true,
                tickLabelStyle: {
                  fontSize: 12,
                  fill: theme.palette.text.primary,
                },
              },
            ]}
            yAxis={[
              {
                disableLine: true,
                position: isRtl ? "right" : "left",
                offset: 10,
              },
            ]}
            series={[
              {
                data: temps,
                showMark: false,
              },
            ]}
            grid={{ horizontal: true, vertical: true }}
            sx={{
              direction: isRtl ? "rtl" : "ltr",
              "& .MuiChartsAxis-tickLabel": {
                fontSize: 5,
                fill: theme.palette.text.primary,
              },
              "& .MuiChartsGrid-line": {
                stroke: "#ccc",
                strokeDasharray: "4 4",
              },
              "& .MuiChartsLineSeries-line": {
                strokeWidth: 5,
              },
              height: "100%",
              justifyContent: "end",
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

Weather.ForecastItem = function ({ day, src, temp }: { day: string; src: string; temp: number }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        borderRadius: "24px",
        padding: "22px 16px",
        bgcolor: theme.palette.surface.item,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
        <Typography sx={{ color: theme.palette.text.primary }}>{t(`weekDay.${day}`)}</Typography>
        <Box
          sx={{
            height: "2px",
            width: "100%",
            border: "0",
            borderBottom: "2px solid",
            borderImageSource: "linear-gradient(90deg, rgba(54, 54, 54, 0) 0%, #7E7E7E 48.5%, rgba(54, 54, 54, 0) 100%)",
            borderImageSlice: 1,
          }}
        />
        <WeatherIcon code={src} alt="weather icon" />
        <Temperature temp={temp} temp_min={0} temp_max={0} showMinMax={false} />
      </Box>
    </Box>
  );
};

Weather.ForecastWrapper = function () {
  const { weather } = useContext(WeatherContext)!;
  const forecast = weather?.forecast.forecastday;
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "fa";

  return (
    <Paper
      elevation={4}
      sx={{
        overflowX: "hidden",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "24px 28px",
        bgcolor: theme.palette.surface.card,
        boxSizing: "border-box",
        borderRadius: "24px",
        direction: isRtl ? "rtl" : "ltr",
      }}
    >
      {/* Title on top */}
      <Typography variant="h6" sx={{ fontWeight: "600", color: theme.palette.text.primary, whiteSpace: "nowrap", mb: 2 }}>
        {t("forecastTitle")}
      </Typography>

      {/* Horizontal scroll row */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          overflowX: "auto",
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari, Edge
          },
        }}
      >
        {forecast &&
          forecast.map((day: any, index: number) => {
            const weekday = new Date(day.date).toLocaleDateString("en-US", {
              weekday: "long",
            });
            return (
              <Weather.ForecastItem
                key={index}
                day={weekday}
                src={day.day.condition.icon}
                temp={Math.round(day.hour[0].temp_c)}
              />
            );
          })}
      </Box>
    </Paper>
  );
};
