import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Autocomplete, Box, Paper, TextField, Typography, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { useTranslation } from "react-i18next";
import { interBase, size16, size32 } from "./styles";
import WeatherService from "./weatherService";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { City } from "../dashboard/types";
import type { WeatherData } from "./types";

interface DashboardContextType {
  weather: WeatherData | null;
  setWeather: React.Dispatch<React.SetStateAction<WeatherData | null>>;
  tempAvg: Record<string, number>;
  setTempAvg: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const WeatherContext = createContext<DashboardContextType | null>(null);

export const Weather = ({ children }: { children: React.ReactNode }) => {
  const DEFAULT_COORDS = { lat: 35.6892, lon: 51.389 };
  const [weather, setWeather] = useState<WeatherData | null>(() => {
    const saved = localStorage.getItem("weather");
    return saved ? JSON.parse(saved) : null;
  });

  const [tempAvg, setTempAvg] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("tempAvg");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    if (!weather) {
      WeatherService.getWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon).then((data) => {
        setWeather(data);
        localStorage.setItem("weather", JSON.stringify(data));
      });
    }
    if (!tempAvg || Object.keys(tempAvg).length === 0) {
      WeatherService.getDailyTemp(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon).then((data) => {
        setTempAvg(data ?? {});
        localStorage.setItem("tempAvg", JSON.stringify(data ?? {}));
      });
    }
  }, []);

  useEffect(() => {
    if (weather) localStorage.setItem("weather", JSON.stringify(weather));
  }, [weather]);

  useEffect(() => {
    if (tempAvg && Object.keys(tempAvg).length > 0) localStorage.setItem("tempAvg", JSON.stringify(tempAvg));
  }, [tempAvg]);

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
    });
    WeatherService.getDailyTemp(newValue.lat, newValue.lon).then((data) => {
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
      noOptionsText={inputValue.length < 2 ? t("search.shortInput") : t("search.notFound")}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("locationSearch")}
          variant="outlined"
          size="small"
          InputProps={{
            ...params.InputProps,
            sx: {
              padding: { xs: "6px 8px", sm: "10px 14px" },
            },
          }}
        />
      )}
      sx={{
        minWidth: { xs: 250, sm: 300 },
        maxWidth: "100%",
        flexGrow: 1,
        flexShrink: 1,
        width: "100%",
      }}
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
          fontFamily: "'Google Sans', sans-serif",
          fontWeight: 400,
          fontSize: "16px"
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
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            fontWeight: 500,
            fontSize: "0.875rem",
            color: theme.palette.text.secondary,
            fontFamily: "'Google Sans', sans-serif",
            letterSpacing: "0.03em",
          }}
        >
          <Box>{`${t("temp.max")}: ${Math.round(temp_max)}`}</Box>
          <Box>{`${t("temp.min")}: ${Math.round(temp_min)}`}</Box>
        </Box>
      )}
    </Box>
  );
}

function WeatherIcon({ code, alt }: { code: string; alt: string }) {
  return (
    //OpenWeatherMap weather icon api. Not gonna download and store your Figma provided weather icons in /public, sorry
    <Box component="img" src={code} alt={alt} />
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
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          ...interBase,
          ...size32,
          fontWeight: 400,
          textAlign: "center",
          whiteSpace: "normal",
          wordBreak: "break-word",
          lineHeight: 1.4,
          maxWidth: "100%",
          hyphens: "auto",
          fontFamily: "'Google Sans', sans-serif",
        }}
      >
        {t(`weather.${desc}`)}
      </Typography>

      <Typography
        component="div"
        sx={{
          ...interBase,
          ...size16,
          fontWeight: 400,
          textAlign: "center",
          opacity: 0.85,
        }}
      >
        <Box
          sx={{
            direction: isRtl ? "rtl" : "ltr",
            display: "inline-flex",
            gap: 0.5,
            alignItems: "center",
          }}
        >
          {isRtl ? (
            <>
              <span>{Math.round(feels_like)}°C</span>
              <span>{t("temp.feelsLike")}</span>
            </>
          ) : (
            <>
              <span>{t("temp.feelsLike")}</span>
              <span>{Math.round(feels_like)}°C</span>
            </>
          )}
        </Box>
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasData = Object.keys(tempAvg).length > 0;
    if (hasData) {
      setLoading(false);
    }
  }, [tempAvg]);

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
            loading={loading}
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
        gap: 3,
        borderRadius: 4,
        padding: "22px 16px",
        bgcolor: theme.palette.surface.item,
        alignItems: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
      }}
    >
      {/* Header & Day */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          {t(`weekDay.${day}`)}
        </Typography>

        {/* Divider */}
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
      </Box>

      {/* Weather Icon */}
      <WeatherIcon code={src} alt="weather icon" />

      {/* Temp */}
      <Typography
        sx={{
          fontFamily: "'Google Sans', sans-serif",
          fontWeight: 500,
          fontSize: "18px",
          lineHeight: "100%",
          letterSpacing: "0%",
          color: theme.palette.text.primary,
        }}
      >
        {`${temp}°C`}
      </Typography>
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
      <Typography
        variant="h6"
        sx={{
          fontFamily: "'Google Sans', sans-serif",
          fontWeight: 600,
          fontSize: "24px",
          lineHeight: "100%",
          letterSpacing: "0%",
          color: theme.palette.text.primary,
          whiteSpace: "nowrap",
          mb: 2,
        }}
      >
        {t("forecastTitle")}
      </Typography>

      {/* Horizontal scroll row */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {forecast &&
          forecast.map((day: any, index: number) => {
            const today = new Date();
            const dayDate = new Date(day.date + "T00:00:00");

            const isToday =
              today.getFullYear() === dayDate.getFullYear() &&
              today.getMonth() === dayDate.getMonth() &&
              today.getDate() === dayDate.getDate();

            const weekday = isToday ? "Today" : dayDate.toLocaleDateString("en-US", { weekday: "long" });

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
