export interface InsuranceClaim {
  claimId?: number;  // SERIAL PRIMARY KEY, optional for new claims
  policyId: number;  // INT FOREIGN KEY REFERENCES Policy(policy_id) NOT NULL
  hospitalId: number;  // INT FOREIGN KEY REFERENCES Hospital(hospital_id)
  claimName?: string | null;  // From API response
  createdAt?: string;  // ISO date string from API
  remarks?: string;  // TEXT field for additional notes
  status?: string;  // PENDING, APPROVED, REJECTED, etc.
}