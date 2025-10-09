'use client';

import { HeartPulse } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full h-full p-8 text-center bg-background">
      <div className="max-w-md">
        <HeartPulse className="w-24 h-24 mx-auto text-primary" />
        <h1 className="mt-6 text-4xl font-bold text-primary">
          Rapid Response
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your emergency medical response system. We're ready to build something great.
        </p>
      </div>
    </div>
  );
}
