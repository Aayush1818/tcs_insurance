import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InsurancePolicy } from '../../models/insurance.interface';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  showSalesPopup = true;
  private chart: any;

  constructor() { }

  ngOnInit(): void {
    // Show sales popup after 2 seconds
    setTimeout(() => {
      this.showSalesPopup = true;
    }, 2000);
  }

  ngAfterViewInit(): void {
    // Initialize the pie chart after view is initialized
    this.createPieChart();
  }

  closeSalesPopup(): void {
    this.showSalesPopup = false;
  }

  onSubmit(): void {
    // Here you would typically send the data to your backend service
    console.log('Form submitted:', this.policy);
    // Reset form after successful submission
    this.resetForm();
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
