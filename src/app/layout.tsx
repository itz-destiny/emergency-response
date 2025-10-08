import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Rapid Response',
  description: 'Emergency medical response system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'font-body antialiased h-full flex flex-col',
          'bg-background'
        )}
      >
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Toaster />
        <footer className="py-4 px-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Rapid Response. All rights reserved.</p>
          <Link href="/responder" className="text-primary hover:underline">
            Switch to Responder View
          </Link>
        </footer>
      </body>
    </html>
  );
}
