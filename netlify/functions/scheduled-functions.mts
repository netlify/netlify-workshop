import type { Config } from "@netlify/functions";
import { purgeCache } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

const SF_LAT = 37.7749;
const SF_LONG = -122.4194;
const WEATHER_API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${SF_LAT}&longitude=${SF_LONG}&current_weather=true&temperature_unit=fahrenheit`;

export default async (req: Request) => {
  console.log("Scheduled function starting...");

  try {
    // 1. Fetch Weather Data
    console.log("Fetching weather data...");
    const weatherRes = await fetch(WEATHER_API_URL);
    if (!weatherRes.ok) {
      throw new Error(`Failed to fetch weather: ${weatherRes.statusText}`);
    }
    const weatherData = await weatherRes.json();
    const weatherSummary = {
      temperature: weatherData.current_weather.temperature,
      windspeed: weatherData.current_weather.windspeed,
      unit: "F", // requested fahrenheit above
      fetchedAt: new Date().toISOString(),
      fullData: weatherData.current_weather
    };

    // 2. Update Blob Store
    console.log("Updating Blob store...");
    const store = getStore("weather-store");
    await store.setJSON("sf", weatherSummary);

    // 3. Purge Cache Tag
    console.log("Purging cache tag: weather-sf");
    await purgeCache({
      tags: ["weather-sf"],
    });

    console.log("Scheduled function complete.");
    return new Response("Weather updated and cache purged", { status: 200 });

  } catch (error) {
    console.error("Error in scheduled function:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const config: Config = {
  schedule: "@daily",
};
