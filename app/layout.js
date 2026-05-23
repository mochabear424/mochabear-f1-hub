import "./globals.css";
import Nav from "@/components/Nav";

export const viewport = { themeColor: "#080C10" };

export const metadata = {
  title: "Mochabear's F1 Hub — Live F1 Data, Standings & Fantasy",
  description: "Personal F1 dashboard: live race weekends, championship standings, countdowns and a data-driven fantasy form guide. Auto-updated every race weekend.",
  openGraph: {
    title: "Mochabear's F1 Hub",
    description: "Live F1 race weekends, standings, countdowns & fantasy form — all in one garage.",
    type: "website",
    siteName: "Mochabear's F1 Hub"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mochabear's F1 Hub",
    description: "Live F1 race weekends, standings, countdowns & fantasy form."
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "F1 Hub" }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Archivo:wght@400;600;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 18px 80px" }}>
          <Nav />
          {children}
          <footer style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--line)", fontSize: 11, color: "var(--mut)", fontFamily: "Rajdhani", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--txt)" }}>MOCHABEAR&apos;S F1 HUB</strong> · Personal dashboard · Data via the free Jolpica-F1 API &amp; Open-Meteo.<br />
            Independent fan project — not affiliated with, endorsed by, or connected to Formula 1, the FIA, or any team. F1 and related marks are trademarks of Formula One Licensing B.V. Race data shown for informational purposes only.
          </footer>
        </div>
      </body>
    </html>
  );
}
