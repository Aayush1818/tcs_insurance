import { Component, OnInit, HostListener } from '@angular/core';
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
  selectedPolicy: InsurancePolicy | null = null;
  selectedHospital: Hospital | null = null;
  policies: InsurancePolicy[] = [];
  filteredPolicies: InsurancePolicy[] = [];
  hospitals: Hospital[] = [];
  filteredHospitals: Hospital[] = [];
  
  claimForm: FormGroup;
  showNewClaimForm = false;
  isSubmitting = false;
  showPolicySuggestions = false;
  showHospitalSuggestions = false;
  apiBaseUrl = 'http://localhost:8080/insurance-management-system';

  constructor(private fb: FormBuilder, private http: HttpClient) {
  this.claimForm = this.fb.group({
    policyId: ['', [Validators.required]],
    hospitalId: ['', [Validators.required]],
    remarks: ['', [Validators.required, Validators.minLength(3)]]
  });
}


  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.policy-suggestions') && !target.closest('#policyId')) {
      this.showPolicySuggestions = false;
    }
    if (!target.closest('.hospital-suggestions') && !target.closest('#hospitalId')) {
      this.showHospitalSuggestions = false;
    }
  }

ngOnInit(): void {
  // Load master data first
  this.loadPolicies();
  this.loadHospitals();
  
  // Then load claims that depend on the master data
  setTimeout(() => {
    this.loadClaims();
  }, 500);
  
  // Debug: Monitor form value changes
  this.claimForm.valueChanges.subscribe(values => {
    console.log('Form values:', values);
  });
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
  this.http.get<InsurancePolicy[]>(`${this.apiBaseUrl}/policy`)
    .subscribe({
      next: (data) => {
        console.log('Loaded policies:', data); // Debug output
        this.policies = data;
        this.filteredPolicies = [...this.policies];
        
        // After loading policies, check if the names can be retrieved
        if (this.claims.length > 0) {
          console.log('Test policy name retrieval:', 
            this.getPolicyName(this.claims[0].policyId));
        }
      },
      error: (error) => {
        console.error('Error loading policies:', error);
        // Load mock data as fallback
     
      }
    });
}



