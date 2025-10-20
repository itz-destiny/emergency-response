'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { emergencies as mockEmergencies, type Emergency, hospitals } from '@/lib/data';
import { List, MapIcon, X } from 'lucide-react';

const MapContainer = dynamic(() => import('@/components/map-container'), {
  ssr: false,
  loading: () => <div className="bg-background animate-pulse w-full h-full" />,
});

const NIGERIA_RIVERS_STATE_PORT_HARCOURT = {
  lat: 4.8156,
  lng: 7.0498,
};

export default function ResponderPage() {
  const [responderPosition] = useState<[number, number]>([NIGERIA_RIVERS_STATE_PORT_HARCOURT.lat, NIGERIA_RIVERS_STATE_PORT_HARCOURT.lng]);
  const [emergencies] = useState<Emergency[]>(mockEmergencies);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(emergencies[0] || null);
  const [view, setView] = useState<'map' | 'list'>('map');

  const handleSelectEmergency = (emergency: Emergency) => {
    setSelectedEmergency(emergency);
    setView('map');
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
          <div className="space-y-4">
            {emergencies.map((emergency) => (
              <Card 
                key={emergency.id} 
                className={`cursor-pointer hover:bg-muted/50 ${selectedEmergency?.id === emergency.id ? 'border-primary' : ''}`}
                onClick={() => handleSelectEmergency(emergency)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{emergency.patient.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{emergency.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(emergency.timestamp).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </div>
      <div className="w-2/3 relative">
        <MapContainer
          hospitals={hospitals}
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
              <p><strong>Name:</strong> {selectedEmergency.patient.name}</p>
              <p><strong>Condition:</strong> {selectedEmergency.description}</p>
              <Button className="w-full mt-4">Accept Request</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
