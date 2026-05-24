import { Archivo, Rajdhani } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { TimeProvider } from "@/context/TimeContext";

const archivo = Archivo({ subsets: ["latin"], weight: ["400","600","800","900"], variable: "--font-archivo" });
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["500","600","700"], variable: "--font-rajdhani" });

export const metadata = { title: "Mochabear's F1 Hub", description: "Live F1 dashboard" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${rajdhani.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <TimeProvider>
          <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 18px 80px" }}>
            <Nav />
            {children}
            <footer style={{
              marginTop: 40, paddingTop: 24,
              borderTop: "1px solid var(--line)",
              fontSize: 11, color: "var(--mut)",
              fontFamily: "Rajdhani", lineHeight: 1.6
            }}>
              <strong style={{ color: "var(--txt)" }}>MOCHABEAR&apos;S F1 HUB</strong>
              {" "}&middot; Personal dashboard &middot; Data via the free Jolpica-F1 API &amp; Open-Meteo.
              <br />
              Independent fan project &mdash; not affiliated with, endorsed by, or connected to
              Formula 1, the FIA, or any team. F1 and related marks are trademarks of
              Formula One Licensing B.V. Race data shown for informational purposes only.
            </footer>
          </div>
        </TimeProvider>
      </body>
    </html>
  );
}
