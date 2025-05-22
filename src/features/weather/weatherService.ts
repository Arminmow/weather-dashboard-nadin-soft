import axios from "axios";
import type { WeatherData } from "./types";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const BASE_SEARCH_URL = "https://api.weatherapi.com/v1/search.json";
const BASE_WEATHER_URL = "https://api.weatherapi.com/v1/forecast.json";
const BASE_TEMP_URL = "https://archive-api.open-meteo.com/v1/archive";

const WeatherService = {
  getCities: async (query: string) => {
    try {
      const response = await axios.get(BASE_SEARCH_URL, {
        params: { q: query, key: API_KEY },
      });
      console.log(response.data);

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
          key: API_KEY,
          q: `${lat},${lon}`,
          days: 14,
          hour: 0
        },
      });

      const data = response.data;
      const now = new Date();
      console.log(data);
      
      //This could be a function itself , but its fine for now
      const weatherInfo: WeatherData = {
        date: now.toLocaleDateString(),
        day: now.toLocaleDateString("en-US", { weekday: "long" }),
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        city: data.location.name,
        temp: data.current.temp_c,
        temp_min: data.forecast.forecastday[0].day.mintemp_c,
        temp_max: data.forecast.forecastday[0].day.maxtemp_c,
        feels_like: data.current.feelslike_c,
        description: data.current.condition.text,
        icon: data.current.condition.icon,
      };
      console.log(weatherInfo.icon);

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

      return WeatherService.calculateMonthlyAverage(response.data.daily.temperature_2m_mean, response.data.daily.time);
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
