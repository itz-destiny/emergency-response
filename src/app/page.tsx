'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Building2, Phone, MapPin, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { hospitals } from '@/lib/data';
import type { Hospital } from '@/lib/data';
import { AnimatePresence, motion } from 'framer-motion';
import { useFirebase, initiateAnonymousSignIn, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';

const MapController = dynamic(() => import('@/components/map-controller'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse" />,
});

export default function Home() {
  const [showMap, setShowMap] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  const [patientLocation, setPatientLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { firestore, auth } = useFirebase();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (auth && !user && !isUserLoading) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user, isUserLoading]);

  const handleRequestEmergency = () => {
    if (!user) {
      setError("Not authenticated. Please wait a moment and try again.");
      if (auth) initiateAnonymousSignIn(auth);
      return;
    }

    setIsLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPatientLocation = { lat: latitude, lng: longitude };
        setPatientLocation(newPatientLocation);
        setShowMap(true);
        setIsLocating(false);

        if (firestore) {
          const emergenciesCol = collection(firestore, 'emergencies');
          addDocumentNonBlocking(emergenciesCol, {
            location: newPatientLocation,
            status: 'requested',
            createdAt: serverTimestamp(),
            userId: user.uid,
          });
        }
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
        setIsLocating(false);
        // Fallback to default location for demo purposes
        const fallbackLocation = { lat: 6.465422, lng: 3.406448 };
        setPatientLocation(fallbackLocation);
        setShowMap(true);
        if (firestore) {
          const emergenciesCol = collection(firestore, 'emergencies');
          addDocumentNonBlocking(emergenciesCol, {
            location: fallbackLocation,
            status: 'requested',
            createdAt: serverTimestamp(),
            userId: user.uid,
          });
        }
      }
    );
  };

  if (!showMap) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-background">
        <motion.div
          key="request"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center h-full p-4"
        >
          <AlertTriangle className="w-24 h-24 text-destructive mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
            Emergency Assistance Needed?
          </h1>
          <p className="text-muted-foreground max-w-md mb-8">
            Press the button below to share your location and find the nearest
            hospitals.
          </p>
          <Button
            size="lg"
            onClick={handleRequestEmergency}
            disabled={isLocating || isUserLoading}
            className="bg-accent hover:bg-accent/90 text-accent-foreground h-20 px-12 text-2xl rounded-full shadow-lg transform hover:scale-105 transition-transform"
          >
            {isLocating || isUserLoading ? <Loader2 className="animate-spin" /> : 'Request Emergency'}
          </Button>
          {error && <p className="text-destructive mt-4">{error}</p>}
          {!user && isUserLoading && <p className="text-muted-foreground mt-4">Initializing...</p>}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex-grow overflow-hidden">
      {patientLocation && (
        <MapController
          patientPosition={patientLocation}
          hospitals={hospitals}
          onHospitalSelect={setSelectedHospital}
          selectedHospital={selectedHospital}
        />
      )}

      <AnimatePresence>
        {!selectedHospital && (
          <motion.div
            key="map-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-md z-[1000]"
          >
            <h2 className="text-xl font-bold text-center">
              Select a Nearby Hospital
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedHospital && (
          <motion.div
            key="details-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 p-4 z-[1000]"
          >
            <Card className="max-w-md mx-auto bg-card/95 backdrop-blur-sm shadow-2xl border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-primary" />
                  {selectedHospital.name}
                </CardTitle>
                <CardDescription>{selectedHospital.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>
                      Distance: <strong>{selectedHospital.distance}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>
                      Hotline: <strong>{selectedHospital.phone}</strong>
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    asChild
                  >
                    <a href={`tel:${selectedHospital.phone}`}>
                      <Phone className="mr-2" /> Call Hotline
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedHospital(null)}
                    className="w-full"
                  >
                    Back to Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
