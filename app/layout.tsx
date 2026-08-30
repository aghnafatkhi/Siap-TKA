import type { Metadata, Viewport } from 'next';
import './globals.css';
import Shell from '@/components/Shell';

export const metadata: Metadata = {
  title: 'Siap TKA',
  description: 'Aplikasi belajar mandiri TKA SMA',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Siap TKA',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 antialiased" suppressHydrationWarning>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
