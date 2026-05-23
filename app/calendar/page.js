import Calendar from "@/components/Calendar";
export const metadata = { title: "Calendar — Mochabear's F1 Hub" };
export default function CalendarPage() {
  return (
    <>
      <h2 style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 40, margin: "36px 0 20px" }}>Season Calendar</h2>
      <div className="card"><Calendar full /></div>
    </>
  );
}
