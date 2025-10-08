import { HeartPulse } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-4 px-6 bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <HeartPulse className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">
            Rapid Response
          </h1>
        </Link>
      </div>
    </header>
  );
}
