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

function wIcon(c) {
  if (c == null) return "—";
  if (c <= 1) return "\u2600\ufe0f";
  if (c <= 3) return "🌤️";
  if (c <= 48) return "\U0001f32b\ufe0f";
  if (c <= 67) return "\U0001f327\ufe0f";
  if (c <= 77) return "\U0001f328\ufe0f";
  if (c <= 82) return "\U0001f326\ufe0f";
  return "\u26c8\ufe0f";
}

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

export default function RaceWeekend({ showCountdown = true, showWeather = true, race: raceProp = null }) {
  const [race, setRace] = useState(raceProp);
  const [err, setErr] = useState(null);
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState(null);
  const { mode } = useTime();

  useEffect(() => {
    if (raceProp) {
      setRace(raceProp);
      setWeather(null);
      setHourly(null);
    }
  }, [raceProp]);

  useEffect(() => {
    if (raceProp) return;
    fetch("/api/schedule").then(r => r.json()).then(races => {
      if (races.error) { setErr(races.error); return; }
      const now = new Date();
      const next = races.find(r => new Date(`${r.date}T${r.time || "12:00:00Z"}`) > now) || races[races.length - 1];
      setRace(next);
    }).catch(e => setErr(e.message));
  }, [raceProp]);

  useEffect(() => {
    if (!race || !showWeather) return;
    const raceDate = new Date(`${race.date}T${race.time || "14:00:00Z"}`);
    if (raceDate < new Date()) return;
    const { lat, long } = race.Circuit?.Location || {};
    if (!lat || !long) return;
    setWeather(null);
    setHourly(null);
    const wantHourly = showCountdown;
    fetch(`/api/weather?lat=${lat}&lon=${long}${wantHourly ? "&hourly=1" : ""}`)
      .then(r => r.json())
      .then(d => {
        if (wantHourly) {
          setWeather(d.current || null);
          setHourly(d.hourly || null);
        } else {
          setWeather(d);
        }
      })
      .catch(() => {});
  }, [race, showWeather, showCountdown]);

  if (err) return <div className="err">Schedule unavailable: {err}</div>;
  if (!race) return <div className="loading">\u23f3 Fetching schedule\u2026</div>;

  const circuitId = race.Circuit?.circuitId;
  const circuitTz = getCircuitTimezone(circuitId);
  const sessions = buildSessions(race);
  const raceISO = `${race.date}T${race.time || "14:00:00Z"}`;
  const raceDate = new Date(raceISO);
  const isPastRace = raceDate < new Date();

  return (
    <div
      style={{ display: "grid", gap: 16, gridTemplateColumns: showCountdown ? "1.4fr 1fr" : "1fr" }}
      className="rw-grid"
    >
      {/* Session schedule card */}
      <div className="card">
        <div className="ctitle">
          <span>{isPastRace ? "Session Schedule" : "Race Weekend"}</span>
          <TimeToggle circuitId={circuitId} />
        </div>
        <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 26, lineHeight: 1.05 }}>
          {race.raceName}
        </div>
        <div style={{ color: "var(--mut)", fontSize: 13, marginTop: 4, fontFamily: "Rajdhani", fontWeight: 600 }}>
          {race.Circuit.circuitName} · {race.Circuit.Location.locality}, {race.Circuit.Location.country}
        </div>
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 2 }}>
          {sessions.map((s, i) => {
            const sessionPast = s.dt < new Date();
            return (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12,
                alignItems: "center", padding: "11px 12px", borderRadius: 9, fontSize: 14,
                background: s.isNext ? "rgba(225,6,0,.10)" : (i % 2 ? "rgba(255,255,255,.02)" : "transparent"),
                boxShadow: s.isNext ? "inset 0 0 0 1px rgba(225,6,0,.3)" : "none",
                opacity: sessionPast && !s.isNext ? 0.45 : 1
              }}>
                <span style={{ fontWeight: 600 }}>{s.isNext ? "● " : ""}{s.label}</span>
                <span className="mono" style={{ fontSize: 13 }}>
                  {formatSessionTime(s.dt, mode, circuitTz)}
                </span>
                <span style={{
                  fontFamily: "Rajdhani", fontWeight: 600, fontSize: 11,
                  letterSpacing: ".1em", color: "var(--mut)", textTransform: "uppercase"
                }}>
                  {formatSessionDay(s.dt, mode, circuitTz)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right column: countdown + weather (Race Hub) */}
      {showCountdown && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="ctitle"><span>\u23f1\ufe0f Lights Out In</span></div>
            <Countdown target={raceISO} />
          </div>

          {showWeather && !isPastRace && (
            <div className="card">
              <div className="ctitle"><span>🌤️ Weekend Forecast</span></div>
              {!weather && !hourly ? (
                <div className="loading">Loading…</div>
              ) : (
                <>
                  {weather && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 14,
                      marginBottom: 14, paddingBottom: 12,
                      borderBottom: "1px solid var(--line)"
                    }}>
                      <div style={{ fontSize: 34 }}>{wIcon(weather.weather_code)}</div>
                      <div>
                        <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 24 }}>
                          {Math.round(weather.temperature_2m)}\u00b0F
                        </div>
                        <div style={{ fontFamily: "Rajdhani", fontWeight: 600, color: "var(--mut)", fontSize: 11 }}>
                          Now · {Math.round(weather.wind_speed_10m)} mph wind \u00b7 {weather.precipitation} mm precip
                        </div>
                      </div>
                    </div>
                  )}

                  {hourly && (
                    <>
                      <div style={{
                        display: "grid", gridTemplateColumns: "1fr 22px 48px 44px 36px",
                        gap: 6, padding: "0 0 6px",
                        fontFamily: "Rajdhani", fontWeight: 700, fontSize: 9,
                        letterSpacing: ".14em", color: "var(--mut)", textTransform: "uppercase"
                      }}>
                        <span>Session</span><span></span>
                        <span>Temp</span><span>Wind</span><span>Rain</span>
                      </div>
                      {sessions.map((s, i) => (
                        <SessionWeather key={i} session={s} hourly={hourly} />
                      ))}
                      <div style={{
                        marginTop: 8, fontFamily: "Rajdhani", fontWeight: 600,
                        fontSize: 9, letterSpacing: ".1em", color: "var(--mut)", textTransform: "uppercase"
                      }}>
                        Open-Meteo · 7-day hourly forecast
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Home page compact weather (showCountdown=false) */}
      {!showCountdown && showWeather && !isPastRace && (
        <div className="card">
          <div className="ctitle"><span>🌤️ Circuit Weather</span></div>
          {!weather ? (
            <div className="loading">Loading…</div>
          ) : weather.error ? (
            <div className="err">Unavailable</div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 40 }}>{wIcon(weather.weather_code)}</div>
              <div>
                <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 30 }}>
                  {Math.round(weather.temperature_2m)}\u00b0F
                </div>
                <div style={{ fontFamily: "Rajdhani", fontWeight: 600, color: "var(--mut)", fontSize: 12 }}>
                  Wind {Math.round(weather.wind_speed_10m)} mph · Precip {weather.precipitation} mm
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`@media(max-width:880px){.rw-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
