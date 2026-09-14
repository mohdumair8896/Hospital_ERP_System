import type { Metadata } from 'next';
import './globals.css';
import CookieConsentBanner from '../components/CookieConsentBanner';
import { Toaster } from 'sonner';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ProHealth Hospital & Academic Medical Center | Compassionate Healthcare',
    template: '%s | ProHealth Hospital'
  },
  description: 'ProHealth Academic Medical Center provides world-class clinical specialty care, robotic surgery, Level 1 Trauma 24/7, and patient-centered medicine.',
  keywords: [
    'hospital',
    'doctor appointment',
    'cardiology',
    'pediatrics',
    'emergency trauma',
    'robotic surgery',
    'neurology',
    'healthcare'
  ],
  authors: [{ name: 'ProHealth Hospital System' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'ProHealth Hospital & Academic Medical Center',
    title: 'ProHealth Hospital & Academic Medical Center',
    description: 'Premier healthcare institution featuring robotic surgery, Level 1 trauma, and cryptographic patient audit privacy.',
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Hospital',
  name: 'ProHealth Academic Medical Center',
  description: 'World-class academic medical center providing robotic surgery, cardiology, neurology, and Level 1 trauma care.',
  url: SITE_URL,
  telephone: '+1-555-019-2831',
  emergencyTelephone: '876-256-876',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Healthcare Blvd',
    addressLocality: 'New York',
    addressRegion: 'NY',
    postalCode: '10016',
    addressCountry: 'US'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '40.7484',
    longitude: '-73.9857'
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59'
    }
  ],
  medicalSpecialty: [
    'Cardiology',
    'EmergencyMedicine',
    'Neurology',
    'Obstetrics',
    'Pediatrics',
    'Orthopedics'
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 font-sans antialiased flex flex-col">
        <Toaster position="bottom-right" richColors />
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
