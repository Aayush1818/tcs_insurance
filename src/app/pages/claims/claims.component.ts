import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InsuranceClaim } from '../../models/claim.interface';
import { InsurancePolicy } from '../../models/insurance.interface';
import { Hospital } from '../../models/hospital.interface';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit {
  claims: InsuranceClaim[] = [];
  selectedClaim: InsuranceClaim | null = null;
  policies: InsurancePolicy[] = [];
  hospitals: Hospital[] = [];
  
  claimForm: FormGroup;
  showNewClaimForm = false;
  isSubmitting = false;
  apiBaseUrl = 'http://localhost:8080/insurance-management-system';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.claimForm = this.fb.group({
      policyId: ['', [Validators.required, Validators.min(1)]],
      hospitalId: ['', [Validators.required, Validators.min(1)]],
      remarks: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.loadPolicies();
    this.loadHospitals();
    this.loadClaims();
  }

  private loadClaims(): void {
    this.http.get<InsuranceClaim[]>(`${this.apiBaseUrl}/claims`)
      .subscribe({
        next: (data) => {
          this.claims = data;
        },
        error: (error) => {
          console.error('Error loading claims:', error);
          // Fallback to mock data if API call fails
          this.loadMockClaims();
        }
      });
  }

  private loadMockClaims(): void {
    // Mock data with updated field names to match API response
    this.claims = [
      {
        claimId: 1,
        policyId: 1,
        hospitalId: 1,
        claimName: null,
        createdAt: "2025-04-08T20:30:24.415343",
        remarks: 'Regular checkup',
        status: 'PENDING'
      },
      {
        claimId: 2,
        policyId: 2,
        hospitalId: 2,
        claimName: null,
        createdAt: "2025-04-08T20:30:24.415343",
        remarks: 'Emergency visit',
        status: 'APPROVED'
      }
    ];
  }

  private loadPolicies(): void {
    // In a real app, you would fetch this from an API endpoint
    // For now, using mock data
    this.policies = [
      {
        policy_id: 1,
        policy_name: 'Health Insurance Policy',
        policy_type: 'health',
        premium: 500,
        coverage: 50000,
        duration_years: 2
      },
      {
        policy_id: 2,
        policy_name: 'Life Insurance Policy',
        policy_type: 'life',
        premium: 300,
        coverage: 100000,
        duration_years: 5
      }
    ];
  }

  private loadHospitals(): void {
    // In a real app, you would fetch this from an API endpoint
    this.hospitals = [
      {
        hospital_id: 1,
        name: 'City General Hospital',
        location: '123 Main Street, City',
        discount: 10,
        contact_email: 'city@hospital.com',
        phone_number: '1234567890',
        created_at: new Date('2024-01-01')
      },
      {
        hospital_id: 2,
        name: 'Private Care Hospital',
        location: '456 Health Avenue, City',
        discount: 15,
        contact_email: 'private@hospital.com',
        phone_number: '9876543210',
        created_at: new Date('2024-02-01')
      }
    ];
  }

  openNewClaimForm(): void {
    this.showNewClaimForm = true;
    this.claimForm.reset();
    this.isSubmitting = false;
    
    // Use a simpler approach to show the modal
    const modalElement = document.getElementById('newClaimModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
      
      // Add backdrop
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  closeNewClaimForm(): void {
    this.showNewClaimForm = false;
    this.claimForm.reset();
    this.isSubmitting = false;
    
    // Hide the modal
    const modalElement = document.getElementById('newClaimModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
      
      // Remove backdrop
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    }
  }

  addClaim(): void {
    if (this.claimForm.valid) {
      this.isSubmitting = true;
      
      const newClaim: InsuranceClaim = {
        policyId: this.claimForm.value.policyId,
        hospitalId: this.claimForm.value.hospitalId,
        remarks: this.claimForm.value.remarks,
        // status and claimName will be set by the backend
      };
      
      this.http.post<InsuranceClaim>(`${this.apiBaseUrl}/claims`, newClaim)
        .subscribe({
          next: (response) => {
            // Add the new claim to the list
            this.claims.push(response);
            this.closeNewClaimForm();
            // Show success message (in a real app, use a toast service)
            alert('Claim added successfully!');
          },
          error: (error) => {
            console.error('Error adding claim:', error);
            alert('Failed to add claim. Please try again.');
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
    } else {
      this.markFormGroupTouched(this.claimForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.claimForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) return `${controlName} is required`;
      if (control.errors['min']) return `${controlName} must be greater than 0`;
      if (control.errors['minlength']) return `${controlName} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.claimForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  viewClaimDetails(claim: InsuranceClaim): void {
    this.selectedClaim = claim;
    
    // Use the same approach to show the modal
    const modalElement = document.getElementById('claimDetailsModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
      
      // Add backdrop
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  closeClaimDetailsModal(): void {
    this.selectedClaim = null;
    
    // Hide the modal
    const modalElement = document.getElementById('claimDetailsModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
      
      // Remove backdrop
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    }
  }

  // Helper method to format date
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }
}