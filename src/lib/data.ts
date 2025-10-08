export interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  distance: string;
  position: {
    lat: number;
    lng: number;
  };
}

export const hospitals: Hospital[] = [
  {
    id: 1,
    name: 'City General Hospital',
    address: '123 Main St, Anytown, USA',
    phone: '555-123-4567',
    distance: '2.5 km',
    position: { lat: 34.052235, lng: -118.243683 },
  },
  {
    id: 2,
    name: 'St. Mary\'s Medical Center',
    address: '456 Oak Ave, Anytown, USA',
    phone: '555-987-6543',
    distance: '4.1 km',
    position: { lat: 34.062486, lng: -118.252723 },
  },
  {
    id: 3,
    name: 'Northside Community Clinic',
    address: '789 Pine Ln, Anytown, USA',
    phone: '555-555-1212',
    distance: '5.8 km',
    position: { lat: 34.045472, lng: -118.237433 },
  },
    {
    id: 4,
    name: 'Downtown Emergency Care',
    address: '101 Central Plaza, Anytown, USA',
    phone: '555-333-4444',
    distance: '1.2 km',
    position: { lat: 34.056092, lng: -118.236639 },
  },
];

export const patientLocation = {
  address: 'You are here',
  position: {
    lat: 34.0549,
    lng: -118.2426,
  },
};
