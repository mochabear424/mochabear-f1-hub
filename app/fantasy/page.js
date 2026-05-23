import Fantasy from "@/components/Fantasy";
export const metadata = { title: "Fantasy — Mochabear's F1 Hub" };
export default function FantasyPage() {
  return (
    <>
      <h2 style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 40, margin: "36px 0 8px" }}>Fantasy Form Guide</h2>
      <p style={{ color: "var(--mut)", fontFamily: "Rajdhani", fontWeight: 600, fontSize: 14, marginBottom: 20, maxWidth: 560, lineHeight: 1.5 }}>
        The Momentum Index ranks every driver by their points pace over the last two rounds versus their season average — auto-updated each race weekend. ▲ HOT means they&apos;re scoring above their season form; ▼ COLD means below.
      </p>
      <div className="card gold"><Fantasy limit={20} /></div>
    </>
  );
}
