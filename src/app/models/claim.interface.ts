export interface InsuranceClaim {
  claim_id?: number;  // SERIAL PRIMARY KEY, optional for new claims
  policy_id: number;  // INT FOREIGN KEY REFERENCES Policy(policy_id) NOT NULL
  hospital_id: number;  // INT FOREIGN KEY REFERENCES Hospital(hospital_id)
  claim_date?: Date;  // DATE NOT NULL
  remarks?: string;  // TEXT field for additional notes
} 