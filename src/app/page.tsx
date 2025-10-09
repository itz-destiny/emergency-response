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

const MapController = dynamic(() => import('@/components/map-controller'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse" />,
});

export default function Home() {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  // Initialize with a default location in Port Harcourt, Nigeria
  const [patientLocation, setPatientLocation] = useState<{
    lat: number;
    lng: number;
  } | null>({ lat: 4.8156, lng: 7.0498 });
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPatientLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
      },
      (err) => {
        setError(`Could not get your location. Showing default location.`);
        // The location is already defaulted, so we just stop the loading indicator.
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return (
    <div className="relative w-full h-full flex-grow overflow-hidden">
      {patientLocation ? (
        <MapController
          patientPosition={patientLocation}
          hospitals={hospitals}
          onHospitalSelect={setSelectedHospital}
          selectedHospital={selectedHospital}
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
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
              Nearby Hospitals in Port Harcourt
            </h2>
             {isLocating && <p className="text-xs text-center text-muted-foreground animate-pulse">Getting your current location...</p>}
             {error && <p className="text-xs text-center text-destructive">{error}</p>}
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
