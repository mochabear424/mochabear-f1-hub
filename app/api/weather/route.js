// /api/weather
// ?lat=&lon=            -> current conditions only (home page widget)
// ?lat=&lon=&hourly=1   -> current + hourly forecast for next 7 days (race hub)

export const revalidate = 900;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const wantHourly = searchParams.get("hourly") === "1";

    if (!lat || !lon) return Response.json({ error: "missing coords" }, { status: 400 });

    const hourlyFields = "temperature_2m,weather_code,wind_speed_10m,precipitation_probability,precipitation";
    const url = [
      "https://api.open-meteo.com/v1/forecast",
      `?latitude=${lat}&longitude=${lon}`,
      "&current=temperature_2m,precipitation,weather_code,wind_speed_10m",
      wantHourly ? `&hourly=${hourlyFields}&forecast_days=7&timezone=auto` : "",
      "&temperature_unit=fahrenheit&wind_speed_unit=mph",
    ].join("");

    const r = await fetch(url, { next: { revalidate: 900 } });
    if (!r.ok) throw new Error("weather " + r.status);
    const data = await r.json();

    if (wantHourly) {
      return Response.json({ current: data.current, hourly: data.hourly });
    }
    return Response.json(data.current);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}
