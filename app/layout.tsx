import type { Metadata } from "next";
// Self-hosted fonts (@fontsource) — bundled locally, zero runtime CDN calls.
import "@fontsource/bricolage-grotesque/600.css";
import "@fontsource/bricolage-grotesque/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import { Nav } from "@/components/layout/Nav";
import "./globals.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "Faísca — laboratório de animação web",
  description:
    "Plataforma pessoal de estudo de animações web criativas. Roda 100% offline.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className={styles.shell}>
          <Nav />
          <main className={styles.main}>{children}</main>
        </div>
      </body>
    </html>
  );
}
