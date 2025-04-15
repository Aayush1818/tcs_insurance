import { Routes } from '@angular/router';
import { InsuranceComponent } from './pages/insurance/insurance.component';
import { ClaimsComponent } from './pages/claims/claims.component';
import { HospitalsComponent } from './pages/hospitals/hospitals.component';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'insurance', component: InsuranceComponent },
  { path: 'claims', component: ClaimsComponent },
  { path: 'hospitals', component: HospitalsComponent }
];
