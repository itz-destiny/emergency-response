'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Building2, Phone, MapPin, AlertTriangle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { hospitals, patientLocation } from '@/lib/data';
import type { Hospital } from '@/lib/data';
import placeholderData from '@/lib/placeholder-images.json';
import { AnimatePresence, motion } from 'framer-motion';

type Step = 'request' | 'map' | 'details';

export default function Home() {
  const [step, setStep] = useState<Step>('request');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const mapImage = placeholderData.placeholderImages.find((img) => img.id === 'map-background');

  const handleRequestEmergency = () => {
    setStep('map');
  };

  const handleSelectHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setStep('details');
  };

  const handleBackToMap = () => {
    setSelectedHospital(null);
    setStep('map');
  };

  const renderStep = () => {
    switch (step) {
      case 'request':
        return (
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
              className="bg-accent hover:bg-accent/90 text-accent-foreground h-20 px-12 text-2xl rounded-full shadow-lg transform hover:scale-105 transition-transform"
            >
              Request Emergency
            </Button>
          </motion.div>
        );
      case 'map':
      case 'details':
        return (
          <div className="relative w-full h-full flex-grow overflow-hidden">
            {mapImage && (
              <Image
                src={mapImage.imageUrl}
                alt={mapImage.description}
                fill
                className="object-cover"
                data-ai-hint={mapImage.imageHint}
                priority
              />
            )}
            <div className="absolute inset-0 bg-black/30" />
            
            <AnimatePresence>
              {step === 'map' && (
                  <motion.div
                    key="map-title"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-md"
                  >
                    <h2 className="text-xl font-bold text-center">Select a Nearby Hospital</h2>
                  </motion.div>
              )}
            </AnimatePresence>
            
            {/* Patient Location */}
            <motion.div
              className="absolute group"
              style={{ top: patientLocation.position.top, left: patientLocation.position.left }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <User className="w-8 h-8 text-white bg-primary rounded-full p-1.5 shadow-lg" />
               <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-background text-foreground text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Your Location
              </div>
            </motion.div>

            {/* Hospital Markers */}
            {hospitals.map((hospital, index) => (
              <motion.div
                key={hospital.id}
                className="absolute group"
                style={{ top: hospital.position.top, left: hospital.position.left }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full shadow-xl w-12 h-12 bg-card hover:bg-card/90"
                  onClick={() => handleSelectHospital(hospital)}
                >
                  <Building2 className="w-6 h-6 text-primary" />
                </Button>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-background text-foreground text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {hospital.name}
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {step === 'details' && selectedHospital && (
                <motion.div
                  key="details-card"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 p-4"
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
                          <span>Distance: <strong>{selectedHospital.distance}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>Hotline: <strong>{selectedHospital.phone}</strong></span>
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
                        <Button variant="outline" onClick={handleBackToMap} className="w-full">
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
      default:
        return null;
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-background">
       <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
    </div>
  );
}
