'use client';

import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { patientLocation } from '@/lib/data';
import { motion } from 'framer-motion';

const MapController = dynamic(() => import('@/components/map-controller'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse" />,
});


export default function ResponderPage() {

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-background">
      <div className="relative w-full h-full flex-grow overflow-hidden">
        <MapController 
            patientPosition={patientLocation.position}
            isResponderView={true}
        />

        <motion.div
            key="map-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-md z-[1000]"
        >
            <h2 className="text-xl font-bold text-center text-primary">Incoming Emergency</h2>
            <p className="text-sm text-muted-foreground text-center">Patient location marked on map</p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="absolute bottom-0 left-0 right-0 p-4 z-[1000]"
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
