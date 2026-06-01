import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nora Comply — EU AI Act Assistant",
  description:
    "RAG-powered compliance assistant for recruitment agencies navigating the EU AI Act",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
