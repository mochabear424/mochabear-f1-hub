"use client";
import { useEffect, useState } from "react";
import { getCircuit } from "@/lib/circuits";

const Stat = ({ label, value, sub }) => (
  <div style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px 16px" }}>
    <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 10, letterSpacing: ".18em", color: "var(--mut)", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
    <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 22, lineHeight: 1, color: "var(--txt)" }}>{value}</div>
    {sub && <div style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 11, color: "var(--mut)", marginTop: 4 }}>{sub}</div>}
  </div>
);

const RecordRow = ({ label, driver, constructor: cons, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
    <div>
      <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 10, letterSpacing: ".14em", color: "var(--mut)", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontWeight: 600, fontSize: 14, marginTop: 2 }}>{driver || cons}</div>
    </div>
    <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 20, color: "var(--red)" }}>
      {value}{typeof value === "number" ? "×" : ""}
    </div>
  </div>
);

// race prop: when provided, component is driven externally (race-hub selector).
// When omitted, component self-fetches the current/next race.
export default function CircuitInfo({ race: raceProp = null }) {
  const [race, setRace] = useState(raceProp);
  const [err, setErr] = useState(null);

  // Sync when raceProp changes
  useEffect(() => {
    if (raceProp) { setRace(raceProp); return; }
    // Self-fetch only when no prop
    fetch("/api/schedule").then(r => r.json()).then(races => {
      if (races.error) { setErr(races.error); return; }
      const now = new Date();
      const next = races.find(r => new Date(`${r.date}T${r.time || "12:00:00Z"}`) > now) || races[races.length - 1];
      setRace(next);
    }).catch(e => setErr(e.message));
  }, [raceProp]);

  if (err) return null;
  if (!race) return null;

  const circuitId = race.Circuit?.circuitId;
  const c = getCircuit(circuitId);

  // If we have no static data for this circuit, show minimal info from the API
  if (!c) {
    return (
      <div className="card" style={{ marginTop: 16 }}>
        <div className="ctitle"><span>Circuit Info</span></div>
        <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 20 }}>{race.Circuit.circuitName}</div>
        <div style={{ color: "var(--mut)", fontFamily: "Rajdhani", fontWeight: 600, fontSize: 13, marginTop: 4 }}>
          {race.Circuit.Location.locality}, {race.Circuit.Location.country}
        </div>
      </div>
    );
  }

  const isNew = c.firstGP >= 2025;

  return (
    <div className="card" style={{ marginTop: 0 }}>
      {/* Header */}
      <div className="ctitle">
        <span>Circuit Info</span>
        <span className="speed-badge">{c.speed} Speed</span>
      </div>

      <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 24, lineHeight: 1.05 }}>
        {race.Circuit.circuitName}
      </div>
      <div style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 13, color: "var(--mut)", marginTop: 4, marginBottom: 16 }}>
        {race.Circuit.Location.locality}, {race.Circuit.Location.country}
        {isNew && <span style={{ marginLeft: 10, fontFamily: "Rajdhani", fontWeight: 700, fontSize: 10, letterSpacing: ".1em", color: "var(--gold)", background: "rgba(244,196,48,.12)", padding: "2px 7px", borderRadius: 4, textTransform: "uppercase" }}>New 2026</span>}
      </div>

      {/* Key stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10, marginBottom: 20 }}>
        <Stat label="Laps" value={c.laps} />
        <Stat label="Length" value={`${c.length} km`} />
        <Stat label="First GP" value={c.firstGP} />
        <Stat label="Total GPs" value={isNew ? "Debut" : `${c.totalGPs}`} />
        {c.lapRecord && (
          <Stat
            label="Lap Record"
            value={c.lapRecord.time}
            sub={`${c.lapRecord.driver} · ${c.lapRecord.year}`}
          />
        )}
      </div>

      {/* Blurb */}
      {c.blurb && (
        <p style={{ color: "var(--mut)", fontSize: 13, lineHeight: 1.65, margin: "0 0 20px", fontFamily: "Rajdhani", fontWeight: 600 }}>
          {c.blurb}
        </p>
      )}

      {/* Records */}
      {c.mostWinsDriver?.wins && (
        <div>
          <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 11, letterSpacing: ".18em", color: "var(--mut)", textTransform: "uppercase", marginBottom: 4 }}>Circuit R