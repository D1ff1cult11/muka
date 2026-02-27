import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MUKA | Focus Over Noise",
  description: "Zero-friction, AI-driven communication protocol designed to eliminate Notification Fatigue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
