'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isResponderView = pathname.startsWith('/responder');

  return (
    <footer className="py-4 px-6 text-center text-sm text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} Rapid Response. All rights reserved.</p>
      {isResponderView ? (
        <Link href="/" className="text-primary hover:underline">
          Switch to Patient View
        </Link>
      ) : (
        <Link href="/responder" className="text-primary hover:underline">
          Switch to Responder View
        </Link>
      )}
    </footer>
  );
}
