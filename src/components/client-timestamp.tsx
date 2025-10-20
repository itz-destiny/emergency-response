'use client';

import { useState, useEffect } from 'react';

interface ClientTimestampProps {
  timestamp: any; // Can be a Firestore Timestamp object or an ISO string
}

export function ClientTimestamp({ timestamp }: ClientTimestampProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    let date;
    if (timestamp && typeof timestamp.toDate === 'function') {
      // It's a Firestore Timestamp
      date = timestamp.toDate();
    } else if (timestamp) {
      // It's likely an ISO string or Date object
      date = new Date(timestamp);
    }

    if (date) {
      setFormattedDate(date.toLocaleString());
    }
  }, [timestamp]);

  if (!formattedDate) {
    // Render a placeholder or nothing on the server and during initial client render
    return null;
  }

  return <>{formattedDate}</>;
}
