import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Coaching Parental | Alléger la charge mentale des mamans',
    template: '%s | Coaching Parental',
  },
  description:
    'Accompagnement personnalisé pour les parents avec une coach certifiée et une IA bienveillante disponible 24h/24. Sommeil, nutrition, comportement.',
  keywords: [
    'coach sommeil bébé',
    'coaching parental',
    'bébé ne dort pas',
    'consultant sommeil enfant',
    'accompagnement parental',
    'charge mentale maman',
  ],
  authors: [{ name: 'Coaching Parental' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Coaching Parental',
    title: 'Coaching Parental | Alléger la charge mentale des mamans',
    description:
      'Accompagnement personnalisé pour les parents avec une coach certifiée et une IA bienveillante disponible 24h/24.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coaching Parental | Alléger la charge mentale des mamans',
    description:
      'Accompagnement personnalisé pour les parents avec une coach certifiée et une IA bienveillante disponible 24h/24.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
