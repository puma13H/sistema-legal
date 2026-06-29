import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login/:role',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    component: LayoutComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'casos', loadComponent: () => import('./features/casos/casos-list.component').then(m => m.CasosListComponent) },
      { path: 'casos/:id', loadComponent: () => import('./features/casos/caso-detail.component').then(m => m.CasoDetailComponent) },
      { path: 'clientes', canActivate: [roleGuard('admin','abogado')], loadComponent: () => import('./features/clientes/clientes.component').then(m => m.ClientesComponent) },
      { path: 'abogados', canActivate: [roleGuard('admin')], loadComponent: () => import('./features/abogados/abogados.component').then(m => m.AbogadosComponent) }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
