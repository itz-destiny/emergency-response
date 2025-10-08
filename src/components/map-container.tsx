'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import { User, Building2 } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
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


const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const Map = ({ patientPosition, hospitals, onHospitalSelect, selectedHospital, isResponderView = false }: MapProps) => {

  const center: [number, number] = useMemo(() => {
    if (selectedHospital) {
      return [selectedHospital.position.lat, selectedHospital.position.lng];
    }
    return [patientPosition.lat, patientPosition.lng];
  }, [patientPosition, selectedHospital]);

  const zoom = selectedHospital ? 14 : 13;

  return (
    <LeafletMap
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} zoom={zoom} />
      
      <Marker position={[patientPosition.lat, patientPosition.lng]} icon={isResponderView ? responderPatientIcon : userIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {hospitals && hospitals.map((hospital) => (
        <Marker
          key={hospital.id}
          position={[hospital.position.lat, hospital.position.lng]}
          icon={selectedHospital?.id === hospital.id ? selectedHospitalIcon : hospitalIcon}
          eventHandlers={{
            click: () => {
              onHospitalSelect?.(hospital);
            },
          }}
        >
          <Popup>{hospital.name}</Popup>
        </Marker>
      ))}
    </LeafletMap>
  );
};

export default Map;
