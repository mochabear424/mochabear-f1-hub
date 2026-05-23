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

export default function Fantasy({ limit = 8 }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    fetch("/api/fantasy").then(r => r.json()).then(d => {
      if (d.error) setErr(d.error); else setRows(d.slice(0, limit));
    }).catch(e => setErr(e.message));
  }, [limit]);

  if (err) return <div className="err">Form guide unavailable: {err}</div>;
  if (!rows) return <div className="loading">⏳ Crunching recent results…</div>;
  const maxRec = Math.max(...rows.map(r => r.rec), 1);

  return (
    <div>
      {rows.map((r, i) => {
        const col = teamColor(r.team);
        const filled = Math.round((r.rec / maxRec) * 5);
        const tc = r.delta > 1.5 ? "up" : r.delta < -1.5 ? "dn" : "flat";
        const tl = r.delta > 1.5 ? "▲ HOT" : r.delta < -1.5 ? "▼ COLD" : "– STEADY";
        const tcol = tc === "up" ? "var(--grn)" : tc === "dn" ? "var(--red)" : "var(--mut)";
        const tbg = tc === "up" ? "rgba(63,185,80,.12)" : tc === "dn" ? "rgba(225,6,0,.12)" : "rgba(124,138,153,.1)";
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 10, alignItems: "center",
            padding: "10px 4px", borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.name}</div>
              <div style={{ fontFamily: "Rajdhani", fontSize: 10, letterSpacing: ".06em", color: "var(--mut)", textTransform: "uppercase" }}>
                {r.team} · {r.rec} pts last 2
              </div>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              {Array.from({ length: 5 }, (_, j) =>
                <div key={j} style={{ width: 7, height: 18, borderRadius: 2, background: j < filled ? col : "var(--line)" }} />)}
            </div>
            <div className="mono" style={{ fontSize: 12, fontWeight: 700, padding: "3px 7px", borderRadius: 5, color: tcol, background: tbg }}>{tl}</div>
          </div>
        );
      })}
    </div>
  );
}
