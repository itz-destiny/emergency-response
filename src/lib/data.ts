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

export const hospitals: Hospital[] = [
  {
    id: "UPTH001",
    name: "University of Port Harcourt Teaching Hospital",
    location: {
      lat: 4.8854,
      lng: 6.9208
    },
    hotline: "+234 803 123 4567",
    availability: {
      beds: 15,
      ambulances: 3
    }
  },
  {
    id: "BMH002",
    name: "Braithwaite Memorial Specialist Hospital",
    location: {
      lat: 4.7831,
      lng: 7.0139
    },
    hotline: "+234 802 987 6543",
    availability: {
      beds: 10,
      ambulances: 2
    }
  },
  {
    id: "KSH003",
    name: "Kelsey Harrison Hospital",
    location: {
      lat: 4.7935,
      lng: 7.0019
    },
    hotline: "+234 805 111 2222",
    availability: {
      beds: 8,
      ambulances: 1
    }
  },
  {
    id: "MPS004",
    name: "Meridian Hospitals",
    location: {
      lat: 4.8321,
      lng: 7.0079
    },
    hotline: "+234 809 555 8888",
    availability: {
      beds: 12,
      ambulances: 4
    }
  },
  {
    id: "ASH005",
    name: "Astra Medical Center",
    location: {
      lat: 4.8250,
      lng: 7.0351
    },
    hotline: "+234 807 444 3333",
    availability: {
      beds: 5,
      ambulances: 1
    }
  }
];

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

export const emergencies: Emergency[] = [
    {
        id: 'EMG001',
        patient: { name: 'John Doe', location: { lat: 4.8241, lng: 7.0322 } },
        description: 'Difficulty breathing',
        status: 'pending',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
        id: 'EMG002',
        patient: { name: 'Jane Smith', location: { lat: 4.7890, lng: 7.0050 } },
        description: 'Severe headache and dizziness',
        status: 'pending',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
        id: 'EMG003',
        patient: { name: 'Clementina Williams', location: { lat: 4.8800, lng: 6.9300 } },
        description: 'Fall from height',
        status: 'dispatched',
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    },
];