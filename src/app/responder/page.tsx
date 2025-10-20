'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hospitals, emergencies as mockEmergencies, type Emergency } from '@/lib/data';
import { X } from 'lucide-react';
import { ClientTimestamp } from '@/components/client-timestamp';
import { useToast } from '@/hooks/use-toast';

const MapContainer = dynamic(() => import('@/components/map-container'), {
  ssr: false,
  loading: () => <div className="bg-background animate-pulse w-full h-full" />,
});

const NIGERIA_RIVERS_STATE_PORT_HARCOURT = {
  lat: 4.8156,
  lng: 7.0498,
};

type EmergencyWithId = Emergency & { id: string };

export default function ResponderPage() {
  const { toast } = useToast();
  
  const [emergencies, setEmergencies] = useState<EmergencyWithId[]>(mockEmergencies.map(e => ({...e, id: e.id})));
  const [isLoading, setIsLoading] = useState(false);


  const [responderPosition] = useState<[number, number]>([NIGERIA_RIVERS_STATE_PORT_HARCOURT.lat, NIGERIA_RIVERS_STATE_PORT_HARCOURT.lng]);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyWithId | null>(null);

  const handleSelectEmergency = (emergency: EmergencyWithId) => {
    setSelectedEmergency(emergency);
  };

  const handleAcceptRequest = () => {
    if (!selectedEmergency) return;

    // Simulate accepting the request by filtering it out from the local state
    setEmergencies(currentEmergencies => 
      currentEmergencies.filter(e => e.id !== selectedEmergency.id)
    );

    toast({
      title: 'Request Accepted',
      description: `You are now handling the request.`,
    });
    
    setSelectedEmergency(null);
  };

  const getPatientPosition = (): [number, number] | undefined => {
    if (!selectedEmergency) return undefined;
    return [selectedEmergency.patient.location.lat, selectedEmergency.patient.location.lng];
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
            <p className="text-muted-foreground">No pending emergencies for your hospital.</p>
          )}
          <div className="space-y-4">
            {emergencies?.map((emergency) => (
              <Card 
                key={emergency.id} 
                className={`cursor-pointer hover:bg-muted/50 ${selectedEmergency?.id === emergency.id ? 'border-primary' : ''}`}
                onClick={() => handleSelectEmergency(emergency)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Request from {emergency.patient.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{emergency.description || 'No message provided.'}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <ClientTimestamp timestamp={emergency.timestamp} />
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
              <p><strong>Patient:</strong> {selectedEmergency.patient.name}</p>
              <p><strong>Details:</strong> {selectedEmergency.description || "N/A"}</p>
              <Button className="w-full mt-4" onClick={handleAcceptRequest}>Accept Request</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
