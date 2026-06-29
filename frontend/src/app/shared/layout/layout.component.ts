import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="sidebar-brand-icon">⚖</div>
          <div>
            <h1>Casos Legales</h1>
            <small>Sistema jurídico</small>
          </div>
        </div>

        <div class="sidebar-user">
          <strong>{{ auth.currentUser()?.name }}</strong>
          <span>{{ auth.currentUser()?.role }}</span>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">📊</span> Dashboard
          </a>
          <a routerLink="/casos" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">📁</span> Casos
          </a>
          <ng-container *ngIf="auth.hasRole('admin','abogado')">
            <a routerLink="/clientes" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">👥</span> Clientes
            </a>
          </ng-container>
          <ng-container *ngIf="auth.hasRole('admin')">
            <a routerLink="/abogados" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">⚖</span> Abogados
            </a>
          </ng-container>
        </nav>

        <div class="sidebar-footer">
          <button type="button" class="btn-logout" (click)="auth.logout()">Cerrar sesión</button>
        </div>
      </aside>

      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `
})
export class LayoutComponent {
  constructor(public auth: AuthService) {}
}
