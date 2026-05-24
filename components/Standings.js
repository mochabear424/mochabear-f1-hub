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

function Sparkline({ positions, color }) {
  if (!positions || positions.length < 2) return null;
  const W = 52, H = 20, PAD = 2;
  const n = positions.length;
  const innerW = W - PAD * 2;
  const innerH = H - PAD * 2;
  const y = pos => PAD + ((pos - 1) / 19) * innerH;
  const x = i => PAD + (i / (n - 1)) * innerW;
  const pts = positions.map((pos, i) => [x(i), y(pos)]);
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <svg width={W} height={H} style={{ flexShrink: 0 }}>
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
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
    fetch("/api/form")
      .then(r => r.json())
      .then(d => { if (!d.error) setForm(d); })
      .catch(() => {});
  }, [type, limit]);

  if (err) return <div className="err">Standings unavailable: {err}</div>;
  if (!rows) return <div className="loading">⏳ Loading standings…</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {rows.map((x, i) => {
        const isDriver = type === "drivers";
        const team = isDriver ? x.Constructors[0].name : x.Constructor.name;
        const name = isDriver
          ? `${x.Driver.givenName} ${x.Driver.familyName}`
          : x.Constructor.name;
        const sub = isDriver ? team : x.Constructor.nationality;
        const col = teamColor(team);
        const formKey = isDriver ? x.Driver.driverId : x.Constructor.constructorId;
        const positions = form
          ? (isDriver ? form.drivers?.[formKey] : form.constructors?.[formKey])
          : null;
        return (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: "4px 26px 1fr auto auto",
            gap: 10, alignItems: "center",
            padding: "10px 8px", borderRadius: 8,
          }}>
            <div style={{ width: 4, alignSelf: "stretch", borderRadius: 3, background: col }} />
            <div style={{
              fontFamily: "Archivo", fontWeight: 900, fontSize: 15,
              color: i === 0 ? "var(--gold)" : "var(--mut)", textAlign: "center"
            }}>
              {x.position}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{name}</span>
              <span style={{
                fontFamily: "Rajdhani", fontWeight: 600, fontSize: 11,
                letterSpacing: ".06em", color: "var(--mut)", textTransform: "uppercase"
              }}>{sub}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {positions && positions.length >= 2
                ? <Sparkline positions={positions} color={col} />
                : <div style={{ width: 52 }} />}
            </div>
            <div className="mono" style={{ fontWeight: 700, fontSize: 15, minWidth: 38, textAlign: "right" }}>
              {x.points}
            </div>
          </div>
        );
      })}
      <div style={{
        marginTop: 6, paddingTop: 8, borderTop: "1px solid var(--line)",
        fontFamily: "Rajdhani", fontWeight: 600, fontSize: 10,
        letterSpacing: ".12em", color: "var(--mut)", textTransform: "uppercase",
        display: "flex", justifyContent: "flex-end", gap: 16
      }}>
        <span>P1 = top · P20 = bottom</span>
        <span>Last 5 races →</span>
      </div>
    </div>
  );
}
