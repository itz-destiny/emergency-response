'use client';

import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { MapController } from './map-controller';
import { Hospital } from '@/lib/data';

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
  const { patientPosition } = props;
  const initialCenter = patientPosition || [4.8156, 7.0498];

  return (
    <LeafletMapContainer
      center={initialCenter}
      zoom={13}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController {...props} />
    </LeafletMapContainer>
  );
};

export default MapContainer;