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
    <>
      <Nav title="Scheduled Functions & Cache Tags" />
      <main>
        <div className="page-header">
          <h1>Weather in San Francisco</h1>
          <p>Data updated daily via scheduled functions</p>
        </div>

        <section className="weather-card">
          <div className="grid grid-2">
            <div className="weather-stat">
              <div className="data-label">Temperature</div>
              <div className="data-value">
                {weather.temperature}&deg;{weather.unit}
              </div>
            </div>
            <div className="weather-stat">
              <div className="data-label">Wind Speed</div>
              <div className="data-value">{weather.windspeed} km/h</div>
            </div>
          </div>
          <div className="weather-meta">
            <p>
              Data fetched at: <time dateTime={weather.fetchedAt}>{weather.fetchedAt}</time>
            </p>
            <p>
              Page generated at: <time dateTime={generatedAt}>{generatedAt}</time>
            </p>
          </div>
        </section>

        <section>
          <h2>How It Works</h2>
          <p>
            This page demonstrates <strong>Scheduled Functions</strong> with{" "}
            <strong>Cache Tags</strong> and <strong>Blobs</strong> for daily updates.
          </p>
          <ol>
            <li>
              A{" "}
              <Link href="https://docs.netlify.com/functions/scheduled-functions/">
                Scheduled Function
              </Link>{" "}
              runs daily
            </li>
            <li>
              It fetches weather data and saves it to{" "}
              <Link href="https://docs.netlify.com/blobs/overview/">Netlify Blobs</Link>
            </li>
            <li>
              It purges the <code>weather-sf</code> cache tag via the{" "}
              <Link href="https://docs.netlify.com/platform/caching/#cache-tags">
                Cache API
              </Link>
            </li>
            <li>
              On next visit, the page regenerates with fresh data from Blobs
            </li>
            <li>
              The page is re-cached with <code>Netlify-CDN-Cache-Control</code> until
              the next purge
            </li>
          </ol>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  weather: WeatherSummary;
  generatedAt: string;
}> = async ({ res }) => {
  res.setHeader("Cache-Tag", "weather-sf");
  res.setHeader(
    "Netlify-CDN-Cache-Control",
    "public, s-maxage=31536000, must-revalidate"
  );

  const store = getStore("weather-store");
  let weather = (await store.get("sf", { type: "json" })) as WeatherSummary | null;

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
    } catch {
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
