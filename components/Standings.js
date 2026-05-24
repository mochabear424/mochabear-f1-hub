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

// Tiny SVG sparkline — plots last-N finishing positions as a line chart.
// Y axis is inverted: P1 = top, P20 = bottom. Lower numbers = better.
function Sparkline({ positions, color }) {
  if (!positions || positions.length < 2) return null;

  const W = 52, H = 20, PAD = 2;
  const n = positions.length;
  const innerW = W - PAD * 2;
  const innerH = H - PAD * 2;

  // Map position 1–20 onto Y (P1 = PAD = top, P20 = PAD+innerH = bottom)
  const y = pos => PAD + ((pos - 1) / 19) * innerH;
  const x = i => PAD + (i / (n - 1)) * innerW;

  const pts = positions.map((pos, i) => [x(i), y(pos)]);
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

  return (
    <svg width={W} height={H} style={{ flexShrink: 0 }}>
      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      {/* Dots */}
      {pts.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2" fill={color} opacity="0.9" />
      ))}
    </svg>
  );
}

export default function Standings({ type = "drivers", limit }) {
  const [rows, setRows] = useState(null);
  const [form, setForm] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetch(`/api/${type}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setErr(d.error);
        else setRows(limit ? d.slice(0, limit) : d);
      })
      .catch(e => setErr(e.message));

    // Fetch form data (last 5 races) in parallel
    fetch("/api/form")
      .then(r => r.json())
      .then(d => { if (!d.error) setForm(d); })
      .catch(() => {});
  }, [type, limit]);

  if (err) return <div className="err">Standings unavailable: {err}</div>;
  if (!rows) return <div className="loading">⏳ Loading standings…</div>;

  return (
    <div style={{ display: "f