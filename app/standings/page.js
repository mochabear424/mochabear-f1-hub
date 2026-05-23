import Standings from "@/components/Standings";
export const metadata = { title: "Standings — Mochabear's F1 Hub" };
export default function StandingsPage() {
  return (
    <>
      <h2 style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 40, margin: "36px 0 20px" }}>Championship Standings</h2>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }} className="two">
        <div className="card"><div className="ctitle"><span>Drivers&apos; Championship</span></div><Standings type="drivers" /></div>
        <div className="card"><div className="ctitle"><span>Constructors&apos; Championship</span></div><Standings type="constructors" /></div>
      </div>
      <style>{`@media(max-width:880px){.two{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}
