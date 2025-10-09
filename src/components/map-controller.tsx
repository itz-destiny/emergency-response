'use client';

import { useEffect, useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Hospital } from '@/lib/data';
import L, { Map } from 'leaflet';
import ReactDOMServer from 'react-dom/server';

const hospitalIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/3308/3308823.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const patientIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const responderIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/10469/10469907.png',
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

  useEffect(() => {
    if (patientPosition) {
      map.setView(patientPosition, 14);
    }
  }, [patientPosition, map]);

  useEffect(() => {
    if (selectedHospital) {
      map.setView([selectedHospital.location.lat, selectedHospital.location.lng], 15);
    }
  }, [selectedHospital, map]);

  useEffect(() => {
    if (responder?.position) {
        map.setView(responder.position, 14);
    }
  }, [responder, map]);

  useEffect(() => {
    // Clear existing markers to prevent duplicates
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    hospitals.forEach((hospital) => {
        const popupContent = ReactDOMServer.renderToString(
            <Popup>
              <b>{hospital.name}</b>
              <br />
              Beds: {hospital.availability.beds} | Ambulances: {hospital.availability.ambulances}
              <br />
              Hotline: {hospital.hotline}
            </Popup>
        );
        L.marker([hospital.location.lat, hospital.location.lng], { icon: hospitalIcon })
        .addTo(map)
        .bindPopup(popupContent);
    });

    if (patientPosition && !responder) {
        const popupContent = ReactDOMServer.renderToString(<Popup>Your current location</Popup>);
        L.marker(patientPosition, { icon: patientIcon })
        .addTo(map)
        .bindPopup(popupContent);
    }

    if (responder?.position) {
        const popupContent = ReactDOMServer.renderToString(<Popup>Your position</Popup>);
        L.marker(responder.position, { icon: responderIcon })
        .addTo(map)
        .bindPopup(popupContent);
    }
    
    if (responder?.patientPosition) {
        const popupContent = ReactDOMServer.renderToString(<Popup>Patient's Location</Popup>);
        L.marker(responder.patientPosition, { icon: responderPatientIcon })
        .addTo(map)
        .bindPopup(popupContent);
    }

  }, [hospitals, patientPosition, responder, map]);
  
  return null; // This component only controls the map, it doesn't render anything itself
}
