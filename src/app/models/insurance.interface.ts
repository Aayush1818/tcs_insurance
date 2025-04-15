export interface InsurancePolicy {
  policyId: number;
  policyName: string;
  policyType: string;
  coverage: number;  
  premium: number;  // INT NOT NULL CHECK (premium > 0)
  duration_years: number;  // INT NOT NULL CHECK (duration_years > 0)
} 