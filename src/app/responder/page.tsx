'use client';

import Image from 'next/image';
import { User, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { patientLocation } from '@/lib/data';
import placeholderData from '@/lib/placeholder-images.json';
import { motion } from 'framer-motion';

export default function ResponderPage() {
  const mapImage = placeholderData.placeholderImages.find((img) => img.id === 'map-background');

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-background">
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

        <motion.div
            key="map-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-md"
        >
            <h2 className="text-xl font-bold text-center text-primary">Incoming Emergency</h2>
            <p className="text-sm text-muted-foreground text-center">Patient location marked on map</p>
        </motion.div>

        {/* Patient Location Marker */}
        <motion.div
          className="absolute group"
          style={{ top: patientLocation.position.top, left: patientLocation.position.left }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
        >
          <User className="w-10 h-10 text-white bg-destructive rounded-full p-2 shadow-lg animate-pulse" />
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-md">
            Patient Location
          </div>
        </motion.div>
        
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="absolute bottom-0 left-0 right-0 p-4"
        >
            <Card className="max-w-md mx-auto bg-card/95 backdrop-blur-sm shadow-2xl border-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-primary" />
                        Patient Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p><strong>Status:</strong> En route</p>
                    <p><strong>Location:</strong> Near 50th and Main</p>
                    <p><strong>ETA:</strong> Calculating...</p>
                </CardContent>
            </Card>
        </motion.div>
      </div>
    </div>
  );
}
