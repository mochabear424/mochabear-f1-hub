import { jolpica, FRESH } from "@/lib/f1";
export const revalidate = 600;
export async function GET() {
  try {
    const [stand, all] = await Promise.all([
      jolpica("driverstandings/?format=json", FRESH.standings),
      jolpica("results/?limit=500&format=json", FRESH.results)
    ]);
    const standings = stand.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
    const races = all.MRData.RaceTable.Races;
    const maxR = Math.max(...races.map(r => +r.round), 1);
    const recent = {};
    races.filter(r => +r.round >= maxR - 1).forEach(r =>
      r.Results.forEach(res => {
        const id = res.Driver.driverId;
        recent[id] = (recent[id] || 0) + (+res.points);
      })
    );
    const ranked = standings.map(s => {
      const id = s.Driver.driverId;
      const seasonAvg = (+s.points) / maxR;
      const recAvg = (recent[id] || 0) / 2;
      return {
        name: `${s.Driver.givenName} ${s.Driver.familyName}`,
        team: s.Constructors[0].name,
        rec: recent[id] || 0,
        recAvg,
        delta: recAvg - seasonAvg
      };
    }).sort((a, b) => b.recAvg - a.recAvg).slice(0, 10);
    return Response.json(ranked);
  } catch (e) { return Response.json({ error: e.message }, { status: 502 }); }
}
