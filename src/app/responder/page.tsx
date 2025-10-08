'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, List, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  useCollection,
  useFirebase,
  useMemoFirebase,
} from '@/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  doc,
} from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { formatDistanceToNow } from 'date-fns';

const MapController = dynamic(() => import('@/components/map-controller'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse" />,
});

interface Emergency {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'requested' | 'accepted' | 'resolved';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function ResponderPage() {
  const { firestore } = useFirebase();
  const [selectedEmergency, setSelectedEmergency] =
    useState<Emergency | null>(null);

  const emergenciesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'emergencies'),
      where('status', 'in', ['requested', 'accepted']),
      orderBy('createdAt', 'desc')
    );
  }, [firestore]);

  const {
    data: emergencies,
    isLoading,
    error,
  } = useCollection<Emergency>(emergenciesQuery);

  const handleAcceptEmergency = (emergencyId: string) => {
    if (!firestore) return;
    const emergencyRef = doc(firestore, 'emergencies', emergencyId);
    updateDocumentNonBlocking(emergencyRef, { status: 'accepted' });
  };

  const patientPosition = selectedEmergency
    ? {
        lat: selectedEmergency.location.lat,
        lng: selectedEmergency.location.lng,
      }
    : null;

  return (
    <div className="w-full h-full flex-grow flex">
      {/* Sidebar for emergencies */}
      <aside className="w-1/3 max-w-sm h-full border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <List /> Active Emergencies
          </h2>
        </div>
        <ScrollArea className="flex-1">
          {isLoading && <p className="p-4">Loading emergencies...</p>}
          {error && <p className="p-4 text-destructive">Error loading emergencies.</p>}
          {emergencies && emergencies.length === 0 && (
            <p className="p-4 text-muted-foreground">No active emergencies.</p>
          )}
          <div className="flex flex-col">
            {emergencies?.map((emergency) => (
              <button
                key={emergency.id}
                onClick={() => setSelectedEmergency(emergency)}
                className={cn(
                  'text-left p-4 border-b hover:bg-muted transition-colors',
                  selectedEmergency?.id === emergency.id && 'bg-primary/10'
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={cn(
                      'font-bold text-sm flex items-center gap-1',
                      emergency.status === 'requested'
                        ? 'text-destructive'
                        : 'text-amber-600'
                    )}
                  >
                    {emergency.status === 'requested' ? (
                      <AlertCircle size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                    {emergency.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(
                      new Date(emergency.createdAt.seconds * 1000),
                      { addSuffix: true }
                    )}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  ID: {emergency.id}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main content with map and details */}
      <main className="flex-1 h-full relative">
        {patientPosition ? (
          <MapController
            patientPosition={patientPosition}
            isResponderView={true}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center">
              <MapPin className="mx-auto w-16 h-16 text-muted-foreground" />
              <h3 className="mt-2 text-xl font-medium text-muted-foreground">
                Select an emergency
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose an incident from the list to view details and location.
              </p>
            </div>
          </div>
        )}

        {selectedEmergency && (
          <div className="absolute bottom-0 left-0 right-0 p-4 z-[1000]">
            <Card className="max-w-lg mx-auto bg-card/95 backdrop-blur-sm shadow-2xl border-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Emergency Details
                  <span
                    className={cn(
                      'text-sm font-semibold px-2 py-1 rounded-full flex items-center gap-1',
                      selectedEmergency.status === 'requested'
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-amber-500/10 text-amber-600'
                    )}
                  >
                    {selectedEmergency.status === 'requested' ? (
                      <AlertCircle size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                    {selectedEmergency.status.toUpperCase()}
                  </span>
                </CardTitle>
                <CardDescription>
                  ID: {selectedEmergency.id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  <strong>Received:</strong>{' '}
                  {formatDistanceToNow(
                    new Date(selectedEmergency.createdAt.seconds * 1000),
                    { addSuffix: true }
                  )}
                </p>
                {selectedEmergency.status === 'requested' && (
                  <Button
                    className="w-full bg-accent hover:bg-accent/90"
                    onClick={() => handleAcceptEmergency(selectedEmergency.id)}
                  >
                    <CheckCircle className="mr-2" /> Accept Emergency
                  </Button>
                )}
                {selectedEmergency.status === 'accepted' && (
                  <Button className="w-full" disabled>
                    <CheckCircle className="mr-2" /> You have accepted this
                    emergency
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
