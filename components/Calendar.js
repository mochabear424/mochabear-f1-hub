"use client";
import { useEffect, useState } from "react";

const flag = (c = "") => {
  const m = { Bahrain:"🇧🇭","Saudi Arabia":"🇸🇦",Australia:"🇦🇺",Japan:"🇯🇵",China:"🇨🇳",USA:"🇺🇸","United States":"🇺🇸",Italy:"🇮🇹",Monaco:"🇲🇨",Spain:"🇪🇸",Canada:"🇨🇦",Austria:"🇦🇹",UK:"🇬🇧","United Kingdom":"🇬🇧",Hungary:"🇭🇺",Belgium:"🇧🇪",Netherlands:"🇳🇱",Azerbaijan:"🇦🇿",Singapore:"🇸🇬",Mexico:"🇲🇽",Brazil:"🇧🇷",Qatar:"🇶🇦",UAE:"🇦🇪","United Arab Emirates":"🇦🇪",France:"🇫🇷",Germany:"🇩🇪" };
  return m[c] || "🏁";
};

export default function Calendar({ full = false }) {
  const [races, setRaces] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    fetch("/api/schedule").then(r => r.json()).then(d => {
      if (d.error) setErr(d.error); else setRaces(d);
    }).catch(e => setErr(e.message));
  }, []);
  if (err) return <div className="err">Calendar unavailable: {err}</div>;
  if (!races) return <div className="loading">⏳ Loading calendar…</div>;
  const now = new Date();
  const nextRound = races.find(r => new Date(`${r.date}T${r.time || "12:00:00Z"}`) > now)?.round;

  const Card = ({ r }) => {
    const dt = new Date(`${r.date}T12:00:00Z`);
    const done = dt < now && r.round != nextRound;
    const nx = r.round == nextRound;
    return (
      <div style={{ minWidth: full ? "auto" : 130, background: "var(--bg)",
        border: `1px solid ${nx ? "var(--red)" : "var(--line)"}`, borderRadius: 12, padding: 13, flexShrink: 0,
        opacity: done ? .4 : 1, boxShadow: nx ? "0 0 0 1px rgba(225,6,0,.3)" : "none" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--accent)" }}>R{r.round}</div>
        <div style={{ fontSize: 22, margin: "6px 0 4px" }}>{flag(r.Circuit.Location.country)}</div>
        <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.2 }}>{r.raceName.replace(" Grand Prix", " GP")}</div>
        <div style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 11, color: "var(--mut)", marginTop: 4 }}>
          {dt.toLocaleDateString([], { month: "short", day: "numeric" })}
        </div>
      </div>
    );
  };

  if (full) return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12 }}>
      {races.map(r => <Card key={r.round} r={r} />)}
    </div>
  );
  return <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>{races.map(r => <Card key={r.round} r={r} />)}</div>;
}
