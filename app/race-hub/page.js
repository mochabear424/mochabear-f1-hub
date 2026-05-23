import RaceWeekend from "@/components/RaceWeekend";
import Results from "@/components/Results";
import CircuitInfo from "@/components/CircuitInfo";

export const metadata = { title: "Race Hub — Mochabear's F1 Hub" };

export default function RaceHub() {
  return (
    <>
      <h2 style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 40, margin: "36px 0 20px" }}>Race Hub</h2>
      <div style={{ display: "grid", gap: 16 }}>
        <RaceWeekend />
        <CircuitInfo />
        <div className="card"><div className="ctitle"><span>Latest Race Result</span></div><Results /></div>
      </div>
    </>
  );
}
