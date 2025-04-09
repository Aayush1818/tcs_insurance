import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Hospital } from '../../models/hospital.interface';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-hospitals',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './hospitals.component.html',
  styleUrls: ['./hospitals.component.scss']
})
export class HospitalsComponent implements OnInit, OnDestroy {
  hospitals: Hospital[] = [];
  filteredHospitals: Hospital[] = [];
  selectedHospital: Hospital | null = null;
  searchTerm: string = '';
  loading: boolean = false;
  error: string | null = null;
  isBrowser: boolean;
  
  // New hospital form
  hospital: Hospital = {
    hospital_id: undefined,
    name: '',
    location: '',
    discount: 0,
    contact_email: '',
    phone_number: '',
    created_at: new Date()
  };
  
  showNewHospitalForm = false;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadHospitals();
  }

  private loadHospitals(): void {
    this.loading = true;
    this.error = null;
    
    this.http.get<any[]>('http://localhost:8080/insurance-management-system/hospitals')
      .pipe(
        map(data => data.map(item => this.mapApiResponseToHospital(item)))
      )
      .subscribe({
        next: (data) => {
          this.hospitals = data;
          this.filteredHospitals = [...this.hospitals];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching hospitals:', error);
          this.error = 'Failed to load hospitals. Please try again later.';
          this.loading = false;
          this.loadFallbackMockData();
        }
      });
  }

  private loadFallbackMockData(): void {
    // Mock data matching the original Hospital interface
    this.hospitals = [
      {
        hospital_id: 1,
        name: 'Apollo Hospital',
        location: 'Kolkata, India',
        discount: 10,
        contact_email: 'contact@apollo.com',
        phone_number: '+91-9876543321',
        created_at: new Date('2024-01-01')
      },
      {
        hospital_id: 2,
        name: 'Max Healthcare',
        location: 'Delhi, India',
        discount: 15,
        contact_email: 'info@maxhealthcare.com',
        phone_number: '+91-9876543322',
        created_at: new Date('2024-02-01')
      }
    ];
    this.filteredHospitals = [...this.hospitals];
  }

  private mapApiResponseToHospital(apiResponse: any): Hospital {
    return {
      hospital_id: apiResponse.id,
      name: apiResponse.name,
      location: apiResponse.location,
      discount: apiResponse.discount,
      contact_email: apiResponse.contactEmail,
      phone_number: apiResponse.phoneNumber,
      created_at: apiResponse.created_at
    };
  }

  private mapHospitalToApiRequest(hospital: Hospital): any {
    return {
      id: hospital.hospital_id,
      name: hospital.name,
      location: hospital.location,
      discount: hospital.discount,
      contactEmail: hospital.contact_email,
      phoneNumber: hospital.phone_number,
      created_at: hospital.created_at
    };
  }

  filterHospitals(): void {
    if (!this.searchTerm) {
      this.filteredHospitals = [...this.hospitals];
      return;
    }

    this.filteredHospitals = this.hospitals.filter(hospital =>
      hospital.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      hospital.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      hospital.contact_email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openNewHospitalForm(): void {
    if (!this.isBrowser) return;
    
    this.showNewHospitalForm = true;
    this.hospital = {
      hospital_id: undefined,
      name: '',
      location: '',
      discount: 0,
      contact_email: '',
      phone_number: '',
      created_at: new Date()
    };
    
    console.log('Opening new hospital form');
  }

  closeNewHospitalForm(): void {
    this.showNewHospitalForm = false;
  }

  onSubmit(): void {
    // Set created_at timestamp for new hospitals
    this.hospital.created_at = new Date();
    
    const apiHospital = this.mapHospitalToApiRequest(this.hospital);
    
    this.http.post<any>('http://localhost:8080/insurance-management-system/hospitals', apiHospital)
      .pipe(
        map(response => this.mapApiResponseToHospital(response))
      )
      .subscribe({
        next: (response) => {
          console.log('Hospital added successfully:', response);
          this.hospitals.push(response);
          this.filteredHospitals = [...this.hospitals];
          this.closeNewHospitalForm();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error adding hospital:', error);
        }
      });
  }

  private resetForm(): void {
    this.hospital = {
      hospital_id: undefined,
      name: '',
      location: '',
      discount: 0,
      contact_email: '',
      phone_number: '',
      created_at: new Date()
    };
  }

  viewHospitalDetails(hospital: Hospital): void {
    if (!this.isBrowser) return;
    
    this.selectedHospital = hospital;
    
    setTimeout(() => {
      const modal = document.getElementById('hospitalDetailsModal');
      if (modal) {
        if (typeof (window as any).bootstrap !== 'undefined') {
          const modalInstance = new (window as any).bootstrap.Modal(modal);
          modalInstance.show();
        } else {
          console.error('Bootstrap JavaScript is not loaded');
        }
      }
    });
  }

  editHospital(hospital: Hospital): void {
    if (!this.isBrowser) return;
    
    this.selectedHospital = { ...hospital };
    
    setTimeout(() => {
      const modal = document.getElementById('editHospitalModal');
      if (modal) {
        if (typeof (window as any).bootstrap !== 'undefined') {
          const modalInstance = new (window as any).bootstrap.Modal(modal);
          modalInstance.show();
        } else {
          console.error('Bootstrap JavaScript is not loaded');
        }
      }
    });
  }

  updateHospital(): void {
    if (this.selectedHospital && this.selectedHospital.hospital_id) {
      const apiHospital = this.mapHospitalToApiRequest(this.selectedHospital);
      
      this.http.put<any>(
        `http://localhost:8080/insurance-management-system/hospitals/${this.selectedHospital.hospital_id}`, 
        apiHospital
      )
      .pipe(
        map(response => this.mapApiResponseToHospital(response))
      )
      .subscribe({
        next: (response) => {
          console.log('Hospital updated successfully:', response);
          const index = this.hospitals.findIndex(h => h.hospital_id === this.selectedHospital?.hospital_id);
          if (index !== -1) {
            this.hospitals[index] = { ...response };
            this.filteredHospitals = [...this.hospitals];
          }
        },
        error: (error) => {
          console.error('Error updating hospital:', error);
        }
      });
    }
  }
  
  ngOnDestroy(): void {
    // Only access document when in browser environment
    if (this.isBrowser) {
      const modal = document.getElementById('hospitalDetailsModal');
      if (modal && typeof (window as any).bootstrap !== 'undefined') {
        const modalInstance = (window as any).bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.dispose();
        }
      }
      
      const editModal = document.getElementById('editHospitalModal');
      if (editModal && typeof (window as any).bootstrap !== 'undefined') {
        const modalInstance = (window as any).bootstrap.Modal.getInstance(editModal);
        if (modalInstance) {
          modalInstance.dispose();
        }
      }
    }
  }

  // Helper method to format discount as percentage
  formatDiscount(discount: number): string {
    return `${discount}%`;
  }
}