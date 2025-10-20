'use client';

import { useState, useEffect } from 'react';

interface ClientTimestampProps {
  timestamp: string;
}

export function ClientTimestamp({ timestamp }: ClientTimestampProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // This code runs only on the client, after hydration
    setFormattedDate(new Date(timestamp).toLocaleString());
  }, [timestamp]);

  if (!formattedDate) {
    // Render a placeholder or nothing on the server and during initial client render
    return null;
  }

  return <>{formattedDate}</>;
}
