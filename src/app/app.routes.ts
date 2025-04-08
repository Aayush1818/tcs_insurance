import { Routes } from '@angular/router';
import { InsuranceComponent } from './pages/insurance/insurance.component';
import { ClaimsComponent } from './pages/claims/claims.component';
import { HospitalsComponent } from './pages/hospitals/hospitals.component';

export const routes: Routes = [
  { path: '', redirectTo: '/insurance', pathMatch: 'full' },
  { path: 'insurance', component: InsuranceComponent },
  { path: 'claims', component: ClaimsComponent },
  { path: 'hospitals', component: HospitalsComponent }
];
