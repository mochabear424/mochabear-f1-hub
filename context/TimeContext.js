"use client";
import { createContext, useContext, useState } from "react";

const TimeContext = createContext({ mode: "local", setMode: () => {} });

export function TimeProvider({ children }) {
  const [mode, setMode] = useState("local"); // "local" | "track"
  return (
    <TimeContext.Provider value={{ mode, setMode }}>
      {children}
    </TimeContext.Provider>
  );
}

export function useTime() {
  return useContext(TimeContext);
}

// Format a Date or ISO string as HH:MM, respecting the time mode.
// circuitTz: IANA timezone string e.g. "America/Toronto"
export function formatSessionTime(dateOrISO, mode, circuitTz) {
  const dt = typeof dateOrISO === "string" ? new Date(dateOrISO) : dateOrISO;
  const opts = { hour: "2-digit", minute: "2-digit", hour12: false };
  if (mode === "track" && circuitTz) opts.timeZone = circuitTz;
  return dt.toLocaleTimeString([], opts);
}

// Format the weekday label respecting time mode (day can shift across midnight).
export function formatSessionDay(dateOrISO, mode, circuitTz) {
  const dt = typeof dateOrISO === "string" ? new Date(dateOrISO) : dateOrISO;
  const opts = { weekday: "short" };
  if (mode === "track" && circuitTz) opts.timeZone = circuitTz;
  return dt.toLocaleDateString([], opts);
}

// Get a short timezone label for display (e.g. "EDT", "BST").
export function getTimezoneLabel(mode, circuitTz) {
  if (mode === "local" || !circuitTz) {
    return new Intl.DateTimeFormat([], { timeZoneName: "short" })
      .formatToParts(new Date())
      .find(p => p.type === "timeZoneName")?.value || "";
  }
  return new Intl.DateTimeFormat([], { timeZone: circuitTz, timeZoneName: "short" })
    .formatToParts(new Date())
    .find(p => p.type === "timeZoneName")?.value || "";
}
