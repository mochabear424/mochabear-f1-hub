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

// Map Open-Meteo weather code to an emoji
function wIcon(c) {
  if (c == null) return "—";
  if (c <= 1) return "☀️";
  if (c <= 3) return "🌤️";
  if (c <= 48) return "🌫️";
  if (c <= 67) return "🌧️";
  if (c <= 77) return "🌨️";
  if (c <= 82) return "🌦️";
  return "⛈️";
}

// From an Open-Meteo hourly dataset, find the entry closest to a target Date
function pickHour(hourly, target) {
  if (!hourly || !hourly.time?.length) return null;
  const targetMs = target.getTime();
  let best = null, bestDiff = Infinity;
  for (let i = 0; i < hourly.time.length; i++) {
    const diff = Math.abs(new Date(hourly.time[i]).getTime() - targetMs);
    if (diff < bestDiff) { bestDiff = diff; best = i; }
  }
  if (best === null) return null;
  return {
    temp: Math.round(hourly.temperature_2m[best]),
    code: hourly.weather_code[best],
    wind: Math.round(hourly.wind_speed_10m[best]),
    rain: hourly.precipitation_probability?.[best] ?? null,
  };
}

// Per-session weather row inside the expanded forecast card
function SessionWeather({ session, hourly }) {
  const info = pickHour(hourly, session.dt);
  const sessionPast = session.dt < new Date();
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 22px 48px 44px 36px",
      gap: 6, alignItems: "center",
      padding: "8px 0", borderBottom: "1px solid var(--line)",
      opacity: sessionPast ? 0.45 : 1,
    }}>
      <div>
        <span style={{ fontWeight: 600, fontSize: 13 }}>
          {session.isNext ? "● " : ""}{session.label}
        </span>
        <div style={{
          fontFamily: "Rajdhani", fontWeight: 600, fontSize: 10,
          letterSpacing: ".06em", color: "var(--mut)", textTransform: "uppercase", marginTop: 1
        }}>
          {session.dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </div>
      </div>
      {info ? (
        <>
          <span style={{ fontSize: 15, lineHeight: 1 }}>{wIcon(info.code)}</span>
          <span style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 13 }}>{info.temp}°F</span>
          <span style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 11, color: "var(--mut)" }}>
            {info.wind}mph
          </span>
          <span style={{
            fontFamily: "Rajdhani", fontWeight: 700, fontSize: 11,
            color: info.rain > 50 ? "#e8a02d" : "var(--mut)"
          }}>
            {info.rain != null ? `${info.rain}%` : "—"}
          </span>
        </>
      ) : (
        <span style={{ gridColumn: "2 / -1", fontFamily: "Rajdhani", fontSize: 11, color: "var(--mut)" }}>
          No forecast
        </span>
      )}
    </div>
  );
}

// race prop: when provided, component is driven externally (race-hub selector).
// When omitted, component self-fetches the current/next race (home page usage).
export default function RaceWeekend({ showCountdown = true, showWeather = true, race: raceProp = null }) {
  const [race, setRace] = useState(raceProp);
  const [err, setErr] = useState(null);
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState(null);
  const { mode } = useTime();

  // When raceProp changes (selector navigation), sync local state and reset weather
  useEffect(() => {
    if (raceProp) {
      setRace(raceProp);
      setWeather(null);
      setHourly(null);
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
    if (!race || 