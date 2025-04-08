export interface Hospital {
  hospital_id?: number;  // Optional since it's auto-generated
  name: string;
  location: string;
  discount: number;
  contact_email: string;  // VARCHAR UNIQUE, NOT NULL
  phone_number: string;   // VARCHAR NOT NULL
  created_at?: Date;      // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
} 