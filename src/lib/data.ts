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

// Data centered around Port Harcourt, Rivers State, Nigeria
export const hospitals: Hospital[] = [
  {
    id: 1,
    name: 'University of Port Harcourt Teaching Hospital (UPTH)',
    address: 'East West Rd, Choba, Port Harcourt',
    phone: '+234 812 123 4567',
    distance: '11.2 km',
    position: { lat: 4.908, lng: 6.923 },
  },
  {
    id: 2,
    name: 'Rivers State University Teaching Hospital (RSUTH)',
    address: 'BMSH, 2 B Hospital Road, Port Harcourt',
    phone: '+234 809 987 6543',
    distance: '3.5 km',
    position: { lat: 4.781, lng: 7.002 },
  },
  {
    id: 3,
    name: 'Kelsey Harrison Hospital',
    address: 'Emenike Street, Diobu, Port Harcourt',
    phone: '+234 905 555 8888',
    distance: '4.1 km',
    position: { lat: 4.775, lng: 7.011 },
  },
  {
    id: 4,
    name: 'Meridian Hospital',
    address: '21 Igbodo street, Old G.R.A, Port Harcourt',
    phone: '+234 803 123 9876',
    distance: '5.6 km',
    position: { lat: 4.832, lng: 7.014 },
  },
];
