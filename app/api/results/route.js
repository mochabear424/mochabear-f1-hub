import { jolpica, FRESH } from "@/lib/f1";
export const revalidate = 300;
export async function GET() {
  try {
    const d = await jolpica("last/results/?format=json", FRESH.results);
    return Response.json(d.MRData.RaceTable.Races[0] || null);
  } catch (e) { return Response.json({ error: e.message }, { status: 502 }); }
}
