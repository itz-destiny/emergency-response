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
    name: 'Lagos University Teaching Hospital (LUTH)',
    address: 'Idi-Araba, Mushin, Lagos',
    phone: '+234 1 585 0697',
    distance: '8.5 km',
    position: { lat: 6.5193, lng: 3.3639 },
  },
  {
    id: 2,
    name: 'St. Nicholas Hospital',
    address: '57 Campbell St, Lagos Island, Lagos',
    phone: '+234 1 277 5650',
    distance: '2.1 km',
    position: { lat: 6.4520, lng: 3.3934 },
  },
  {
    id: 3,
    name: 'Reddington Hospital, Victoria Island',
    address: '12 Idowu Martins St, Victoria Island, Lagos',
    phone: '+234 1 271 5341',
    distance: '4.8 km',
    position: { lat: 6.4295, lng: 3.4226 },
  },
  {
    id: 4,
    name: 'EKO Hospital',
    address: '31 Mobolaji Bank Anthony Way, Ikeja, Lagos',
    phone: '+234 1 271 6900',
    distance: '15.2 km',
    position: { lat: 6.5968, lng: 3.3482 },
  },
];

export const patientLocation = {
  address: 'You are here',
  position: {
    lat: 6.465422,
    lng: 3.406448,
  },
};