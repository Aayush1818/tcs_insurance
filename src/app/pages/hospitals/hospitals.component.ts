import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Hospital } from '../../models/hospital.interface';

@Component({
  selector: 'app-hospitals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hospitals.component.html',
  styleUrls: ['./hospitals.component.scss']
})
export class HospitalsComponent implements OnInit {
  hospitals: Hospital[] = [];
  filteredHospitals: Hospital[] = [];
  selectedHospital: Hospital | null = null;
  searchTerm: string = '';
  
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

  constructor() { }

  ngOnInit(): void {
    // In a real application, you would fetch hospitals from a service
    this.loadMockHospitals();
  }

  private loadMockHospitals(): void {
    // Mock data for demonstration
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
    this.filteredHospitals = [...this.hospitals];
  }

  filterHospitals(): void {
    if (!this.searchTerm) {
      this.filteredHospitals = [...this.hospitals];
      return;
    }

    this.filteredHospitals = this.hospitals.filter(hospital =>
      hospital.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      hospital.location.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openNewHospitalForm(): void {
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
  }

  closeNewHospitalForm(): void {
    this.showNewHospitalForm = false;
  }

  onSubmit(): void {
    // Set created_at timestamp for new hospitals
    if (!this.hospital.hospital_id) {
      this.hospital.created_at = new Date();
      
      // Generate new hospital ID
      const newId = this.hospitals.length > 0 
        ? Math.max(...this.hospitals.map(h => h.hospital_id || 0)) + 1 
        : 1;
      
      this.hospital.hospital_id = newId;
      
      // Add to hospitals array
      this.hospitals.push({...this.hospital});
      this.filteredHospitals = [...this.hospitals];
    }
    
    // Here you would typically send the data to your backend service
    console.log('Form submitted:', this.hospital);
    this.closeNewHospitalForm();
    this.resetForm();
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
    this.selectedHospital = hospital;
    // In a real application, you would use a modal service
    const modal = document.getElementById('hospitalDetailsModal');
    if (modal) {
      // Show modal using Bootstrap
      const modalInstance = new (window as any).bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  editHospital(hospital: Hospital): void {
    this.selectedHospital = { ...hospital };
    // In a real application, you would use a modal service
    const modal = document.getElementById('editHospitalModal');
    if (modal) {
      // Show modal using Bootstrap
      const modalInstance = new (window as any).bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  updateHospital(): void {
    if (this.selectedHospital && this.selectedHospital.hospital_id) {
      // In a real application, you would send this to your backend service
      const index = this.hospitals.findIndex(h => h.hospital_id === this.selectedHospital?.hospital_id);
      if (index !== -1) {
        this.hospitals[index] = { ...this.selectedHospital };
        this.filteredHospitals = [...this.hospitals];
      }
    }
  }
}
