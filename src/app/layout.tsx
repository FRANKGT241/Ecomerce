import "./globals.css";
import LayoutClient from './layout.client';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'COSTADENT Guatemala - Productos Dentales Premium',
  description: 'COSTADENT Guatemala ofrece productos dentales de alta calidad para profesionales y consumidores en todo el país. Explora nuestra gama de cepillos de dientes, hilo dental y soluciones de cuidado bucal.',
  keywords: 'productos dentales Guatemala, cuidado bucal Guatemala, cepillo de dientes Guatemala, hilo dental Guatemala, enjuague bucal, COSTADENT, productos dentales premium',
  openGraph: {
    title: 'COSTADENT Guatemala - Productos Dentales Premium',
    description: 'Descubre la gama de productos dentales de alta calidad de COSTADENT para una salud bucal óptima en Guatemala.',
    images: [
      {
        url: 'https://example.com/costadent-guatemala-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Productos dentales COSTADENT para Guatemala',
      }
    ],
    locale: 'es_GT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'COSTADENT Guatemala - Productos Dentales Premium',
    description: 'Explora la gama de productos dentales de alta calidad de COSTADENT para una salud bucal óptima en Guatemala.',
    images: ['https://example.com/costadent-guatemala-twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.costadent.com/gt',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head />
      <body>
        <LayoutClient> 
          {children}
        </LayoutClient>
      </body>
    </html>
  )
}