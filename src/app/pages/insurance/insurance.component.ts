import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InsurancePolicy } from '../../models/insurance.interface';
import Chart from 'chart.js/auto';

// Interface to match the API response structure
interface ApiPolicyResponse {
  id: number;
  policyName: string;
  policyType: string;
  premium: number;
  coverage: number;
  duration: number;
}

@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit, AfterViewInit {
  policy: InsurancePolicy = {
    policyId: 0,
    policyName: '',
    policyType: '',
    premium: 0,
    coverage: 0,
    duration_years: 1
  };

  policies: InsurancePolicy[] = [];
  showSalesPopup = true;
  private chart: any;
  apiBaseUrl = 'http://localhost:8080/insurance-management-system';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Show sales popup after 2 seconds
    setTimeout(() => {
      this.showSalesPopup = true;
    }, 2000);
    this.loadPolicies();
  }

  ngAfterViewInit(): void {
    // Initialize the pie chart after view is initialized
    this.createPieChart();
  }

  closeSalesPopup(): void {
    this.showSalesPopup = false;
  }

  onSubmit(): void {
    // Transform our internal model to match the API's expected format
    const apiPolicy = this.mapToApiFormat(this.policy);
    
    // Send the data to your backend service
    this.http.post<ApiPolicyResponse>(`${this.apiBaseUrl}/policy`, apiPolicy)
      .subscribe({
        next: (response) => {
          console.log('Policy created:', response);
          // Map the response back to our internal format
          const mappedPolicy = this.mapFromApiFormat(response);
          this.policies.push(mappedPolicy);
          this.resetForm();
          // Show success message
          alert('Policy created successfully!');
        },
        error: (error) => {
          console.error('Error creating policy:', error);
          alert('Failed to create policy. Please try again.');
        }
      });
  }

  private loadPolicies(): void {
    this.http.get<ApiPolicyResponse[]>(`${this.apiBaseUrl}/policy`)
      .subscribe({
        next: (data) => {
          // Map each API response to our internal model format
          this.policies = data.map(item => this.mapFromApiFormat(item));
        },
        error: (error) => {
          console.error('Error loading policies:', error);
          // Fallback to mock data if API call fails
          this.loadMockPolicies();
        }
      });
  }

  // Map from our internal model to API format
  private mapToApiFormat(policy: InsurancePolicy): ApiPolicyResponse {
    return {
      id: policy.policyId,
      policyName: policy.policyName,
      policyType: policy.policyType,
      premium: policy.premium,
      coverage: policy.coverage,
      duration: policy.duration_years
    };
  }

  // Map from API format to our internal model
  private mapFromApiFormat(apiPolicy: ApiPolicyResponse): InsurancePolicy {
    return {
      policyId: apiPolicy.id,
      policyName: apiPolicy.policyName,
      policyType: apiPolicy.policyType,
      premium: apiPolicy.premium,
      coverage: apiPolicy.coverage,
      duration_years: apiPolicy.duration
    };
  }

  private loadMockPolicies(): void {
    // Example of mapping API response to our internal format
    const apiResponseExample = {
      id: 2,
      policyName: "HealthSecures Basic",
      policyType: "Health",
      premium: 1000.0,
      coverage: 50000.0,
      duration: 5
    };
    
    this.policies = [
      {
        policyId: 1,
        policyName: 'Health Insurance Policy',
        policyType: 'health',
        premium: 500,
        coverage: 50000,
        duration_years: 2
      },
      // Map the API example to our format
      this.mapFromApiFormat(apiResponseExample)
    ];
  }

  private resetForm(): void {
    this.policy = {
      policyId: 0,
      policyName: '',
      policyType: '',
      premium: 0,
      coverage: 0,
      duration_years: 1
    };
  }

  private createPieChart(): void {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Sample data for the pie chart
      const data = {
        labels: ['Health Insurance', 'Life Insurance', 'Vehicle Insurance', 'Property Insurance'],
        datasets: [{
          data: [35, 25, 20, 20], // Percentages
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0'
          ],
          hoverBackgroundColor: [
            '#FF4F71',
            '#2F8FD8',
            '#FFB943',
            '#38ADAD'
          ]
        }]
      };

      // Get the canvas element
      const canvas = document.getElementById('insuranceChart') as HTMLCanvasElement;
      if (canvas) {
        // Create the pie chart
        this.chart = new Chart(canvas, {
          type: 'pie',
          data: data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
              },
              title: {
                display: true,
                text: 'Insurance Policy Distribution'
              }
            }
          }
        });
      }
    }
  }
}