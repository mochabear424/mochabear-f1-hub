"use client";
import { useEffect, useState } from "react";
import Countdown from "./Countdown";
import TimeToggle from "./TimeToggle";
import { useTime, formatSessionTime, formatSessionDay } from "@/context/TimeContext";
import { getCircuitTimezone } from "@/lib/circuits";

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

// race prop: when provided, component is driven externally (race-hub selector).
// When omitted, component self-fetches the current/next race (home page usage).
export default function RaceWeekend({ showCountdown = true, showWeather = true, race: raceProp = null }) {
  const [race, setRace] = useState(raceProp);
  const [err, setErr] = useState(null);
  const [weather, setWeather] = useState(null);
  const { mode } = useTime();

  // When raceProp changes (selector navigation), sync local state and reset weather
  useEffect(() => {
    if (raceProp) {
      setRace(raceProp);
      setWeather(null);
    }
  }, [raceProp]);

  // Self-fetch only when no raceProp (e.g. home page usage)
  useEffect(() => {
    if (raceProp) return;
    fetch("/api/schedule").then(r => r.json()).then(races => {
      if (races.error) { setErr(races.error); return; }
      const now = new Date();
      const next = races.find(r => new Date(`${r.date}T${r.time || "12:00:00Z"}`) > now) || races[races.length - 1];
      setRace(next);
    }).catch(e => setErr(e.message));
  }, [raceProp]);

  // Fetch weather whenever the race changes, but only for upcoming races
  useEffect(() => {
    if (!race || !showWeather) return;
    const raceDate = new Date(`${race.date}T${race.time || "14:00:00Z"}`);
    if (raceDate < new Date()) return; // skip weather for past races
    const { lat, long } = race.Circuit?.Location || {};
    if (!lat || !long) return;
    setWeather(null);
    fetch(`/api/weather?lat=${lat}&lon=${long}`).then(r => r.json()).then(setWeather).catch(() => {});
  }, [race, showWeather]);

  if (err) return <div className="err">Schedule unavailable: {err}</div>;
  if (!race) return <div className="loading">⏳ Fetching schedule…</div>;

  const circuitId = race.Circuit?.circuitId;
  const circuitTz = getCircuitTimezone(circuitId);
  const sessions = buildSessions(race);
  const raceISO = `${race.date}T${race.time || "14:00:00Z"}`;
  const wIcon = c => c <= 1 ? "☀️" : c <= 3 ? "🌤️" : c <= 48 ? "🌫️" : c <= 67 ? "🌧️" : c <= 77 ? "🌨️" : c <= 82 ? "🌦️" : "⛈️";

  // Label: "Session Schedule" for past rounds, "Race Weekend" for current/upcoming
  const raceDate = new Date(raceISO);
  const isPastRace = raceDate < new Date();

  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: showCountdown ? "1.4fr 1fr" : "1fr" }} className="rw-grid">
      <div className="card">
        <div className="ctitle">
          <span>{isPastRace ? "Session Schedule" : "Race Weekend"}</span>
          <TimeToggle circuitId={circuitId} />
        </div>
        <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 26, lineHeight: 1.05 }}>{race.raceName}</div>
        <div style={{ color: "var(--mut)", fontSize: 13, marginTop: 4, fontFamily: "Rajdhani", fontWeight: 600 }}>
          {race.Circuit.circuitName} · {race.Circuit.Location.locality}, {race.Circuit.Location.country}
        </div>
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 2 }}>
          {sessions.map((s, i) => {
            const sessionPast = s.dt < new Date();
            return (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "center",
                padding: "11px 12px", borderRadius: 9, fontSize: 14,
                background: s.isNext ? "rgba(225,6,0,.10)" : (i % 2 ? "rgba(255,255,255,.02)" : "transparent"),
                boxShadow: s.isNext ? "inset 0 0 0 1px rgba(225,6,0,.3)" : "none",
                opacity: sessionPast && !s.isNext ? 0.45 : 1
              }}>
                <span style={{ fontWeight: 600 }}>{s.isNext ? "● " : ""}{s.label}</span>
                <span className="mono" style={{ fontSize: 13 }}>
                  {formatSessionTime(s.dt, mode, circuitTz)}
                </span>
                <span style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 11, letterSpacing: ".1em", color: "var(--mut)", textTransform: "uppercase" }}>
                  {formatSessionDay(s.dt, mode, circuitTz)}
                </span>
              </div>
            );
          })}
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
