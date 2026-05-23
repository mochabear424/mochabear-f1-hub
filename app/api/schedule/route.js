import { jolpica, FRESH } from "@/lib/f1";
export const revalidate = 3600;
export async function GET() {
  try {
    const d = await jolpica("races/?format=json", FRESH.schedule);
    return Response.json(d.MRData.RaceTable.Races);
  } catch (e) { return Response.json({ error: e.message }, { status: 502 }); }
}
