import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoAtende",
  description: "Automação de atendimento para pequenas empresas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
