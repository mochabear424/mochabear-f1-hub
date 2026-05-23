"use client";
import { useEffect, useState } from "react";

export default function Countdown({ target, label = "Until race start" }) {
  const [t, setT] = useState({ d: "--", h: "--", m: "--", s: "--" });
  useEffect(() => {
    if (!target) return;
    const tick = () => {
      let s = Math.max(0, Math.floor((new Date(target) - new Date()) / 1000));
      const d = Math.floor(s / 86400); s -= d * 86400;
      const h = Math.floor(s / 3600); s -= h * 3600;
      const m = Math.floor(s / 60); s -= m * 60;
      const p = n => String(n).padStart(2, "0");
      setT({ d: p(d), h: p(h), m: p(m), s: p(s) });
    };
    tick(); const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  const unit = (n, l) => (
    <div style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 11, padding: "14px 6px", minWidth: 66 }}>
      <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 32, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{n}</div>
      <div style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 10, letterSpacing: ".18em", color: "var(--mut)", textTransform: "uppercase", marginTop: 6 }}>{l}</div>
    </div>
  );
  return (
    <div style={{ textAlign: "center", padding: "6px 0" }}>
      <div style={{ fontFamily: "Rajdhani", fontWeight: 600, letterSpacing: ".12em", fontSize: 12, color: "var(--mut)", textTransform: "uppercase" }}>{label}</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 16 }}>
        {unit(t.d, "Days")}{unit(t.h, "Hrs")}{unit(t.m, "Min")}{unit(t.s, "Sec")}
      </div>
    </div>
  );
}
