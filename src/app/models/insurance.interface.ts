export interface InsurancePolicy {
  policy_id?: number;  // Optional since it's auto-generated
  policy_name: string;
  policy_type: string;
  premium: number;
  coverage: number;
  duration_years: number;  // INT NOT NULL CHECK (duration_years > 0)
} 