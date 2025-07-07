
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent) },
  { path: 'home', loadComponent: () => import('./shared/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'rooms', loadChildren: () => import('./features/rooms/rooms.module').then(m => m.RoomsModule) },
  { path: 'tenants', loadChildren: () => import('./features/customers/customers.module').then(m => m.CustomersModule) },
];
