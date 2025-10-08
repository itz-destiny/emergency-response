export interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  distance: string;
  position: {
    top: string;
    left: string;
  };
}

export const hospitals: Hospital[] = [
  {
    id: 1,
    name: 'City General Hospital',
    address: '123 Main St, Anytown, USA',
    phone: '555-123-4567',
    distance: '2.5 km',
    position: { top: '30%', left: '25%' },
  },
  {
    id: 2,
    name: 'St. Mary\'s Medical Center',
    address: '456 Oak Ave, Anytown, USA',
    phone: '555-987-6543',
    distance: '4.1 km',
    position: { top: '65%', left: '40%' },
  },
  {
    id: 3,
    name: 'Northside Community Clinic',
    address: '789 Pine Ln, Anytown, USA',
    phone: '555-555-1212',
    distance: '5.8 km',
    position: { top: '45%', left: '70%' },
  },
    {
    id: 4,
    name: 'Downtown Emergency Care',
    address: '101 Central Plaza, Anytown, USA',
    phone: '555-333-4444',
    distance: '1.2 km',
    position: { top: '75%', left: '80%' },
  },
];

export const patientLocation = {
  address: 'You are here',
  position: {
    top: '50%',
    left: '50%',
  },
};
