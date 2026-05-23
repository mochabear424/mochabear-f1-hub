import RaceHubClient from "@/components/RaceHubClient";

export const metadata = { title: "Race Hub — Mochabear's F1 Hub" };

export default function RaceHub() {
  return (
    <>
      <h2 style={{ fontFamily: "Archivo", fontWeight: 900, fontSize: 40, margin: "36px 0 20px" }}>Race Hub</h2>
      <RaceHubClient />
    </>
  );
}
