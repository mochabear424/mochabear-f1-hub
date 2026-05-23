"use client";
import { useEffect, useState } from "react";
import { buildSessions } from "@/lib/f1";
import { useTime, formatSessionTime, formatSessionDay } from "@/context/TimeContext";
import { getCircuitTimezone } from "@/lib/circuits";
import TimeToggle from "./TimeToggle";

const flag = (c = "") => {
  const m = { Bahrain:"🇧🇭","Saudi Arabia":"🇸🇦",Australia:"🇦🇺",Japan:"🇯🇵",China:"🇨🇳",USA:"🇺🇸","United States":"🇺🇸",Italy:"🇮🇹",Monaco:"🇲🇨",Spain:"🇪🇸",Canada:"🇨🇦",Austria:"🇦🇹",UK:"🇬🇧","United Kingdom":"🇬🇧",Hungary:"🇭🇺",Belgium:"🇧🇪",Netherlands:"🇳🇱",Azerbaijan:"🇦🇿",Singapore:"🇸🇬",Mexico:"🇲🇽",Brazil:"🇧🇷",Qatar:"🇶🇦",UAE:"🇦🇪","United Arab Emirates":"🇦🇪",France:"🇫🇷",Germany:"🇩🇪",Spain:"🇪🇸",Madrid:"🇪🇸" };
  return m[c] || "🏁";
};

const SESSION_ABBR = {
  "Practice 1": "FP1", "Practice 2": "FP2", "Practice 3": "FP3",
  "Sprint Qualifying": "SQ", "Sprint": "SPR", "Qualifying": "QUAL", "Race": "RACE"
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
  if (!races) return <div className="loading">⏳ Loading calendar…</div>;

  const now = new Date();
  const nextRound = races.find(r => new Date(`${r.date}T${r.time || "12:00:00Z"}`) > now)?.round;

  const openModal = (r) => setSelected(r);
  const closeModal = () => setSelected(null);

  const Card = ({ r }) => {
    const dt = new Date(`${r.date}T12:00:00Z`);
    const done = dt < now && r.round != nextRound;
    const nx = r.round == nextRound;
    const isSprint = !!(r.Sprint || r.SprintQualifying);
    return (
      <div
        onClick={() => openModal(r)}
        style={{
          minWidth: full ? "auto" : 130,
          background: "var(--bg)",
          border: `1px solid ${nx ? "var(--red)" : "var(--line)"}`,
          borderRadius: 12, padding: 13, flexShrink: 0,
          opacity: done ? .4 : 1,
          boxShadow: nx ? "0 0 0 1px rgba(225,6,0,.3)" : "none",
          cursor: "pointer", transition: "border-color .15s, box-shadow .15s"
        }}
        onMouseEnter={e => { if (!nx) e.currentTarget.style.borderColor = "rgba(225,6,0,.5)"; }}
        onMouseLeave={e => { if (!nx) e.currentTarget.style.borderColor = "var(--line)"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--red)" }}>R{r.round}</span>
          {isSprint && <span style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 9, letterSpacing: ".1em", color: "var(--gold)", background: "rgba(244,196,48,.12)", padding: "1px 5px", borderRadius: 4 }}>⚡ SPRINT</span>}
        </div>
        <div style={{ fontSize: 22, margin: "6px 0 4px" }}>{flag(r.Circuit.Location.country)}</div>
        <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.2 }}>{r.raceName.replace(" Grand Prix", " GP")}</div>
        <div style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 11, color: "var(--mut)", marginTop: 4 }}>
          {dt.toLocaleDateString([], { month: "short", day: "numeric" })}
        </div>
      </div>
    );
  };

  // Modal overlay
  const Modal = () => {
    if (!selected) return null;
    const circuitId = selected.Circuit?.circuitId;
    const circuitTz = getCircuitTimezone(circuitId);
    const sessions = buildSessions(selected);
    const isSprint = !!(selected.Sprint || selected.SprintQualifying);
    return (
      <>
        {/* Backdrop */}
        <div
          onClick={closeModal}
          style={{
            position: "fixed", inset: 0, background: "rgba(8,12,16,.82)",
            zIndex: 100, backdropFilter: "blur(4px)"
          }}
        />
        {/* Card */}
        <div
          className="modal-card"
          style={{
            position: "fixed", zIndex: 101,
            bottom: 0, left: 0, right: 0,
            margin: "0 auto", maxWidth: 520,
            background: "var(--panel)",
            border: "1px solid var(--line)",
            borderTop: "3px solid var(--red)",
            borderRadius: "20px 20px 0 0",
            padding: "24px 20px 32px",
            maxHeight: "80vh", overflowY: "auto"
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--red)" }}>
                  R{selected.round} · {selected.Circuit.Location.country}
                </span>
                {isSprint && (
                  <span style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 10, letterSpacing: ".1em", color: "var(--gold)", background: "rgba(244,196,48,.12)", padding: "2px 7px", borderRadius: 4 }}>
                    ⚡ SPRINT WEEKEND
                  </span>
                )}
              </div>
              <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 22, lineHeight: 1 }}>{selected.raceName}</div>
              <div style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 12, color: "var(--mut)", marginTop: 3 }}>
                {selected.Circuit.circuitName}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <button
                onClick={closeModal}
                style={{
                  background: "var(--panel2)", border: "1px solid var(--line)", color: "var(--mut)",
                  width: 30, height: 30, borderRadius: 8, cursor: "pointer",
                  display: "grid", placeItems: "center", fontSize: 16, lineHeight: 1
                }}
              >×</button>
              <TimeToggle circuitId={circuitId} />
            </div>
          </div>

          {/* Session list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {sessions.map((s, i) => {
              const dt = new Date(s.iso);
              const past = dt < now;
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "36px 1fr auto auto", gap: 10, alignItems: "center",
                  padding: "11px 12px", borderRadius: 9,
                  background: s.isNext ? "rgba(225,6,0,.10)" : (i % 2 ? "rgba(255,255,255,.02)" : "transparent"),
                  boxShadow: s.isNext ? "inset 0 0 0 1px rgba(225,6,0,.3)" : "none",
                  opacity: past && !s.isNext ? .45 : 1
                }}>
                  <span style={{
                    fontFamily: "Rajdhani", fontWeight: 700, fontSize: 9, letterSpacing: ".1em",
                    color: s.isNext ? "var(--red)" : "var(--mut)", textTransform: "uppercase"
                  }}>
                    {SESSION_ABBR[s.label] || s.label.slice(0, 4).toUpperCase()}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>
                    {s.isNext ? "● " : ""}{s.label}
                  </span>
                  <span className="mono" style={{ fontSize: 13 }}>
                    {formatSessionTime(dt, mode, circuitTz)}
                  </span>
                  <span style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 11, letterSpacing: ".1em", color: "var(--mut)", textTransform: "uppercase", minWidth: 30, textAlign: "right" }}>
                    {formatSessionDay(dt, mode, circuitTz)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  if (full) return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12 }}>
        {races.map(r => <Card key={r.round} r={r} />)}
      </div>
      <Modal />
    </>
  );

  return (
    <>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
        {races.map(r => <Card key={r.round} r={r} />)}
      </div>
      <Modal />
    </>
  );
}
