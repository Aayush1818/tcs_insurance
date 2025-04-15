import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InsurancePolicy } from '../../models/insurance.interface';
import Chart from 'chart.js/auto';

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
      },
      {
        policy_id: 3,
        policy_name: 'Vehicle Insurance Policy',
        policy_type: 'vehicle',
        premium: 200,
        coverage: 25000,
        duration_years: 1
      },
      {
        policy_id: 4,
        policy_name: 'Property Insurance Policy',
        policy_type: 'property',
        premium: 400,
        coverage: 75000,
        duration_years: 3
      }
    ];
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
      }
    }
  }
} 