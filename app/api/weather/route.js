export const revalidate = 900;
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat"), lon = searchParams.get("lon");
    if (!lat || !lon) return Response.json({ error: "missing coords" }, { status: 400 });
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code,wind_speed_10m&temperature_unit=fahrenheit`;
    const r = await fetch(url, { next: { revalidate: 900 } });
    if (!r.ok) throw new Error("weather " + r.status);
    return Response.json((await r.json()).current);
  } catch (e) { return Response.json({ error: e.message }, { status: 502 }); }
}