private loadHospitals(): void {
  this.http.get<Hospital[]>(`${this.apiBaseUrl}/hospitals`)
    .subscribe({
      next: (data) => {
        console.log('Loaded hospitals:', data); // Debug output
        this.hospitals = data;
        this.filteredHospitals = [...this.hospitals];
      },
      error: (error) => {
        console.error('Error loading hospitals:', error);
        // Use mock data as fallback
      
      }
    });
}


  openNewClaimForm(): void {
    this.showNewClaimForm = true;
    this.claimForm.reset();
    this.isSubmitting = false;
    
    // Reset filtered lists to show all options initially
    this.filteredPolicies = [...this.policies];
    this.filteredHospitals = [...this.hospitals];
    
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



addClaim(): void {
  if (this.claimForm.valid) {
    this.isSubmitting = true;
    
    // Get form values and log them for debugging
    const formValues = this.claimForm.value;
    console.log('Form values before submission:', formValues);
    
    // Create the claim object with proper number conversion
    const newClaim: InsuranceClaim = {
      policyId: Number(formValues.policyId) || 0,
      hospitalId: Number(formValues.hospitalId) || 0,
      remarks: formValues.remarks,
      // status and claimName will be set by the backend
    };
    
    console.log('Claim to be submitted:', newClaim);
    
    // Add some validation checks
    if (!newClaim.policyId) {
      alert('Please select a policy');
      this.isSubmitting = false;
      return;
    }
    
    if (!newClaim.hospitalId) {
      alert('Please select a hospital');
      this.isSubmitting = false;
      return;
    }
    
    this.http.post<InsuranceClaim>(`${this.apiBaseUrl}/claims`, newClaim)
      .subscribe({
        next: (response) => {
          console.log('Server response:', response);
          this.claims.push(response);
          this.closeNewClaimForm();
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
    console.log('Form validation errors:', this.claimForm.errors);
  }
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
    
    // Find the related policy and hospital for display
    if (claim.policyId) {
      this.selectedPolicy = this.policies.find(p => p.policyId === claim.policyId) || null;
    }
    
    if (claim.hospitalId) {
      this.selectedHospital = this.hospitals.find(h => h.hospitalId === claim.hospitalId) || null;
    }
    
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
    this.selectedPolicy = null;
    this.selectedHospital = null;
    
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

  // Show policy suggestions when field is focused
  onPolicyInputFocus(): void {
    // Set filtered policies to all policies initially
    this.filteredPolicies = [...this.policies];
    this.showPolicySuggestions = true;
  }

  // Show hospital suggestions when field is focused
  onHospitalInputFocus(): void {
    // Set filtered hospitals to all hospitals initially
    this.filteredHospitals = [...this.hospitals];
    this.showHospitalSuggestions = true;
  }

 

 // Add these properties to keep track of the display values
selectedPolicyDisplay: string = '';
selectedHospitalDisplay: string = '';

selectPolicy(policy: InsurancePolicy): void {
  if (policy && policy.policyId) {
    // Update the form control with the ID value
    this.claimForm.patchValue({
      policyId: policy.policyId
    });
    
    // Update the display value for the search input
    this.selectedPolicyDisplay = `${policy.policyName} (ID: ${policy.policyId})`;
    
    // Find the input element and set its value
    const inputElement = document.getElementById('policySearchInput') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = this.selectedPolicyDisplay;
    }
    
    // Hide the suggestions
    this.showPolicySuggestions = false;
  }
}

selectHospital(hospital: Hospital): void {
  if (hospital && hospital.hospitalId) {
    // Update the form control with the ID value
    this.claimForm.patchValue({
      hospitalId: hospital.hospitalId
    });
    
    // Update the display value for the search input
    this.selectedHospitalDisplay = `${hospital.name} (ID: ${hospital.hospitalId})`;
    
    // Find the input element and set its value
    const inputElement = document.getElementById('hospitalSearchInput') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = this.selectedHospitalDisplay;
    }
    
    // Hide the suggestions
    this.showHospitalSuggestions = false;
  }
}

// Reset the display values when the form is closed or reset
closeNewClaimForm(): void {
  this.showNewClaimForm = false;
  this.claimForm.reset();
  this.isSubmitting = false;
  this.showPolicySuggestions = false;
  this.showHospitalSuggestions = false;
  this.selectedPolicyDisplay = '';
  this.selectedHospitalDisplay = '';
  
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

// Make sure the search functions don't clear the selected values
searchPolicies(event: Event): void {
  const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
  this.showPolicySuggestions = true;
  
  // Don't reset the form value when searching
  
  if (!searchTerm) {
    // If search term is empty, show all policies
    this.filteredPolicies = [...this.policies];
    return;
  }

  this.filteredPolicies = this.policies.filter(policy => 
    policy.policyName.toLowerCase().includes(searchTerm) ||
    policy.policyId?.toString().includes(searchTerm) ||
    policy.policyType.toLowerCase().includes(searchTerm)
  );
}

searchHospitals(event: Event): void {
  const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
  this.showHospitalSuggestions = true;
  
  // Don't reset the form value when searching
  
  if (!searchTerm) {
    // If search term is empty, show all hospitals
    this.filteredHospitals = [...this.hospitals];
    return;
  }

  this.filteredHospitals = this.hospitals.filter(hospital => 
    hospital.name.toLowerCase().includes(searchTerm) ||
    hospital.hospitalId?.toString().includes(searchTerm) ||
    hospital.location.toLowerCase().includes(searchTerm)
  );
}
// Get policy name for display
getPolicyName(policyId: number | null | undefined): string {
  if (policyId === null || policyId === undefined) return 'N/A';
  
  const policy = this.policies.find(p => p.policyId === policyId);
  console.log(`Looking for policy with ID ${policyId}`, policy); // Debug
  return policy ? policy.policyName : 'N/A';
}

// Get hospital name for display
getHospitalName(hospitalId: number | null | undefined): string {
  if (hospitalId === null || hospitalId === undefined) return 'N/A';
  
  const hospital = this.hospitals.find(h => h.hospitalId === hospitalId);
  console.log(`Looking for hospital with ID ${hospitalId}`, hospital); // Debug
  return hospital ? hospital.name : 'N/A';
}
}