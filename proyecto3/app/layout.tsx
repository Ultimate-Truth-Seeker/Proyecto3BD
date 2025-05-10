import Link from 'next/link';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proyecto 3",
  description: "Modo de desarrollo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="">
          <nav className="bg-white border-b shadow px-6 py-4 flex gap-6">
            <Link href="/" className="text-blue-600 hover:underline">
              Inicio
            </Link>
            <Link href="/reportes/eventos" className="text-blue-600 hover:underline">
              Eventos
            </Link>
            <Link href="/reportes/usuarios" className="text-blue-600 hover:underline">
              Usuarios
            </Link>
            <Link href="/reportes/recursos" className="text-blue-600 hover:underline">
              Recursos
            </Link>
            <Link href="/reportes/artistas" className="text-blue-600 hover:underline">
              Artistas
            </Link>
            <Link href="/reportes/patrocinadores" className="text-blue-600 hover:underline">
              Patrocinadores
            </Link>
          </nav>
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
