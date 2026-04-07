import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "범딧불",
  description: "시험기간 일정을 누구보다 빠르고, 효율적으로!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="h-full">{children}</body>
    </html>
  );
}
