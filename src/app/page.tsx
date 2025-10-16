'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hospitals as hospitalData, type Hospital } from '@/lib/data';
import { HeartPulse, LocateFixed, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserNav } from '@/components/user-nav';
import { useFirebase, addDocumentNonBlocking, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, serverTimestamp } from 'firebase/firestore';

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
  const firestore = useFirestore();
  const { toast } = useToast();
  const [patientPosition, setPatientPosition] = useState<[number, number] | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [hospitals] = useState<Hospital[]>(hospitalData);

  // Set default position on mount
  useState(() => {
    setPatientPosition([NIGERIA_RIVERS_STATE_PORT_HARCOURT.lat, NIGERIA_RIVERS_STATE_PORT_HARCOURT.lng]);
  });
  
  const handleRequestEmergency = () => {
    if (!user) {
      toast({ title: 'Please log in', description: 'You must be logged in to make a request.' });
      return;
    }
    if (!selectedHospital || !patientPosition) {
      toast({ title: 'No hospital selected', description: 'Please select a hospital from the map first.' });
      return;
    }

    setIsRequesting(true);
    const requestsCollection = collection(firestore, 'requests');
    const newRequest = {
      userId: user.uid,
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.name,
      patientLocation: {
        lat: patientPosition[0],
        lng: patientPosition[1],
      },
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    // Non-blocking write to Firestore
    addDocumentNonBlocking(requestsCollection, newRequest);

    toast({
      title: 'Request Sent!',
      description: `Your emergency request has been sent to ${selectedHospital.name}.`,
    });

    // Reset UI after a short delay
    setTimeout(() => {
      setSelectedHospital(null);
      setIsRequesting(false);
    }, 2000);
  };
  
  const handleRecenter = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPatientPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting user's location:", error);
          toast({ variant: 'destructive', title: 'Location Error', description: "Could not get your current location."})
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast({ variant: 'destructive', title: 'Location Error', description: "Geolocation is not supported by this browser."})
    }
  };

  const handleSelectHospital = (hospital: Hospital | null) => {
    setSelectedHospital(hospital);
  }

  const renderCardContent = () => {
    if (selectedHospital) {
      return (
        <>
          <CardTitle className="flex items-center gap-3">
            <Building className="text-primary w-6 h-6" />
            <span className="text-xl">{selectedHospital.name}</span>
          </CardTitle>
          <CardContent className="flex flex-col gap-4 pt-4">
             <p className="text-sm text-muted-foreground">
              Beds: {selectedHospital.availability.beds} | Ambulances: {selectedHospital.availability.ambulances}
            </p>
            <Button
              size="lg"
              className="w-full py-6 text-lg font-bold"
              onClick={handleRequestEmergency}
              disabled={isRequesting || !user}
            >
              {isRequesting ? 'Sending...' : `Send Request to ${selectedHospital.name}`}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedHospital(null)}>Cancel</Button>
          </CardContent>
        </>
      )
    }

    return (
      <>
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <HeartPulse className="text-primary w-6 h-6" />
              <span className="text-xl">Request Assistance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
              Select a hospital on the map to send an emergency request.
            </p>
             <Button
              size="lg"
              className="w-full py-6 text-lg font-bold"
              disabled={true}
            >
              Select a Hospital
            </Button>
          </CardContent>
      </>
    )
  }

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
          onSelectHospital={handleSelectHospital}
        />
      </div>

      <motion.div 
        className="absolute bottom-0 left-0 right-0 z-[1000] p-4"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.2 }}
      >
        <Card className="w-full max-w-lg mx-auto shadow-2xl bg-card/80 backdrop-blur-lg border-border/50">
          {renderCardContent()}
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
