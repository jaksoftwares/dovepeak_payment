import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Dovepeak | Secure M-Pesa Payment Portal",
  description: "Official payment portal for Dovepeak Digital Solutions. Secure and fast M-Pesa STK Push payments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
