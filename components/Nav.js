"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  ["/", "Home"], ["/race-hub", "Race Hub"], ["/calendar", "Calendar"],
  ["/fantasy", "Fantasy"], ["/standings", "Standings"]
];

export default function Nav() {
  const path = usePathname();
  const [badge, setBadge] = useState("LIVE DATA");

  useEffect(() => {
    fetch("/api/schedule").then(r => r.json()).then(races => {
      if (!Array.isArray(races)) return;
      const now = new Date();
      const next = races.find(r => new Date(`${r.date}T${r.time || "12:00:00Z"}`) > now) || races[races.length - 1];
      if (next) setBadge(`${(next.Circuit.Location.country || "").slice(0, 12)} · R${next.round}`);
    }).catch(() => {});
  }, []);

  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 0 18px", borderBottom: "1px solid var(--line)", position: "sticky", top: 0,
      background: "linear-gradient(180deg,var(--bg) 70%,transparent)", zIndex: 20, backdropFilter: "blur(6px)", flexWrap: "wrap", gap: 12 }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 9, background: "linear-gradient(135deg,var(--red),#7a0300)",
          display: "grid", placeItems: "center", fontFamily: "Archivo", fontWeight: 900, fontSize: 22,
          boxShadow: "0 0 22px rgba(225,6,0,.45)" }}>M</div>
        <div>
          <div style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 19, letterSpacing: ".06em", lineHeight: 1 }}>MOCHABEAR&apos;S F1 HUB</div>
          <div style={{ fontFamily: "Rajdhani", fontSize: 11, letterSpacing: ".32em", color: "var(--mut)", textTransform: "uppercase" }}>Personal Paddock</div>
        </div>
      </Link>
      <nav style={{ display: "flex", gap: 4, fontFamily: "Rajdhani", fontWeight: 600, fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase" }}>
        {links.map(([href, label]) => {
          const on = path === href;
          return <Link key={href} href={href} style={{ color: on ? "var(--txt)" : "var(--mut)",
            padding: "8px 13px", borderRadius: 7, background: on ? "var(--panel2)" : "transparent" }}>{label}</Link>;
        })}
      </nav>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--accent)", border: "1px solid var(--line)",
        padding: "5px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--grn)", boxShadow: "0 0 8px var(--grn)" }} />
        {badge}
      </div>
    </header>
  );
}
