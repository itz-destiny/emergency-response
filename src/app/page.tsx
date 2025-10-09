'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hospitals as hospitalData, type Hospital } from '@/lib/data';
import { HeartPulse, LocateFixed } from 'lucide-react';

const MapContainer = dynamic(() => import('@/components/map-container'), {
  ssr: false,
  loading: () => <div className="bg-muted animate-pulse w-full h-full" />,
});

const NIGERIA_RIVERS_STATE_PORT_HARCOURT = {
  lat: 4.8156,
  lng: 7.0498,
};

export default function Home() {
  const [patientPosition, setPatientPosition] = useState<[number, number] | null>([NIGERIA_RIVERS_STATE_PORT_HARCOURT.lat, NIGERIA_RIVERS_STATE_PORT_HARCOURT.lng]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [hospitals] = useState<Hospital[]>(hospitalData);

  const handleRequestEmergency = () => {
    setIsRequesting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPatientPosition([position.coords.latitude, position.coords.longitude]);
          setIsRequesting(false);
        },
        (error) => {
          console.error("Error getting user's location:", error);
          // Fallback to default location if user denies permission
          setPatientPosition([NIGERIA_RIVERS_STATE_PORT_HARCOURT.lat, NIGERIA_RIVERS_STATE_PORT_HARCOURT.lng]);
          setIsRequesting(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Fallback to default location
      setPatientPosition([NIGERIA_RIVERS_STATE_PORT_HARCOURT.lat, NIGERIA_RIVERS_STATE_PORT_HARCOURT.lng]);
      setIsRequesting(false);
    }
  };
  
  const handleRecenter = () => {
    handleRequestEmergency();
  };

  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      <div className="w-full md:w-1/3 h-1/2 md:h-full flex flex-col p-4">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="text-primary" />
              <span>Request Assistance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 justify-between">
            <p className="text-muted-foreground">
              In case of an emergency, click the button below. We will use your
              location to dispatch the nearest responder.
            </p>
            <Button
              size="lg"
              className="w-full"
              onClick={handleRequestEmergency}
              disabled={isRequesting}
            >
              {isRequesting ? 'Getting Location...' : 'Request Emergency'}
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="w-full md:w-2/3 h-1/2 md:h-full relative">
        <MapContainer
          patientPosition={patientPosition}
          hospitals={hospitals}
          selectedHospital={selectedHospital}
        />
        <Button
            size="icon"
            className="absolute bottom-4 right-4 z-[1000] bg-background/80 backdrop-blur-sm hover:bg-background"
            variant="outline"
            onClick={handleRecenter}
            aria-label="Recenter map"
        >
            <LocateFixed className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}