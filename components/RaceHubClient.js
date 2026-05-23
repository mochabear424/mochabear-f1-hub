"use client";
import { useEffect, useState } from "react";
import RaceWeekend from "./RaceWeekend";
import CircuitInfo from "./CircuitInfo";
import Results from "./Results";

const flag = (c = "") => {
  const m = {
    Bahrain:"🇧🇭","Saudi Arabia":"🇸🇦",Australia:"🇦🇺",Japan:"🇯🇵",China:"🇨🇳",
    USA:"🇺🇸","United States":"🇺🇸",Italy:"🇮🇹",Monaco:"🇲🇨",Spain:"🇪🇸",Canada:"🇨🇦",
    Austria:"🇦🇹",UK:"🇬🇧","United Kingdom":"🇬🇧",Hungary:"🇭🇺",Belgium:"🇧🇪",
    Netherlands:"🇳🇱",Azerbaijan:"🇦🇿",Singapore:"🇸🇬",Mexico:"🇲🇽",Brazil:"🇧🇷",
    Qatar:"🇶🇦",UAE:"🇦🇪","United Arab Emirates":"🇦🇪"
  };
  return m[c] || "🏁";
};

export default function RaceHubClient() {
  const [races, setRaces] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetch("/api/schedule")
      .then(r => r.json())
      .then(data => {
        if (data.error) { setErr(data.error); return; }
        setRaces(data);
        // Default to current/next round
        const now = new Date();
        const next = data.find(r => new Date(`${r.date}T${r.time || "12:00:00Z"}`) > now)
          || data[data.length - 1];
        setSelectedRound(next.round);
      })
      .catch(e => setErr(e.message));
  }, []);

  if (err) return <div className="err">Schedule unavailable: {err}</div>;
  if (!races || selectedRound === null) return <div className="loading">⏳ Loading Race Hub…</div>;

  const selectedRace = races.find(r => r.round === selectedRound) || races[0];
  const now = new Date();
  const raceDate = new Date(`${selectedRace.date}T${selectedRace.time || "14:00:00Z"}`);
  const isUpcoming = raceDate > now;
  const isPast = raceDate < now;
  const isSprint = !!(selectedRace.Sprint || selectedRace.SprintQualifying);

  // Which round is "current" (the auto-selected one)
  const currentRound = (races.find(r => new Date(`${r.date}T${r.time || "12:00:00Z"}`) > now) || races[races.length - 1]).round;

  const handlePrev = () => {
    const idx = races.findIndex(r => r.round === selectedRound);
    if (idx > 0) setSelectedRound(races[idx - 1].round);
  };
  const handleNext = () => {
    const idx = races.findIndex(r => r.round === selectedRound);
    if (idx < races.length - 1) setSelectedRound(races[idx + 1].round);
  };

  const idx = races.findIndex(r => r.round === selectedRound);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Round Selector */}
      <div style={{
        background: "var(--panel)", border: "1px solid var(--line)",
        borderRadius: 14, padding: "14px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12
      }}>
        {/* Left: round identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 28, lineHeight: 1 }}>{flag(selectedRace.Circuit.Location.country)}</div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--red)" }}>
                R{selectedRound} of {races.length}
              </span>
              {isSprint && (
                <span style={{
                  fontFamily: "Rajdhani", fontWeight: 700, fontSize: 10, letterSpacing: ".1em",
                  color: "var(--gold)", background: "rgba(244,196,48,.12)",
                  padding: "2px 7px", borderRadius: 4, textTransform: "uppercase"
                }}>⚡ Sprint</span>
              )}
              {selectedRound === currentRound && (
                <span style={{
                  fontFamily: "Rajdhani", fontWeight: 700, fontSize: 10, letterSpacing: ".1em",
                  color: "var(--grn)", background: "rgba(63,185,80,.12)",
                  padding: "2px 7px", borderRadius: 4, textTransform: "uppercase"
                }}>Current</span>
              )}
              {isPast && selectedRound !== currentRound && (
                <span style={{
                  fontFamily: "Rajdhani", fontWeight: 700, fontSize: 10, letterSpacing: ".1em",
                  color: "var(--mut)", background: "rgba(124,138,153,.1)",
                  padding: "2px 7px", borderRadius: 4, textTransform: "uppercase"
                }}>Completed</span>
              )}
            </div>
            <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 18, lineHeight: 1.1, marginTop: 2 }}>
              {selectedRace.raceName}
            </div>
          </div>
        </div>

        {/* Right: dropdown + prev/next */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Prev button */}
          <button
            onClick={handlePrev}
            disabled={idx === 0}
            style={{
              background: "var(--bg)", border: "1px solid var(--line)", color: idx === 0 ? "var(--line)" : "var(--mut)",
              width: 32, height: 32, borderRadius: 8, cursor: idx === 0 ? "default" : "pointer",
              display: "grid", placeItems: "center", fontSize: 16, fontFamily: "inherit"
            }}
          >‹</button>

          {/* Dropdown */}
          <div style={{ position: "relative" }}>
            <select
              value={selectedRound}
              onChange={e => setSelectedRound(Number(e.target.value))}
              style={{
                appearance: "none", WebkitAppearance: "none",
                background: "var(--bg)", color: "var(--txt)",
                border: "1px solid var(--line)", borderRadius: 9,
                padding: "8px 36px 8px 14px",
                fontFamily: "Rajdhani", fontWeight: 700, fontSize: 13, letterSpacing: ".06em",
                cursor: "pointer", minWidth: 220, outline: "none"
              }}
            >
              {races.map(r => {
                const rDate = new Date(`${r.date}T${r.time || "12:00:00Z"}`);
                const done = rDate < now && r.round !== currentRound;
                const sprint = !!(r.Sprint || r.SprintQualifying);
                const country = r.Circuit.Location.country;
                return (
                  <option key={r.round} value={r.round}>
                    {done ? "✓ " : r.round === currentRound ? "▶ " : "  "}
                    R{r.round} — {country}{sprint ? " ⚡" : ""}
                  </option>
                );
              })}
            </select>
            {/* Custom chevron */}
            <span style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              pointerEvents: "none", color: "var(--mut)", fontSize: 12
            }}>▾</span>
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={idx === races.length - 1}
            style={{
              background: "var(--bg)", border: "1px solid var(--line)",
              color: idx === races.length - 1 ? "var(--line)" : "var(--mut)",
              width: 32, height: 32, borderRadius: 8,
              cursor: idx === races.length - 1 ? "default" : "pointer",
              display: "grid", placeItems: "center", fontSize: 16, fontFamily: "inherit"
            }}
          >›</button>
        </div>
      </div>

      {/* Race content — driven by selected race */}
      <RaceWeekend race={selectedRace} showCountdown={isUpcoming} showWeather={isUpcoming} />
      <CircuitInfo race={selectedRace} />

      {/* Results always shows latest */}
      <div className="card">
        <div className="ctitle"><span>Latest Race Result</span></div>
        <Results />
      </div>
    </div>
  );
}
