"use client";
import { useEffect, useState } from "react";
import { buildSessions } from "@/lib/f1";
import { useTime, formatSessionTime, formatSessionDay } from "@/context/TimeContext";
import { getCircuitTimezone } from "@/lib/circuits";
import TimeToggle from "./TimeToggle";

const flag = (c = "") => {
  const m = {
    Bahrain:"🇧🇭","Saudi Arabia":"🇸🇦",
    Australia:"🇦🇺",Japan:"🇯🇵",
    China:"🇨🇳",USA:"🇺🇸",
    "United States":"🇺🇸",Italy:"🇮🇹",
    Monaco:"🇲🇨",Spain:"🇪🇸",
    Canada:"🇨🇦",Austria:"🇦🇹",
    UK:"🇬🇧","United Kingdom":"🇬🇧",
    Hungary:"🇭🇺",Belgium:"🇧🇪",
    Netherlands:"🇳🇱",Azerbaijan:"🇦🇿",
    Singapore:"🇸🇬",Mexico:"🇲🇽",
    Brazil:"🇧🇷",Qatar:"🇶🇦",
    UAE:"🇦🇪","United Arab Emirates":"🇦🇪",
    France:"🇫🇷",Germany:"🇩🇪"
  };
  return m[c] || "🏁";
};

const SESSION_ABBR = {
  "Practice 1":"FP1","Practice 2":"FP2","Practice 3":"FP3",
  "Sprint Qualifying":"SQ","Sprint":"SPR","Qualifying":"QUAL","Race":"RACE"
};

export default function Calendar({ full = false }) {
  const [races, setRaces] = useState(null);
  const [err, setErr] = useState(null);
  const [selected, setSelected] = useState(null);
  const { mode } = useTime();

  useEffect(() => {
    fetch("/api/schedule").then(r => r.json()).then(d => {
      if (d.error) setErr(d.error); else setRaces(d);
    }).catch(e => setErr(e.message));
  }, []);

  if (err) return <div className="err">Calendar unavailable: {err}</div>;
  if (!races) return <div className="loading">\u23f3 Loading calendar\u2026</div>;

  const now = new Date();
  const nextRound = races.find(r => new Date(`${r.date}T${r.time || "12:00:00Z"}`) > now)?.round;

  const Card = ({ r }) => {
    const dt = new Date(`${r.date}T12:00:00Z`);
    const done = dt < now && r.round != nextRound;
    const nx = r.round == nextRound;
    const isSprint = !!(r.Sprint || r.SprintQualifying);
    return (
      <div
        onClick={() => setSelected(r)}
        style={{
          minWidth: full ? "auto" : 130,
          background: "var(--bg)",
          border: `1px solid ${nx ? "var(--red)" : "var(--line)"}`,
          borderRadius: 12, padding: 13, flexShrink: 0,
          opacity: done ? .4 : 1,
          boxShadow: nx ? "0 0 0 1px rgba(225,6,0,.3)" : "none",
          cursor: "pointer", transition: "border-color .15s, box-shadow .15s"
        }}
        onMouseEnter={e => { if (!nx) e.currentTarget.style.borderColor = "var(--red)"; }}
        onMouseLeave={e => { if (!nx) e.currentTarget.style.borderColor = "var(--line)"; }}
      >
        <div style={{ fontSize: 22, marginBottom: 6, lineHeight: 1 }}>{flag(r.Circuit.Location.country)}</div>
        <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 10, letterSpacing: ".12em", color: "var(--mut)", textTransform: "uppercase", marginBottom: 3 }}>
          R{r.round} {isSprint ? "⚡" : ""}
        </div>
        <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 13, lineHeight: 1.2, marginBottom: 4 }}>
          {r.Circuit.Location.country}
        </div>
        <div style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 11, color: "var(--mut)" }}>
          {new Date(`${r.date}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </div>
        {done && (
          <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 9, letterSpacing: ".1em", color: "var(--mut)", textTransform: "uppercase", marginTop: 4 }}>
            ✓ Done
          </div>
        )}
        {nx && (
          <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 9, letterSpacing: ".1em", color: "var(--red)", textTransform: "uppercase", marginTop: 4 }}>
            ▶ Next
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Card strip / grid */}
      <div style={full
        ? { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }
        : { display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }
      }>
        {races.map(r => <Card key={r.round} r={r} />)}
      </div>

      {/* Modal overlay */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,.72)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--panel)", border: "1px solid var(--line)",
              borderRadius: 16, padding: 24, width: "100%", maxWidth: 420,
              maxHeight: "90vh", overflowY: "auto"
            }}
          >
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 11, letterSpacing: ".14em", color: "var(--mut)", textTransform: "uppercase", marginBottom: 4 }}>
                  Round {selected.round} of {races.length}
                </div>
                <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 20, lineHeight: 1.1 }}>
                  {selected.raceName}
                </div>
                <div style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 13, color: "var(--mut)", marginTop: 4 }}>
                  {selected.Circuit.circuitName}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <TimeToggle circuitId={selected.Circuit.circuitId} />
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: "var(--bg)", border: "1px solid var(--line)",
                    color: "var(--mut)", borderRadius: 8,
                    width: 28, height: 28, cursor: "pointer",
                    display: "grid", placeItems: "center", fontSize: 14
                  }}
                >×</button>
              </div>
            </div>

            {/* Session rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {buildSessions(selected).map((s, i) => {
                const past = s.dt < now;
                const circuitTz = getCircuitTimezone(selected.Circuit.circuitId);
                return (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "56px 1fr auto auto",
                    gap: 10, alignItems: "center",
                    padding: "9px 10px", borderRadius: 8, fontSize: 13,
                    background: s.isNext ? "rgba(225,6,0,.10)" : (i % 2 ? "rgba(255,255,255,.02)" : "transparent"),
                    boxShadow: s.isNext ? "inset 0 0 0 1px rgba(225,6,0,.25)" : "none",
                    opacity: past && !s.isNext ? 0.45 : 1
                  }}>
                    <span style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 10, letterSpacing: ".12em", color: "var(--mut)", textTransform: "uppercase" }}>
                      {SESSION_ABBR[s.label] || s.label}
                    </span>
                    <span style={{ fontWeight: 600 }}>{s.isNext ? "● " : ""}{s.label}</span>
                    <span className="mono" style={{ fontSize: 12 }}>
                      {formatSessionTime(s.dt, mode, circuitTz)}
                    </span>
                    <span style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 10, letterSpacing: ".1em", color: "var(--mut)", textTransform: "uppercase" }}>
                      {formatSessionDay(s.dt, mode, circuitTz)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
