'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { User, Building2 } from 'lucide-react';
import type { Hospital } from '@/lib/data';

interface MapProps {
  patientPosition: { lat: number; lng: number };
  hospitals?: Hospital[];
  onHospitalSelect?: (hospital: Hospital) => void;
  selectedHospital?: Hospital | null;
  isResponderView?: boolean;
}

const createIcon = (icon: React.ReactElement) => {
    return L.divIcon({
      html: renderToStaticMarkup(icon),
      className: 'bg-transparent border-0',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
};

const userIcon = createIcon(
  <div className="relative flex flex-col items-center">
    <User className="w-8 h-8 text-white bg-primary rounded-full p-1.5 shadow-lg" />
    <div className="absolute top-full w-2 h-2 border-t-8 border-t-primary border-x-8 border-x-transparent border-solid"></div>
  </div>
);

const responderPatientIcon = createIcon(
  <div className="relative flex flex-col items-center">
    <User className="w-10 h-10 text-white bg-destructive rounded-full p-2 shadow-lg animate-pulse" />
    <div className="absolute top-full w-2 h-2 border-t-8 border-t-destructive border-x-8 border-x-transparent border-solid"></div>
  </div>
);

const hospitalIcon = createIcon(
    <div className="relative flex flex-col items-center">
        <div className="bg-card p-2 rounded-full shadow-xl">
            <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div className="absolute top-full w-2 h-2 border-t-8 border-t-card border-x-8 border-x-transparent border-solid"></div>
    </div>
);

const selectedHospitalIcon = createIcon(
    <div className="relative flex flex-col items-center">
        <div className="bg-primary p-2 rounded-full shadow-2xl scale-110">
            <Building2 className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="absolute top-full w-2 h-2 border-t-8 border-t-primary border-x-8 border-x-transparent border-solid"></div>
    </div>
);


export default function MapController({
  patientPosition,
  hospitals,
  onHospitalSelect,
  selectedHospital,
  isResponderView = false
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const hospitalMarkers = useRef<L.Marker[]>([]);
  const patientMarker = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: [patientPosition.lat, patientPosition.lng],
        zoom: 13,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []); // Run only once on mount to initialize map

  // Update map view based on selection or patient position change
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    
    const center: L.LatLngTuple = selectedHospital
      ? [selectedHospital.position.lat, selectedHospital.position.lng]
      : [patientPosition.lat, patientPosition.lng];
    const zoom = selectedHospital ? 14 : 13;
    map.setView(center, zoom, { animate: true });

  }, [patientPosition, selectedHospital]);

  // Update markers
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Update patient marker
    const currentPatientIcon = isResponderView ? responderPatientIcon : userIcon;
    if (patientMarker.current) {
      patientMarker.current.setLatLng([patientPosition.lat, patientPosition.lng]);
      patientMarker.current.setIcon(currentPatientIcon);
    } else {
      patientMarker.current = L.marker([patientPosition.lat, patientPosition.lng], { icon: currentPatientIcon })
        .addTo(map)
        .bindPopup('You are here');
    }
    
    // Clear and redraw hospital markers
    hospitalMarkers.current.forEach(marker => map.removeLayer(marker));
    hospitalMarkers.current = [];
    
    if(hospitals) {
        hospitals.forEach(hospital => {
            const icon = selectedHospital?.id === hospital.id ? selectedHospitalIcon : hospitalIcon;
            const marker = L.marker([hospital.position.lat, hospital.position.lng], { icon })
              .addTo(map)
              .bindPopup(hospital.name);
            
            if (onHospitalSelect) {
              marker.on('click', () => {
                onHospitalSelect(hospital);
              });
            }
            hospitalMarkers.current.push(marker);
        });
    }

  }, [patientPosition, hospitals, selectedHospital, onHospitalSelect, isResponderView]);
  

  return <div ref={mapRef} className="w-full h-full z-0" />;
}
