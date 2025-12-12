import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getStore } from "@netlify/blobs";
import Nav from "~/components/Nav";
import Link from "next/link";

interface WeatherSummary {
  temperature: number;
  windspeed: number;
  unit: string;
  fetchedAt: string;
}

export default function ScheduledFunctions({
  weather,
  generatedAt,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <Nav title="Scheduled Functions & Cache Tags" />
      
      <h1>Weather in San Francisco</h1>
      
      <section style={{ marginBottom: "2rem", padding: "1.5rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h2>Current Conditions</h2>
        <p style={{ fontSize: "1.2rem" }}>
          <strong>Temperature:</strong> {weather.temperature}°{weather.unit}
        </p>
        <p style={{ fontSize: "1.2rem" }}>
          <strong>Wind Speed:</strong> {weather.windspeed} km/h
        </p>
        <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "1rem" }}>
          Data fetched by Scheduled Function at: <time dateTime={weather.fetchedAt}>{weather.fetchedAt}</time> (UTC)
        </p>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>
          Page generated (Cache Purged) at: <time dateTime={generatedAt}>{generatedAt}</time> (UTC)
        </p>
      </section>

      <section>
        <h2>How it works</h2>
        <p>
          This page demonstrates how to use <strong>Netlify Scheduled Functions</strong> combined with <strong>Cache Tags</strong> and <strong>Netlify Blobs</strong> to create a daily updated static page.
        </p>
        <ol style={{ lineHeight: "1.6", marginLeft: "1.5rem" }}>
          <li>
            A <Link href="https://docs.netlify.com/functions/scheduled-functions/">Scheduled Function</Link> runs daily.
          </li>
          <li>
            It fetches the latest weather data from an external API and saves it to <Link href="https://docs.netlify.com/blobs/overview/">Netlify Blobs</Link>.
          </li>
          <li>
            It then purges the cache tag <code>weather-sf</code> using the <Link href="https://docs.netlify.com/platform/caching/#cache-tags">Cache API</Link>.
          </li>
          <li>
            The next time you visit this page, Netlify sees the cache is invalid (purged) and regenerates the page using the latest data from the Blob store.
          </li>
          <li>
            The page is then cached again with <code>Netlify-CDN-Cache-Control</code> and the <code>weather-sf</code> tag, waiting for the next daily purge.
          </li>
        </ol>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<{
  weather: WeatherSummary;
  generatedAt: string;
}> = async ({ res }) => {
  // Set Cache Tag so this page can be purged by the scheduled function
  res.setHeader("Cache-Tag", "weather-sf");
  
  // Set a long cache duration, relying on the tag for invalidation
  // s-maxage=31536000 is 1 year.
  res.setHeader(
    "Netlify-CDN-Cache-Control",
    "public, s-maxage=31536000, must-revalidate"
  );

  // Try to get data from Blob store
  const store = getStore("weather-store");
  let weather = await store.get("sf", { type: "json" }) as WeatherSummary | null;

  // Fallback if Blob is empty (first run)
  if (!weather) {
    const SF_LAT = 37.7749;
    const SF_LONG = -122.4194;
    const WEATHER_API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${SF_LAT}&longitude=${SF_LONG}&current_weather=true&temperature_unit=fahrenheit`;
    
    try {
      const apiRes = await fetch(WEATHER_API_URL);
      const data = await apiRes.json();
      weather = {
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        unit: "F",
        fetchedAt: new Date().toISOString(),
      };
      // Optionally seed the blob store here too, but let's leave it to the scheduled function mostly.
    } catch {
      // Emergency fallback
      weather = {
        temperature: 0,
        windspeed: 0,
        unit: "F",
        fetchedAt: new Date().toISOString(),
      };
    }
  }

  return {
    props: {
      weather,
      generatedAt: new Date().toISOString(),
    },
  };
};
