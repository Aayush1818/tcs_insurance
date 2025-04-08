import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InsuranceClaim } from '../../models/claim.interface';
import { InsurancePolicy } from '../../models/insurance.interface';
import { Hospital } from '../../models/hospital.interface';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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

  constructor(private fb: FormBuilder) {
    this.claimForm = this.fb.group({
      policy_id: ['', [Validators.required, Validators.min(1)]],
      hospital_id: ['', [Validators.required, Validators.min(1)]],
      remarks: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.loadMockPolicies();
    this.loadMockHospitals();
    this.loadMockClaims();
  }

  private loadMockClaims(): void {
    // Mock data with SERIAL claim_id and FOREIGN KEY references
    this.claims = [
      {
        claim_id: 1,  // SERIAL starts from 1
        policy_id: 1,  // INT FOREIGN KEY REFERENCES Policy(policy_id)
        hospital_id: 1,
        remarks: 'Regular checkup'
      },
      {
        claim_id: 2,  // SERIAL auto-increments
        policy_id: 2,  // INT FOREIGN KEY REFERENCES Policy(policy_id)
        hospital_id: 2,
        remarks: 'Emergency visit'
      }
    ];
  }

  private loadMockPolicies(): void {
    // These policies are referenced by claims via policy_id FOREIGN KEY
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

  private loadMockHospitals(): void {
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
      
      // Simulate API call delay
      setTimeout(() => {
        const formValue = this.claimForm.value;
        
        // In a real application, the backend would handle the SERIAL
        const newId = this.claims.length > 0 
          ? Math.max(...this.claims.map(c => c.claim_id || 0)) + 1 
          : 1;
        
        const claimToAdd: InsuranceClaim = {
          ...formValue,
          claim_id: newId
        };
        
        this.claims.push(claimToAdd);
        this.closeNewClaimForm();
        this.isSubmitting = false;
        
        // Show success message (in a real app, you'd use a toast or notification service)
        alert('Claim added successfully!');
      }, 500);
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
}
