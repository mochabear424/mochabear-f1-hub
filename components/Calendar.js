"use client";
import { useEffect, useState } from "react";
import { buildSessions } from "@/lib/f1";
import { useTime, formatSessionTime, formatSessionDay } from "@/context/TimeContext";
import { getCircuitTimezone } from "@/lib/circuits";
import TimeToggle from "./TimeToggle";

const flag = (c = "") => {
  const m = { Bahrain:"🇧🇭","Saudi Arabia":"🇸🇦",Australia:"🇦🇺",Japan:"🇯🇵",China:"🇨🇳",USA:"🇺🇸","United States":"🇺🇸",Italy:"🇮🇹",Monaco:"🇲🇨",Spain:"🇪🇸",Canada:"🇨🇦",Austria:"🇦🇹",UK:"🇬🇧","United Kingdom":"🇬🇧",Hungary:"🇭🇺",Belgium:"🇧🇪",Netherlands:"🇳🇱",Azerbaijan:"🇦🇿",Singapore:"🇸🇬",Mexico:"🇲🇽",Brazil:"🇧🇷",Qatar:"🇶🇦",UAE:"🇦🇪","United Arab Emirates":"🇦🇪",France:"🇫🇷",Germany:"🇩🇪",Spain:"🇪🇸",Madrid:"🇪🇸" };
  return m[c] || "🏁";
};

const SESSION_ABBR = {
  "Practice 1": "FP1", "Practice 2": "FP2", "Practice 3": "FP3",
  "Sprint Qualifying": "SQ", "Sprint": "SPR", "Qualifying": "QUAL", "Race": "RACE"
};

export default function Calendar({ full = false }) {
  const [races, setRaces] = useState(null);
  const [err, setErr] = useState(null);
  const [selected, setSelected] = useState(null);
  const { mode } = useTime();

  useEffect(() => {
    fetch("/api/schedule").then(r => r.json()).then(d => {
      if (d.error) setErr(d.error); else setRaces(d);
    }).catch(e => setErr(e.message));
  }, []);

  if (err) return <div className="err">Calendar unavailable: {err}</div>;
  if (!races) return <div className="loading">⏳ Loading calendar…</div>;

  const now = new Date();
  const nextRound = races.find(r => new Date(`${r.date}T${r.time || "12:00:00Z"}`) > now)?.round;

  const openModal = (r) => setSelected(r);
  const closeModal = () => setSelected(null);

  const Card = ({ r }) => {
    const dt = new Date(`${r.date}T12:00:00Z`);
    const done = dt < now && r.round != nextRound;
    const nx = r.round == nextRound;
    const isSprint = !!(r.Sprint || r.SprintQualifying);
    return (
      <div
        onClick={() => openModal(r)}
        style={{
          minWidth: full ? "auto" : 130,
          background: "var(--bg)",
          border: `1px solid ${nx ? "var(--red)" : "var(--line)"}`,
          borderRadius: 12, padding: 13, flexShrink: 0,
          opacity: done ? .4 : 1,
          boxShadow: nx ? "0 0 0 1px rgba(225,6,0,.3)" : "none",
          cursor: "pointer", transition: "border-color .15s, box-shadow .15s"
        }}
        onMouseEnter={e => { if (!nx) e.currentTarget