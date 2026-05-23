"use client";
import { useEffect, useState } from "react";
import Countdown from "./Countdown";

function buildSessions(race, now = new Date()) {
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
    const isNext = dt > now && firstFuture;
    if (isNext) firstFuture = false;
    return { label, dt, isNext };
  }).filter(Boolean);
}

export default function RaceWeekend({ showCountdown = true, showWeather = true }) {
  const [race, setRace] = useState(null);
  const [err, setErr] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch("/api/schedule").then(r => r.json()).then(races => {
      if (races.error) { setErr(races.error); return; }
      const now = new Date();
      const next = races.find(r => new Date(`${r.date}T${r.time || "12:00:00Z"}`) > now) || races[races.length - 1];
      setRace(next);
      if (showWeather && next?.Circuit?.Location) {
        const { lat, long } = next.Circuit.Location;
        fetch(`/api/weather?lat=${lat}&lon=${long}`).then(r => r.json()).then(setWeather).catch(() => {});
      }
    }).catch(e => setErr(e.message));
  }, [showWeather]);

  if (err) return <div className="err">Schedule unavailable: {err}</div>;
  if (!race) return <div className="loading">⏳ Fetching schedule…</div>;

  const sessions = buildSessions(race);
  const raceISO = `${race.date}T${race.time || "14:00:00Z"}`;
  const wIcon = c => c <= 1 ? "☀️" : c <= 3 ? "🌤️" : c <= 48 ? "🌫️" : c <= 67 ? "🌧️" : c <= 77 ? "🌨️" : c <= 82 ? "🌦️" : "⛈️";

  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: showCountdown ? "1.4fr 1fr" : "1fr" }} className="rw-grid">
      <div className="card">
        <div className="ctitle"><span>Current Race Weekend</span></div>
        <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 26, lineHeight: 1.05 }}>{race.raceName}</div>
        <div style={{ color: "var(--mut)", fontSize: 13, marginTop: 4, fontFamily: "Rajdhani", fontWeight: 600 }}>
          {race.Circuit.circuitName} · {race.Circuit.Location.locality}, {race.Circuit.Location.country}
        </div>
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 2 }}>
          {sessions.map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "center",
              padding: "11px 12px", borderRadius: 9, fontSize: 14,
              background: s.isNext ? "rgba(225,6,0,.10)" : (i % 2 ? "rgba(255,255,255,.02)" : "transparent"),
              boxShadow: s.isNext ? "inset 0 0 0 1px rgba(225,6,0,.3)" : "none" }}>
              <span style={{ fontWeight: 600 }}>{s.isNext ? "● " : ""}{s.label}</span>
              <span className="mono" style={{ fontSize: 13 }}>{s.dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              <span style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 11, letterSpacing: ".1em", color: "var(--mut)", textTransform: "uppercase" }}>
                {s.dt.toLocaleDateString([], { weekday: "short" })}
              </span>
            </div>
          ))}
        </div>
      </div>
      {showCountdown && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card"><div className="ctitle"><span>⏱️ Lights Out In</span></div><Countdown target={raceISO} /></div>
          {showWeather && (
            <div className="card">
              <div className="ctitle"><span>🌤️ Circuit Weather</span></div>
              {!weather ? <div className="loading">Loading…</div> : weather.error ? <div className="err">Unavailable</div> :
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 40 }}>{wIcon(weather.weather_code)}</div>
                  <div>
                    <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 30 }}>{Math.round(weather.temperature_2m)}°F</div>
                    <div style={{ fontFamily: "Rajdhani", fontWeight: 600, color: "var(--mut)", fontSize: 12 }}>
                      Wind {Math.round(weather.wind_speed_10m)} mph · Precip {weather.precipitation} mm
                    </div>
                  </div>
                </div>}
            </div>
          )}
        </div>
      )}
      <style>{`@media(max-width:880px){.rw-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
