'use client';

import { useState, useEffect, useRef } from 'react';
import type { Map } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { MapController } from './map-controller';
import { type Hospital } from '@/lib/data';

interface MapContainerProps {
  patientPosition: [number, number] | null;
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  responder?: {
    position: [number, number];
    patientPosition?: [number, number];
  };
}

const MapContainer = (props: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const { patientPosition } = props;

  useEffect(() => {
    if (mapRef.current && !map) {
      const initialCenter = patientPosition || [4.8156, 7.0498];
      const leafletMap = L.map(mapRef.current).setView(initialCenter, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap);
      setMap(leafletMap);
    }

    // Cleanup function to destroy the map instance
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, []); // Run only once on mount

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%', zIndex: 0 }} />
      {map ? <MapController map={map} {...props} /> : null}
    </div>
  );
};

export default MapContainer;
