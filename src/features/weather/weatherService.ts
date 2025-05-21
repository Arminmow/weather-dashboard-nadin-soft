import axios from "axios";
import type { WeatherData } from "./types";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const BASE_GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

const WeatherService = {
  getCities: async (query: string, limit: number = 5) => {
    console.log(API_KEY);

    try {
      const response = await axios.get(BASE_GEO_URL, {
        params: { q: query, limit, appid: API_KEY },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  },

  getWeather: async (lat: number, lon: number) => {
    try {
      const response = await axios.get(BASE_WEATHER_URL, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: "metric",
        },
      });

      const data = response.data;
      const now = new Date();

      //This could be a function itself , but its fine for now
      const weatherInfo: WeatherData = {
        date: now.toLocaleDateString(),
        day: now.toLocaleDateString("en-US", { weekday: "long" }),
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        city: data.name,
        temp: Math.round(data.main.temp),
        temp_min: Math.round(data.main.temp_min),
        temp_max: Math.round(data.main.temp_max),
        feels_like: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      };

      return weatherInfo;
    } catch (error) {
      console.error("Weather fetch failed:", error);
      throw error;
    }
  },
};

export default WeatherService;
