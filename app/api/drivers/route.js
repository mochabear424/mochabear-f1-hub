import { jolpica, FRESH } from "@/lib/f1";
export const revalidate = 600;
export async function GET() {
  try {
    const d = await jolpica("driverstandings/?format=json", FRESH.standings);
    return Response.json(d.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || []);
  } catch (e) { return Response.json({ error: e.message }, { status: 502 }); }
}
