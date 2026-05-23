// Shared F1 data layer. Every API route fetches Jolpica through these helpers.
// Next.js caches fetch() responses server-side; `revalidate` sets the freshness
// window (in seconds). Friends hit Vercel's cache, not Jolpica directly.

export const API = "https://api.jolpi.ca/ergast/f1";
const SEASON = new Date().getFullYear();

// revalidate windows: short during action, long when nothing changes
export const FRESH = {
  schedule: 3600,      // calendar barely changes — 1 hour
  standings: 600,      // 10 min between race weekends is plenty
  results: 300,        // 5 min — bump down manually during a live race
  weather: 900,        // 15 min
};

export async function jolpica(path, revalidate) {
  const url = `${API}/${SEASON}/${path}`;
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`Jolpica ${res.status} on ${path}`);
  return res.json();
}

// ---- team identity ----
export function teamColor(t = "") {
  t = t.toLowerCase();
  if (t.includes("mercedes")) return "#27F4D2";
  if (t.includes("ferrari")) return "#E8002D";
  if (t.includes("mclaren")) return "#FF8000";
  if (t.includes("red bull")) return "#3671C6";
  if (t.includes("williams")) return "#64C4FF";
  if (t.includes("alpine")) return "#0093CC";
  if (t.includes("aston")) return "#229971";
  if (t.includes("haas")) return "#B6BABD";
  if (t.includes("sauber") || t.includes("audi")) return "#52E252";
  if (t.includes("rb") || t.includes("racing bulls")) return "#6692FF";
  return "#7C8A99";
}

export function flag(c = "") {
  const m = {
    Bahrain:"🇧🇭","Saudi Arabia":"🇸🇦",Australia:"🇦🇺",Japan:"🇯🇵",China:"🇨🇳",
    USA:"🇺🇸","United States":"🇺🇸",Italy:"🇮🇹",Monaco:"🇲🇨",Spain:"🇪🇸",Canada:"🇨🇦",
    Austria:"🇦🇹",UK:"🇬🇧","United Kingdom":"🇬🇧",Hungary:"🇭🇺",Belgium:"🇧🇪",
    Netherlands:"🇳🇱",Azerbaijan:"🇦🇿",Singapore:"🇸🇬",Mexico:"🇲🇽",Brazil:"🇧🇷",
    Qatar:"🇶🇦",UAE:"🇦🇪","United Arab Emirates":"🇦🇪",France:"🇫🇷",Germany:"🇩🇪"
  };
  return m[c] || "🏁";
}

// ---- session schedule helper (shared by Home + Race Hub) ----
export function buildSessions(race, now = new Date()) {
  const order = [
    ["Practice 1", "FirstPractice"], ["Practice 2", "SecondPractice"],
    ["Practice 3", "ThirdPractice"], ["Sprint Qualifying", "SprintQualifying"],
    ["Sprint", "Sprint"], ["Qualifying", "Qualifying"], ["Race", null]
  ];
  let firstFuture = true;
  return order.map(([label, key]) => {
    let iso;
    if (key === null) iso = `${race.date}T${race.time || "14:00:00Z"}`;
    else if (race[key]) iso = `${race[key].date}T${race[key].time || "12:00:00Z"}`;
    else return null;
    const dt = new Date(iso);
    const future = dt > now;
    const isNext = future && firstFuture;
    if (isNext) firstFuture = false;
    return { label, iso, isNext };
  }).filter(Boolean);
}

export function findNextRace(races, now = new Date()) {
  return races.find(r => new Date(`${r.date}T${r.time || "12:00:00Z"}`) > now)
    || races[races.length - 1];
}
