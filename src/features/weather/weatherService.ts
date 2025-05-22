import axios from "axios";
import type { WeatherData } from "./types";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const BASE_GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const BASE_TEMP_URL = "https://archive-api.open-meteo.com/v1/archive";

const WeatherService = {
  getCities: async (query: string, limit: number = 5) => {
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

  getDailyTemp: async (lat: number, lon: number) => {
    try {
      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);

      const startDate = oneYearAgo.toISOString().slice(0, 10); // "YYYY-MM-DD"
      const endDate = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

      const response = await axios.get(BASE_TEMP_URL, {
        params: {
          latitude: lat,
          longitude: lon,
          start_date: startDate,
          end_date: endDate,
          daily: "temperature_2m_mean", //
        },
      });

      console.log(response.data);
      WeatherService.calculateMonthlyAverage(response.data.daily.temperature_2m_mean, response.data.daily.time);
    } catch (error) {
      console.error("Error fetching daily temperature:", error);
    }
  },

  calculateMonthlyAverage: (temps: number[], days: string[]) => {
    const monthlyData: Record<string, number[]> = {}; // { "May": temp[], "Aug": temp[], ... }

    // Helper: get month name from date string
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    days.forEach((day, i) => {
      const monthIndex = new Date(day).getMonth(); // 0-based month index
      const monthName = monthNames[monthIndex];
      if (!monthlyData[monthName]) monthlyData[monthName] = [];
      monthlyData[monthName].push(temps[i]);
    });

    const monthlyAverages: Record<string, number> = {};
    for (const month in monthlyData) {
      const sum = monthlyData[month].reduce((acc, t) => acc + t, 0);
      const avg = sum / monthlyData[month].length;
      monthlyAverages[month] = parseFloat(avg.toFixed(1)); // round to 1 decimal place
    }

    console.log(monthlyAverages);
    return monthlyAverages; 
  },
};

export default WeatherService;
