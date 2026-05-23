// Static circuit reference data — facts that rarely change season-to-season.
// Keyed by circuitId as returned by the Jolpica/Ergast API (Circuit.circuitId).
// Update lap records / win tallies at the end of each season.

const circuits = {
  albert_park: {
    timezone: "Australia/Melbourne",
    laps: 58, length: 5.278, speed: "High",
    firstGP: 1996, totalGPs: 29,
    lapRecord: { time: "1:20.235", driver: "C. Leclerc", year: 2022 },
    mostWinsDriver: { name: "M. Schumacher", wins: 4 },
    mostWinsConstructor: { name: "Ferrari", wins: 9 },
    blurb: "Street-style layout through Melbourne's Albert Park. Often the season opener — a shakedown for new machinery on a circuit that blends flowing sections with tight technical chicanes."
  },
  shanghai: {
    timezone: "Asia/Shanghai",
    laps: 56, length: 5.451, speed: "Medium",
    firstGP: 2004, totalGPs: 19,
    lapRecord: { time: "1:32.238", driver: "M. Schumacher", year: 2004 },
    mostWinsDriver: { name: "L. Hamilton", wins: 6 },
    mostWinsConstructor: { name: "Mercedes", wins: 6 },
    blurb: "Purpose-built circuit featuring a sweeping back section and long main straight. Its unique hairpin-to-DRS sequence was deliberately designed to produce overtaking."
  },
  suzuka: {
    timezone: "Asia/Tokyo",
    laps: 53, length: 5.807, speed: "High",
    firstGP: 1987, totalGPs: 36,
    lapRecord: { time: "1:30.983", driver: "V. Bottas", year: 2019 },
    mostWinsDriver: { name: "M. Schumacher", wins: 6 },
    mostWinsConstructor: { name: "Ferrari", wins: 11 },
    blurb: "One of the all-time greats. The figure-of-eight layout, legendary 130R, and Spoon Curve make Suzuka a pure driver's exam. Title deciders happen here more than anywhere else."
  },
  miami: {
    timezone: "America/New_York",
    laps: 57, length: 5.412, speed: "High",
    firstGP: 2022, totalGPs: 5,
    lapRecord: { time: "1:29.708", driver: "M. Verstappen", year: 2023 },
    mostWinsDriver: { name: "M. Verstappen", wins: 2 },
    mostWinsConstructor: { name: "Red Bull", wins: 2 },
    blurb: "Street-style circuit looping around the Hard Rock Stadium. Long straights, heavy braking zones, and F1's biggest entertainment footprint outside Monaco."
  },
  villeneuve: {
    timezone: "America/Toronto",
    laps: 70, length: 4.361, speed: "High",
    firstGP: 1978, totalGPs: 44,
    lapRecord: { time: "1:13.078", driver: "V. Bottas", year: 2019 },
    mostWinsDriver: { name: "M. Schumacher / L. Hamilton", wins: 7 },
    mostWinsConstructor: { name: "Ferrari", wins: 14 },
    blurb: "On the artificial Île Notre-Dame, long straights lead to brutal braking at the hairpin. The Wall of Champions at the final chicane has ended the races of Schumacher, Villeneuve, and Hill in the same weekend."
  },
  monaco: {
    timezone: "Europe/Monaco",
    laps: 78, length: 3.337, speed: "Low",
    firstGP: 1950, totalGPs: 68,
    lapRecord: { time: "1:12.909", driver: "L. Hamilton", year: 2021 },
    mostWinsDriver: { name: "A. Senna", wins: 6 },
    mostWinsConstructor: { name: "McLaren", wins: 15 },
    blurb: "The jewel of the calendar. Impossibly narrow streets through Monte Carlo's harbor district make passing near-impossible — pole position here is effectively a race win."
  },
  catalunya: {
    timezone: "Europe/Madrid",
    laps: 66, length: 4.657, speed: "Medium",
    firstGP: 1991, totalGPs: 34,
    lapRecord: { time: "1:18.149", driver: "M. Verstappen", year: 2021 },
    mostWinsDriver: { name: "M. Schumacher / L. Hamilton", wins: 6 },
    mostWinsConstructor: { name: "Ferrari", wins: 11 },
    blurb: "A technical, balanced layout long used as a test track by every team. Results here map closely to true championship pace — nowhere to hide setup weaknesses."
  },
  red_bull_ring: {
    timezone: "Europe/Vienna",
    laps: 71, length: 4.318, speed: "High",
    firstGP: 1970, totalGPs: 35,
    lapRecord: { time: "1:05.619", driver: "C. Sainz", year: 2020 },
    mostWinsDriver: { name: "M. Verstappen", wins: 4 },
    mostWinsConstructor: { name: "Red Bull", wins: 7 },
    blurb: "Short, punchy, and set in the Austrian Styrian hills. Just nine corners but relentless demands on tyres and power. A deceptively simple layout that exposes any mechanical weakness fast."
  },
  silverstone: {
    timezone: "Europe/London",
    laps: 52, length: 5.891, speed: "Very High",
    firstGP: 1950, totalGPs: 75,
    lapRecord: { time: "1:27.097", driver: "M. Verstappen", year: 2020 },
    mostWinsDriver: { name: "L. Hamilton", wins: 8 },
    mostWinsConstructor: { name: "Ferrari", wins: 18 },
    blurb: "Home of the British Grand Prix and birthplace of the World Championship. The Maggotts–Becketts–Chapel complex is one of the most demanding and spectacular sequences in all of motorsport."
  },
  spa: {
    timezone: "Europe/Brussels",
    laps: 44, length: 7.004, speed: "Very High",
    firstGP: 1950, totalGPs: 72,
    lapRecord: { time: "1:46.286", driver: "V. Bottas", year: 2018 },
    mostWinsDriver: { name: "M. Schumacher / A. Senna", wins: 6 },
    mostWinsConstructor: { name: "Ferrari", wins: 19 },
    blurb: "Seven kilometers of Ardennes forest, legendary weather, and the ear-splitting Eau Rouge / Raidillon blast. Spa is the purest test of car and driver courage on the calendar."
  },
  hungaroring: {
    timezone: "Europe/Budapest",
    laps: 70, length: 4.381, speed: "Low",
    firstGP: 1986, totalGPs: 40,
    lapRecord: { time: "1:16.627", driver: "L. Hamilton", year: 2020 },
    mostWinsDriver: { name: "L. Hamilton", wins: 8 },
    mostWinsConstructor: { name: "McLaren", wins: 12 },
    blurb: "Often called Monaco without the walls. Tight, twisty, and almost impossible to overtake on — qualifying and undercut strategy win races at the Hungaroring more than anywhere else."
  },
  zandvoort: {
    timezone: "Europe/Amsterdam",
    laps: 72, length: 4.259, speed: "Medium",
    firstGP: 1952, totalGPs: 30,
    lapRecord: { time: "1:11.097", driver: "M. Verstappen", year: 2021 },
    mostWinsDriver: { name: "M. Verstappen", wins: 3 },
    mostWinsConstructor: { name: "Red Bull", wins: 3 },
    blurb: "Restored in 2021 after a 35-year absence. The banked Hugenholtz corner and a sea of orange create one of the most atmospheric race weekends in the sport."
  },
  monza: {
    timezone: "Europe/Rome",
    laps: 53, length: 5.793, speed: "Very High",
    firstGP: 1950, totalGPs: 75,
    lapRecord: { time: "1:21.046", driver: "R. Barrichello", year: 2004 },
    mostWinsDriver: { name: "M. Schumacher", wins: 7 },
    mostWinsConstructor: { name: "Ferrari", wins: 20 },
    blurb: "The Temple of Speed. Flat-out straights, minimal downforce, and the passionate Tifosi produce the most unique atmosphere in F1. Monza is pure racing stripped back to its essence."
  },
  madrid: {
    timezone: "Europe/Madrid",
    laps: 55, length: 5.47, speed: "Medium",
    firstGP: 2026, totalGPs: 1,
    lapRecord: null,
    mostWinsDriver: { name: "—", wins: null },
    mostWinsConstructor: { name: "—", wins: null },
    blurb: "Brand-new street circuit threading through the IFEMA Madrid convention district. Making its debut in 2026 — the first Spanish city race since the Valencia Street Circuit in 2012."
  },
  baku: {
    timezone: "Asia/Baku",
    laps: 51, length: 6.003, speed: "Very High",
    firstGP: 2016, totalGPs: 9,
    lapRecord: { time: "1:43.009", driver: "C. Leclerc", year: 2019 },
    mostWinsDriver: { name: "S. Perez", wins: 3 },
    mostWinsConstructor: { name: "Red Bull", wins: 4 },
    blurb: "A 2.2km flat-out blast down the longest straight in F1, followed immediately by an impossibly narrow medieval old-city section. Baku produces more drama per kilometre than anywhere else."
  },
  marina_bay: {
    timezone: "Asia/Singapore",
    laps: 62, length: 4.940, speed: "Low",
    firstGP: 2008, totalGPs: 16,
    lapRecord: { time: "1:35.867", driver: "L. Hamilton", year: 2023 },
    mostWinsDriver: { name: "S. Vettel", wins: 5 },
    mostWinsConstructor: { name: "Ferrari", wins: 6 },
    blurb: "The original night race. Under blazing floodlights on the Marina Bay waterfront, brutal heat, humidity, and 62 punishing street circuit laps make Singapore the most physically demanding race of the year."
  },
  americas: {
    timezone: "America/Chicago",
    laps: 56, length: 5.513, speed: "High",
    firstGP: 2012, totalGPs: 12,
    lapRecord: { time: "1:36.169", driver: "C. Leclerc", year: 2019 },
    mostWinsDriver: { name: "L. Hamilton", wins: 6 },
    mostWinsConstructor: { name: "Mercedes", wins: 8 },
    blurb: "Built to the brief of a true driver's circuit — opening section draws from the best corners in motorsport, ending in a stadium section. Austin goes hard for race weekend, and the crowd matches it."
  },
  rodriguez: {
    timezone: "America/Mexico_City",
    laps: 71, length: 4.304, speed: "High",
    firstGP: 1963, totalGPs: 23,
    lapRecord: { time: "1:17.774", driver: "V. Bottas", year: 2021 },
    mostWinsDriver: { name: "M. Verstappen", wins: 4 },
    mostWinsConstructor: { name: "Red Bull", wins: 5 },
    blurb: "At 2,240m altitude the thin air forces unique aero and engine strategies. The stadium section through the old Foro Sol baseball diamond creates one of F1's loudest and most electric atmospheres."
  },
  interlagos: {
    timezone: "America/Sao_Paulo",
    laps: 71, length: 4.309, speed: "High",
    firstGP: 1973, totalGPs: 44,
    lapRecord: { time: "1:10.540", driver: "V. Bottas", year: 2018 },
    mostWinsDriver: { name: "A. Senna / M. Schumacher", wins: 6 },
    mostWinsConstructor: { name: "McLaren", wins: 12 },
    blurb: "Interlagos runs anti-clockwise through the São Paulo hills and is famous for its changeable weather and relentless safety car intrigue. Brazilian crowds turn every lap into a festival."
  },
  las_vegas: {
    timezone: "America/Los_Angeles",
    laps: 50, length: 6.201, speed: "Very High",
    firstGP: 1981, totalGPs: 4,
    lapRecord: { time: "1:35.490", driver: "O. Piastri", year: 2024 },
    mostWinsDriver: { name: "C. Leclerc", wins: 1 },
    mostWinsConstructor: { name: "Ferrari", wins: 2 },
    blurb: "The Strip at midnight. Speeds approaching 340 km/h down the Las Vegas Boulevard under 100,000 spectators — part spectacle, entirely serious racing."
  },
  losail: {
    timezone: "Asia/Qatar",
    laps: 57, length: 5.380, speed: "High",
    firstGP: 2021, totalGPs: 4,
    lapRecord: { time: "1:24.319", driver: "M. Verstappen", year: 2023 },
    mostWinsDriver: { name: "M. Verstappen", wins: 2 },
    mostWinsConstructor: { name: "Red Bull", wins: 3 },
    blurb: "Originally a MotoGP venue, Lusail's high-speed flowing layout demands heavy downforce and punishes tyre degradation ferociously. Heat and intensity make it one of the tougher late-season challenges."
  },
  yas_marina: {
    timezone: "Asia/Dubai",
    laps: 58, length: 5.281, speed: "High",
    firstGP: 2009, totalGPs: 17,
    lapRecord: { time: "1:26.103", driver: "M. Verstappen", year: 2021 },
    mostWinsDriver: { name: "L. Hamilton", wins: 5 },
    mostWinsConstructor: { name: "Red Bull", wins: 7 },
    blurb: "The season finale. Yas Marina has hosted some of F1's most dramatic championship deciders — including 2021's final lap, still the most controversial finish in modern F1 history."
  },
};

export function getCircuit(circuitId) {
  return circuits[circuitId] || null;
}

export function getCircuitTimezone(circuitId) {
  return circuits[circuitId]?.timezone || null;
}

export default circuits;
