'use client';

import { useEffect } from 'react';
import { Hospital } from '@/lib/data';
import L, { Map } from 'leaflet';

const hospitalIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/color/48/hospital-3.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const patientIcon = new L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="relative flex items-center justify-center">
             <div class="absolute w-8 h-8 bg-primary/50 rounded-full animate-ping"></div>
             <div class="relative w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md"></div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

const responderIcon = new L.Icon({
    iconUrl: 'https://img.icons8.com/fluency/48/ambulance.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

const responderPatientIcon = new L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="relative flex items-center justify-center">
             <div class="absolute w-8 h-8 bg-red-500 rounded-full animate-ping"></div>
             <div class="relative w-5 h-5 bg-red-600 rounded-full border-2 border-white"></div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

interface MapControllerProps {
  map: Map;
  patientPosition: [number, number] | null;
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  responder?: {
    position: [number, number];
    patientPosition?: [number, number];
  };
}

export function MapController({
  map,
  patientPosition,
  hospitals,
  selectedHospital,
  responder,
}: MapControllerProps) {

  // Effect to update map view
  useEffect(() => {
    if (!map) return;
    if (selectedHospital) {
      map.flyTo([selectedHospital.location.lat, selectedHospital.location.lng], 15);
    } else if (patientPosition) {
      map.flyTo(patientPosition, 14);
    } else if (responder?.position) {
        map.flyTo(responder.position, 14);
    }
  }, [patientPosition, selectedHospital, responder?.position, map]);

  // Effect to update markers
  useEffect(() => {
    if (!map) return;
    // Clear existing markers to prevent duplicates
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    hospitals.forEach((hospital) => {
        const popupContent = `<div class="p-1"><h3 class="font-bold text-base mb-1">${hospital.name}</h3><p class="text-sm text-muted-foreground">Beds: ${hospital.availability.beds} | Ambulances: ${hospital.availability.ambulances}</p><p class="text-sm text-muted-foreground">Hotline: ${hospital.hotline}</p></div>`;
        L.marker([hospital.location.lat, hospital.location.lng], { icon: hospitalIcon })
        .addTo(map)
        .bindPopup(popupContent);
    });

    if (patientPosition && !responder) {
        L.marker(patientPosition, { icon: patientIcon })
        .addTo(map)
        .bindPopup('Your current location');
    }

    if (responder?.position) {
        L.marker(responder.position, { icon: responderIcon })
        .addTo(map)
        .bindPopup('Your position');
    }
    
    if (responder?.patientPosition) {
        L.marker(responder.patientPosition, { icon: responderPatientIcon })
        .addTo(map)
        .bindPopup("Patient's Location");
    }

  }, [hospitals, patientPosition, responder, map]);
  
  return null; // This component only controls the map, it doesn't render anything itself
}
