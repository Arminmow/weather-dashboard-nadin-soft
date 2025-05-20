import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const BASE_GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

const ApiService = {
  getCities: async (query: string, limit: number = 5) => {
    console.log(API_KEY);
    
    try {
      const response = await axios.get(BASE_GEO_URL, {
        params: { q: query, limit, appid: API_KEY },
      });
      return response.data;
    } catch (error) {
      console.error("💥 Error fetching cities:", error);
      return [];
    }
  },
};

export default ApiService;
