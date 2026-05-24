// /api/form — last-5-races finishing positions per driver & constructor.
// Used by the Standings sparklines to show recent form.
// Returns:
//   drivers:      { driverId: [pos, pos, ...] }   (1–20; 20 = DNF/DSQ)
//   constructors: { constructorId: [pos, pos, ...] } (best-of-two per round)

import { jolpica, FRESH } from "@/lib/f1";
export const revalidate = 300;

export async function GET() {
  try {
    // 1. Get the full schedule to identify completed rounds
    const sched = await jolpica("races/?format=json", FRESH.schedule);
    const races = sched.MRData.RaceTable.Races;
    const now = new Date();
    const completedRounds = races
      .filter(r => new Date(`${r.date}T${r.time || "14:00:00Z"}`) < now)
      .map(r => Number(r.round));

    if (!completedRounds.length) {
      return Response.json({ drivers: {}, constructors: {} });
    }

    // 2. Take the last 5 completed rounds
    const last5 = completedRounds.slice(-5);

    // 3. Fetch results for all rounds in parallel
    const roundResults = await Promise.all(
      last5.map(round =>
        jolpica(`${round}/results/?format=json`, FRESH.results)
          .then(d => d.MRData.RaceTable.Races[0]?.Results || [])
          .catch(() => [])
      )
    );

    // 4. Aggregate per-driver and per-constructor positions (chronological order)
    const drivers = {};
    const constructors = {};

    for (const results of roundResults) {
      // Track per-round constructor best position
      const consBest = {};

      for (const r of results) {
        const dId = r.Driver.driverId;
        const cId = r.Constructor.constructorId;
        // positionText can be "R" (retired), "D" (disqualified), etc.
        const pos = parseInt(r.position);
        const dPos = isNaN(pos) ? 20 : Math.min(pos, 20);

        if (!drivers[dId]) drivers[dId] = [];
        drivers[dId].push(dPos);

        // Constructor: keep best (lowest) position per round
        if (consBest[cId] === undefined || dPos < consBest[cId]) {
          consBest[cId] = dPos;
        }
      }

      for (const [cId, best] of Object.entries(consBest)) {
        if (!constructors[cId]) constructors[cId] = [];
        constructors[cId].push(best);
      }
    }

    return Response.json({ drivers, constructors });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}
