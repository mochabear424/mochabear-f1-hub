"use client";
import { useEffect, useState } from "react";

const teamColor = (t = "") => {
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
};

export default function Results() {
  const [race, setRace] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    fetch("/api/results").then(r => r.json()).then(d => {
      if (d?.error) setErr(d.error); else setRace(d);
    }).catch(e => setErr(e.message));
  }, []);
  if (err) return <div className="err">Results unavailable: {err}</div>;
  if (!race) return <div className="loading">⏳ Loading latest result…</div>;
  if (!race.Results) return <div className="loading">No results yet for this round.</div>;

  return (
    <>
      <div style={{ fontFamily: "Rajdhani", fontWeight: 600, color: "var(--mut)", fontSize: 13, marginBottom: 12, letterSpacing: ".05em" }}>
        {race.raceName} · Round {race.round}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {race.Results.slice(0, 10).map((r, i) => {
          const team = r.Constructor.name;
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "4px 26px 1fr auto auto", gap: 12, alignItems: "center", padding: "9px 8px", borderRadius: 8 }}>
              <div style={{ width: 4, alignSelf: "stretch", borderRadius: 3, background: teamColor(team) }} />
              <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 14, color: i === 0 ? "var(--gold)" : "var(--mut)", textAlign: "center" }}>{r.position}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.Driver.givenName} {r.Driver.familyName}</div>
                <div style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 11, color: "var(--mut)", textTransform: "uppercase", letterSpacing: ".06em" }}>{team}</div>
              </div>
              <div className="mono" style={{ fontSize: 12, color: "var(--mut)" }}>{r.status === "Finished" ? r.Time?.time || "—" : r.status}</div>
              <div className="mono" style={{ fontWeight: 700, fontSize: 14 }}>+{r.points}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
