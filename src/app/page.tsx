'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hospitals as hospitalData, type Hospital } from '@/lib/data';
import { HeartPulse, LocateFixed } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserNav } from '@/components/user-nav';
import { useFirebase } from '@/firebase';

const MapContainer = dynamic(() => import('@/components/map-container'), {
  ssr: false,
  loading: () => <div className="bg-background animate-pulse w-full h-full" />,
});

const NIGERIA_RIVERS_STATE_PORT_HARCOURT = {
  lat: 4.8156,
  lng: 7.0498,
};

export default function Home() {
  const { user } = useFirebase();
  const [patientPosition, setPatientPosition] = useState<[number, number] | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [hospitals] = useState<Hospital[]>(hospitalData);

  // Set default position on mount
  useState(() => {
    setPatientPosition([NIGERIA_RIVERS_STATE_PORT_HARCOURT.lat, NIGERIA_RIVERS_STATE_PORT_HARCOURT.lng]);
  });
  
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
          setPatientPosition([NIGERIA_RIVERS_STATE_PORT_HARCOURT.lat, NIGERIA_RIVERS_STATE_PORT_HARCOURT.lng]);
          setIsRequesting(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setPatientPosition([NIGERIA_RIVERS_STATE_PORT_HARCOURT.lat, NIGERIA_RIVERS_STATE_PORT_HARCOURT.lng]);
      setIsRequesting(false);
    }
  };
  
  const handleRecenter = () => {
    handleRequestEmergency();
  };

  return (
    <div className="flex h-full w-full flex-col relative overflow-hidden">
       <div className="absolute top-4 right-4 z-[1000] flex items-center gap-4">
        <UserNav />
      </div>

      <div className="w-full h-full">
        <MapContainer
          patientPosition={patientPosition}
          hospitals={hospitals}
          selectedHospital={selectedHospital}
        />
      </div>

      <motion.div 
        className="absolute bottom-0 left-0 right-0 z-[1000] p-4"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.2 }}
      >
        <Card className="w-full max-w-lg mx-auto shadow-2xl bg-card/80 backdrop-blur-lg border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <HeartPulse className="text-primary w-6 h-6" />
              <span className="text-xl">Request Assistance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
              In case of an emergency, tap the button below. Your location will be used to dispatch the nearest responder.
            </p>
            <Button
              size="lg"
              className="w-full py-6 text-lg font-bold"
              onClick={handleRequestEmergency}
              disabled={isRequesting || !user}
            >
              {isRequesting ? 'Getting Location...' : (user ? 'Request Emergency' : 'Login to Request Emergency')}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <Button
          size="icon"
          className="absolute top-20 right-4 z-[1000] bg-card/80 backdrop-blur-sm hover:bg-card border-border/50"
          variant="outline"
          onClick={handleRecenter}
          aria-label="Recenter map"
      >
          <LocateFixed className="w-5 h-5 text-primary" />
      </Button>
    </div>
  );
}
