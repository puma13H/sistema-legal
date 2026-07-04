import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { dashboardRedirectGuard } from './core/guards/dashboard.guard';
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
      { path: 'dashboard', canActivate: [dashboardRedirectGuard], loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'dashboard/admin', canActivate: [roleGuard('admin')], loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'dashboard/abogado', canActivate: [roleGuard('abogado')], loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'dashboard/cliente', canActivate: [roleGuard('cliente')], loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'usuarios', canActivate: [roleGuard('admin')], loadComponent: () => import('./features/usuarios/usuarios.component').then(m => m.UsuariosComponent) },
      { path: 'casos', loadComponent: () => import('./features/casos/casos-list.component').then(m => m.CasosListComponent) },
      { path: 'casos/nuevo', loadComponent: () => import('./features/casos/caso-create.component').then(m => m.CasoCreateComponent), canActivate: [roleGuard('admin','abogado')] },
      { path: 'casos/:id', loadComponent: () => import('./features/casos/caso-detail.component').then(m => m.CasoDetailComponent) },
      { path: 'clientes', canActivate: [roleGuard('admin','abogado')], loadComponent: () => import('./features/clientes/clientes.component').then(m => m.ClientesComponent) },
      { path: 'abogados', canActivate: [roleGuard('admin')], loadComponent: () => import('./features/abogados/abogados.component').then(m => m.AbogadosComponent) },
      { path: 'audiencias', loadComponent: () => import('./features/audiencias/audiencias.component').then(m => m.AudienciasComponent) },
      { path: 'documentos', loadComponent: () => import('./features/documentos/documentos.component').then(m => m.DocumentosComponent) },
      { path: 'tareas', loadComponent: () => import('./features/tareas/tareas.component').then(m => m.TareasComponent) },
      { path: 'calendario', loadComponent: () => import('./features/calendario/calendario.component').then(m => m.CalendarioComponent) },
      { path: 'reportes', loadComponent: () => import('./features/reportes/reportes.component').then(m => m.ReportesComponent) },
      { path: 'mensajes', loadComponent: () => import('./features/mensajes/mensajes.component').then(m => m.MensajesComponent) },
      { path: 'configuracion', loadComponent: () => import('./features/configuracion/configuracion.component').then(m => m.ConfiguracionComponent) }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
