"use client";
import { useTime, getTimezoneLabel } from "@/context/TimeContext";
import { getCircuitTimezone } from "@/lib/circuits";

export default function TimeToggle({ circuitId }) {
  const { mode, setMode } = useTime();
  const circuitTz = getCircuitTimezone(circuitId);
  const localLabel = getTimezoneLabel("local", null);
  const trackLabel = circuitTz ? getTimezoneLabel("track", circuitTz) : null;

  return (
    <div style={{
      display: "inline-flex", alignItems: "center",
      background: "var(--bg)", border: "1px solid var(--line)",
      borderRadius: 8, overflow: "hidden",
      fontFamily: "Rajdhani", fontWeight: 700,
      fontSize: 10, letterSpacing: ".14em"
    }}>
      <button
        onClick={() => setMode("local")}
        style={{
          padding: "5px 10px", border: "none", cursor: "pointer",
          background: mode === "local" ? "var(--red)" : "transparent",
          color: mode === "local" ? "#fff" : "var(--mut)",
          fontFamily: "inherit", fontWeight: "inherit",
          fontSize: "inherit", letterSpacing: "inherit",
          transition: "background .15s, color .15s",
          whiteSpace: "nowrap"
        }}
      >
        MY TIME{localLabel ? ` · ${localLabel}` : ""}
      </button>
      {circuitTz && (
        <button
          onClick={() => setMode("track")}
          style={{
            padding: "5px 10px", border: "none", cursor: "pointer",
            background: mode === "track" ? "var(--red)" : "transparent",
            color: mode === "track" ? "#fff" : "var(--mut)",
            fontFamily: "inherit", fontWeight: "inherit",
            fontSize: "inherit", letterSpacing: "inherit",
            transition: "background .15s, color .15s",
            borderLeft: "1px solid var(--line)",
            whiteSpace: "nowrap"
          }}
        >
          TRACK TIME{trackLabel ? ` · ${trackLabel}` : ""}
        </button>
      )}
    </div>
  );
}
