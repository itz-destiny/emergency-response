
export interface Hospital {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  hotline: string;
  availability: {
    beds: number;
    ambulances: number;
  };
}

export interface Emergency {
  id: string;
  patient: {
    name: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  description: string;
  status: 'pending' | 'dispatched' | 'resolved';
  timestamp: string;
}

export interface Request {
    userId: string;
    hospitalId: string;
    hospitalName: string;
    patientLocation: {
        lat: number;
        lng: number;
    };
    message: string;
    status: 'pending' | 'accepted' | 'enroute' | 'resolved' | 'cancelled';
    createdAt: any; // Firestore ServerTimestamp
}
