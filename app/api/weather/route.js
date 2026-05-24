// /api/weather
// ?lat=&lon=            → current conditions only (home page widget)
// ?lat=&lon=&hourly=1   → current + hourly forecast for next 7 days (race hub)
//
// Hourly response shape:
// { current: {...}, hourly: { time: [...], temperature_2m: [...], weather_code: [...],
//   wind_speed_10m: [...], precipitation_probability: [...], precipitation: [...] } }

export const revalidate = 900;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const wantHourly = searchParams.get("hourly") === "1";

    if (!lat || !lon) return Response.json({ error: "missing coords" }, { statu