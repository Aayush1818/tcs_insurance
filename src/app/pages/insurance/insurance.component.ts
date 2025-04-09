import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InsurancePolicy } from '../../models/insurance.interface';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit, AfterViewInit {
  policy: InsurancePolicy = {
    policy_id: undefined,
    policy_name: '',
    policy_type: '',
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
    // Send the data to your backend service
    this.http.post<InsurancePolicy>(`${this.apiBaseUrl}/policies`, this.policy)
      .subscribe({
        next: (response) => {
          console.log('Policy created:', response);
          this.policies.push(response);
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
    this.http.get<InsurancePolicy[]>(`${this.apiBaseUrl}/policies`)
      .subscribe({
        next: (data) => {
          this.policies = data;
        },
        error: (error) => {
          console.error('Error loading policies:', error);
          // Fallback to mock data if API call fails
          this.loadMockPolicies();
        }
      });
  }

  private loadMockPolicies(): void {
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

  private resetForm(): void {
    this.policy = {
      policy_id: undefined,
      policy_name: '',
      policy_type: '',
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
