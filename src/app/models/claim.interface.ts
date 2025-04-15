export interface InsuranceClaim {
  claimId?: number;
  policyId: number;
  hospitalId: number;
  claimName?: string | null;
  createdAt?: string;
  remarks: string;
  status?: string;
}