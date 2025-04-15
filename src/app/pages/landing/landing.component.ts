import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InsurancePolicy } from '../../models/insurance.interface';
import Chart from 'chart.js/auto';

// Define the backend policy interface
interface BackendInsurancePolicy {
  id: number;
  policyName: string;
  policyType: string;
  premium: number;
  coverage: number;
  duration: number;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, AfterViewInit {
  policies: InsurancePolicy[] = [];
  private chart: any;
  apiBaseUrl = 'http://localhost:8080/insurance-management-system';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadPolicies();
  }

  ngAfterViewInit(): void {
    // Initialize the pie chart after view is initialized
    this.createPieChart();
  }

  private loadPolicies(): void {
    this.http.get<BackendInsurancePolicy[]>(`${this.apiBaseUrl}/policy`)
      .subscribe({
        next: (data) => {
          // Map backend data format to frontend format
          this.policies = data.map(policy => this.mapBackendToFrontendPolicy(policy));
          console.log('Policies loaded:', this.policies);
          // Update chart data based on loaded policies
          this.updateChartData();
        },
        error: (error) => {
          console.error('Error loading policies:', error);
          // Fallback to mock data if API call fails
          this.loadMockPolicies();
        }
      });
  }

  private mapBackendToFrontendPolicy(backendPolicy: BackendInsurancePolicy): InsurancePolicy {
    return {
      policyId: backendPolicy.id,
      policyName: backendPolicy.policyName,
      policyType: backendPolicy.policyType.toLowerCase(), // Ensure consistent casing
      premium: backendPolicy.premium,
      coverage: backendPolicy.coverage,
      duration_years: backendPolicy.duration
    };
  }

  private loadMockPolicies(): void {
    this.policies = [
      {
        policyId: 1,
        policyName: 'Health Insurance Policy',
        policyType: 'health',
        premium: 500,
        coverage: 50000,
        duration_years: 2
      },
      {
        policyId: 2,
        policyName: 'Life Insurance Policy',
        policyType: 'life',
        premium: 300,
        coverage: 100000,
        duration_years: 5
      },
      {
        policyId: 3,
        policyName: 'Vehicle Insurance Policy',
        policyType: 'vehicle',
        premium: 200,
        coverage: 25000,
        duration_years: 1
      },
      {
        policyId: 4,
        policyName: 'Property Insurance Policy',
        policyType: 'property',
        premium: 400,
        coverage: 75000,
        duration_years: 3
      }
    ];
    // Also update chart if using mock data
    this.updateChartData();
  }

  private updateChartData(): void {
    if (!this.chart) return;

    // Count policies by type
    const policyTypes = this.policies.reduce((acc, policy) => {
      const type = policy.policyType.toLowerCase();
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Prepare data for chart
    const labels = Object.keys(policyTypes).map(type => 
      type.charAt(0).toUpperCase() + type.slice(1) + ' Insurance'
    );
    const data = Object.values(policyTypes);

    // Update chart
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }

  private createPieChart(): void {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Initial empty data for the pie chart
      const data = {
        labels: [],
        datasets: [{
          data: [], 
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ],
          hoverBackgroundColor: [
            '#FF4F71',
            '#2F8FD8',
            '#FFB943',
            '#38ADAD',
            '#8844EE',
            '#FF8C2D'
          ]
        }]
      };

      // Get the canvas element
      const canvas = document.getElementById('landingChart') as HTMLCanvasElement;
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
        
        // If policies are already loaded, update the chart
        if (this.policies.length > 0) {
          this.updateChartData();
        }
      }
    }
  }
}