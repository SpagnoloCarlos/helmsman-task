import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import Provider from "@/components/provider/Provider";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "HelmsmanTask",
  description:
    "HelmsmanTask es una herramienta de gestión de tareas y coordinación de proyectos diseñada para ayudar a los equipos a navegar por su carga de trabajo con precisión y eficiencia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <Toaster />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
