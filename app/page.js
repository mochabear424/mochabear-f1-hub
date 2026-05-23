import RaceWeekend from "@/components/RaceWeekend";
import Standings from "@/components/Standings";
import Fantasy from "@/components/Fantasy";
import Calendar from "@/components/Calendar";
import Link from "next/link";

const quick = [
  ["🏎️", "Race Hub", "Timing, results & circuit info", "/race-hub"],
  ["🏆", "Fantasy", "Data-driven form guide", "/fantasy"],
  ["📊", "Standings", "Full championship tables", "/standings"],
  ["📅", "Calendar", "Every round, every session", "/calendar"]
];

export default function Home() {
  return (
    <>
      <section style={{ padding: "46px 0 30px" }}>
        <div style={{ fontFamily: "Rajdhani", fontWeight: 700, letterSpacing: ".34em", fontSize: 12, color: "var(--red)", textTransform: "uppercase" }}>Your F1 Home · 2026 Season</div>
        <h2 style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: "clamp(38px,6vw,68px)", lineHeight: .95, margin: "10px 0 14px", letterSpacing: "-.02em" }}>
          Everything F1.<br /><span style={{ color: "var(--red)", textShadow: "0 0 30px rgba(225,6,0,.4)" }}>One garage.</span>
        </h2>
        <p style={{ color: "var(--mut)", maxWidth: 540, fontSize: 15, lineHeight: 1.6 }}>
          Live race weekends, championship standings, countdowns and a data-driven fantasy form guide — all auto-pulled, all in one place. Built for Mochabear.
        </p>
      </section>

      <div style={{ display: "grid", gap: 16 }}>
        <RaceWeekend />
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }} className="two">
          <div className="card"><div className="ctitle"><span>Drivers&apos; Championship</span><Link href="/standings">Full →</Link></div><Standings type="drivers" limit={5} /></div>
          <div className="card"><div className="ctitle"><span>Constructors&apos; Championship</span><Link href="/standings">Full →</Link></div><Standings type="constructors" limit={5} /></div>
        </div>
        <div className="card gold"><div className="ctitle"><span>🏆 Fantasy Form Guide · Momentum Index</span><Link href="/fantasy">More →</Link></div><Fantasy limit={8} /></div>
        <div className="card"><div className="ctitle"><span>Season Calendar</span><Link href="/calendar">Full →</Link></div><Calendar /></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }} className="quad">
          {quick.map(([ico, ttl, sub, href]) => (
            <Link key={href} href={href} className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 22 }}>{ico}</div>
              <div style={{ fontWeight: 800, fontSize: 14, marginTop: 8 }}>{ttl}</div>
              <div style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 11, color: "var(--mut)", marginTop: 2 }}>{sub}</div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:880px){.two{grid-template-columns:1fr!important}.quad{grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </>
  );
}
