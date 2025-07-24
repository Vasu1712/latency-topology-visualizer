import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Latency Topology Visualizer",
  description: "Visualize and analyze latency data across global cloud providers for GoQuant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
