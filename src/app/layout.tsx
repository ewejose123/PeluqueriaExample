import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Barbería Elite - La Mejor Barbería en Totana",
  description: "Descubre la mejor experiencia de barbería en Totana. Cortes modernos, barba profesional y servicios de calidad. Reserva tu cita ahora.",
  keywords: "barbería, Totana, corte de pelo, barba, peluquería masculina, Murcia",
  authors: [{ name: "Barbería Elite" }],
  openGraph: {
    title: "Barbería Elite - La Mejor Barbería en Totana",
    description: "Descubre la mejor experiencia de barbería en Totana. Cortes modernos, barba profesional y servicios de calidad.",
    url: "https://barberiaelite.com",
    siteName: "Barbería Elite",
    images: [
      {
        url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Barbería Elite - Interior de la barbería",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barbería Elite - La Mejor Barbería en Totana",
    description: "Descubre la mejor experiencia de barbería en Totana. Cortes modernos, barba profesional y servicios de calidad.",
    images: ["https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
