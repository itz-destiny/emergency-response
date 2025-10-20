'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hospitals } from '@/lib/data';
import { X } from 'lucide-react';
import { ClientTimestamp } from '@/components/client-timestamp';
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { type Request as RequestType } from '@/lib/types';


const MapContainer = dynamic(() => import('@/components/map-container'), {
  ssr: false,
  loading: () => <div className="bg-background animate-pulse w-full h-full" />,
});

const NIGERIA_RIVERS_STATE_PORT_HARCOURT = {
  lat: 4.8156,
  lng: 7.0498,
};

export default function ResponderPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const requestsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'requests');
  }, [firestore]);

  const pendingRequestsQuery = useMemoFirebase(() => {
    if (!requestsCollection) return null;
    return query(requestsCollection, where('status', '==', 'pending'));
  }, [requestsCollection]);

  const { data: emergencies, isLoading } = useCollection<RequestType>(pendingRequestsQuery);

  const [responderPosition] = useState<[number, number]>([NIGERIA_RIVERS_STATE_PORT_HARCOURT.lat, NIGERIA_RIVERS_STATE_PORT_HARCOURT.lng]);
  const [selectedEmergency, setSelectedEmergency] = useState<RequestType & { id: string } | null>(null);

  const handleSelectEmergency = (emergency: RequestType & { id: string }) => {
    setSelectedEmergency(emergency);
  };

  const handleAcceptRequest = () => {
    if (!selectedEmergency) return;

    const requestRef = doc(firestore, 'requests', selectedEmergency.id);
    updateDocumentNonBlocking(requestRef, { status: 'accepted' });

    toast({
      title: 'Request Accepted',
      description: `You are now handling the request for ${selectedEmergency.hospitalName}.`,
    });
    
    setSelectedEmergency(null);
  };

  const getPatientPosition = (): [number, number] | undefined => {
    if (!selectedEmergency) return undefined;
    return [selectedEmergency.patientLocation.lat, selectedEmergency.patientLocation.lng];
  }

  return (
    <div className="flex h-full w-full">
      <div className="w-1/3 border-r border-border flex flex-col">
        <CardHeader>
          <CardTitle>Pending Emergencies</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          {isLoading && <p>Loading emergencies...</p>}
          {!isLoading && (!emergencies || emergencies.length === 0) && (
            <p className="text-muted-foreground">No pending emergencies.</p>
          )}
          <div className="space-y-4">
            {emergencies?.map((emergency) => (
              <Card 
                key={emergency.id} 
                className={`cursor-pointer hover:bg-muted/50 ${selectedEmergency?.id === emergency.id ? 'border-primary' : ''}`}
                onClick={() => handleSelectEmergency(emergency)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Request for {emergency.hospitalName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{emergency.message || 'No message provided.'}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <ClientTimestamp timestamp={emergency.createdAt} />
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </div>
      <div className="w-2/3 relative">
        <MapContainer
          hospitals={hospitals}
          patientPosition={responderPosition}
          responder={{
            position: responderPosition,
            patientPosition: getPatientPosition(),
          }}
        />
        {selectedEmergency && (
          <Card className="absolute top-4 left-4 z-[1000] bg-card/80 backdrop-blur-lg">
             <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Patient Details</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setSelectedEmergency(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p><strong>Hospital:</strong> {selectedEmergency.hospitalName}</p>
              <p><strong>Details:</strong> {selectedEmergency.message || "N/A"}</p>
              <Button className="w-full mt-4" onClick={handleAcceptRequest}>Accept Request</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
