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

  useEffect(() => {
    // This effect runs only once on mount to initialize the map.
    // The key to fixing the "already initialized" error is to ensure Leaflet's L.map()
    // is called only once for the lifetime of the div.
    // We check if the mapRef div already has a leaflet instance.
    if (mapRef.current && !mapRef.current.hasAttribute('data-leaflet-id')) {
        mapRef.current.setAttribute('data-leaflet-id', 'map'); // Mark as initialized
        const initialCenter = props.patientPosition || [4.8156, 7.0498];
        const leafletMap = L.map(mapRef.current).setView(initialCenter, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(leafletMap);
        setMap(leafletMap);
    }
  }, []); // Empty dependency array ensures this runs only once.


  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%', zIndex: 0 }} />
      {map ? <MapController map={map} {...props} /> : null}
    </div>
  );
};

export default MapContainer;
