import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-layout">
      <!-- Sidebar para admin -->
      <aside class="sidebar admin" *ngIf="auth.currentUser()?.role === 'admin'">
        <div class="sidebar-brand">
          <div class="brand-icon">⚖</div>
          <div class="brand-meta">
            <h1>Casos Legales</h1>
            <small>Panel administrativo</small>
          </div>
        </div>

        <nav class="sidebar-nav admin-nav">
          <a [routerLink]="['/dashboard', auth.currentUser()?.role]" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-link admin-link">
            <span class="nav-icon admin-icon">🏠</span>
            <span>Dashboard</span>
          </a>
          <a routerLink="/usuarios" routerLinkActive="active" class="nav-link admin-link">
            <span class="nav-icon">👤</span>
            <span>Usuarios</span>
          </a>
          <a routerLink="/abogados" routerLinkActive="active" class="nav-link admin-link">
            <span class="nav-icon nav-icon-square">⚖️</span>
            <span>Abogados</span>
          </a>
          <a routerLink="/clientes" routerLinkActive="active" class="nav-link admin-link">
            <span class="nav-icon">👥</span>
            <span>Clientes</span>
          </a>
          <a routerLink="/casos" routerLinkActive="active" class="nav-link admin-link">
            <span class="nav-icon">📁</span>
            <span>Casos</span>
          </a>
          <a routerLink="/audiencias" routerLinkActive="active" class="nav-link admin-link">
            <span class="nav-icon">🗓️</span>
            <span>Audiencias</span>
          </a>
          <a routerLink="/documentos" routerLinkActive="active" class="nav-link admin-link">
            <span class="nav-icon">📄</span>
            <span>Documentos</span>
          </a>
          <a routerLink="/reportes" routerLinkActive="active" class="nav-link admin-link">
            <span class="nav-icon">📊</span>
            <span>Reportes</span>
          </a>
          <a routerLink="/configuracion" routerLinkActive="active" class="nav-link admin-link">
            <span class="nav-icon">⚙️</span>
            <span>Configuración</span>
          </a>
        </nav>

        <div class="sidebar-footer admin-footer">
          <button type="button" class="btn-logout" (click)="openConfirm()">Cerrar sesión</button>
        </div>
      </aside>

      <!-- Sidebar para cliente -->
      <aside class="sidebar cliente" *ngIf="auth.currentUser()?.role === 'cliente'">
        <div class="sidebar-brand">
          <div class="brand-icon">⚖</div>
          <div class="brand-meta">
            <h1>Casos Legales</h1>
            <small>Sistema Jurídico</small>
          </div>
        </div>

        <nav class="sidebar-nav cliente-nav">
          <a routerLink="/dashboard/cliente" routerLinkActive="active" class="nav-link cliente-link">
            <span class="nav-link-icon">🏠</span>
            <span>Inicio</span>
          </a>
          <a routerLink="/casos" routerLinkActive="active" class="nav-link cliente-link">
            <span class="nav-link-icon">📁</span>
            <span>Mis Casos</span>
          </a>
          <a routerLink="/documentos" routerLinkActive="active" class="nav-link cliente-link">
            <span class="nav-link-icon">📄</span>
            <span>Mis Documentos</span>
          </a>
          <a routerLink="/audiencias" routerLinkActive="active" class="nav-link cliente-link">
            <span class="nav-link-icon">🗓️</span>
            <span>Audiencias</span>
          </a>
          <a routerLink="/mensajes" routerLinkActive="active" class="nav-link cliente-link">
            <span class="nav-link-icon">💬</span>
            <span>Mensajes</span>
          </a>
          <a routerLink="/configuracion" routerLinkActive="active" class="nav-link cliente-link">
            <span class="nav-link-icon">👤</span>
            <span>Mi Perfil</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <button type="button" class="btn-logout" (click)="openConfirm()">Cerrar sesión</button>
        </div>
      </aside>

      <!-- Compact / card-style sidebar for Abogado -->
      <aside class="sidebar abogado" *ngIf="auth.currentUser()?.role === 'abogado'">
        <div class="sidebar-brand abogado-brand">
          <div class="sidebar-brand-icon">⚖</div>
          <div class="brand-meta">
            <h1>Casos Legales</h1>
            <small>Sistema Jurídico</small>
          </div>
        </div>

        <nav class="abogado-nav">
          <a [routerLink]="['/dashboard', auth.currentUser()?.role]" routerLinkActive="active" class="abogado-item">
            <span class="abogado-icon">🏠</span>
            <span>Dashboard</span>
          </a>
          <a routerLink="/casos" routerLinkActive="active" class="abogado-item">
            <span class="abogado-icon">📁</span>
            <span>Casos</span>
          </a>
          <a routerLink="/clientes" routerLinkActive="active" class="abogado-item">
            <span class="abogado-icon">👥</span>
            <span>Clientes</span>
          </a>
          <a routerLink="/audiencias" routerLinkActive="active" class="abogado-item">
            <span class="abogado-icon">🗓️</span>
            <span>Audiencias</span>
          </a>
          <a routerLink="/documentos" routerLinkActive="active" class="abogado-item">
            <span class="abogado-icon">📄</span>
            <span>Documentos</span>
          </a>
          <a routerLink="/reportes" routerLinkActive="active" class="abogado-item">
            <span class="abogado-icon">📊</span>
            <span>Reportes</span>
          </a>
        </nav>

        <div class="abogado-profile-block">
          <div class="abogado-profile-card">
            <div class="abogado-avatar" [style.background-image]="avatarDataUrl ? 'url(' + avatarDataUrl + ')' : 'none'" (click)="avatarInput.click()">
              <ng-container *ngIf="!avatarDataUrl">👨‍⚖️</ng-container>
            </div>
            <input #avatarInput type="file" accept="image/*" hidden (change)="onAvatarChange($event)" />
            <div class="abogado-info">
              <strong>{{ auth.currentUser()?.name || 'Juan Pérez' }}</strong>
              <span>Abogado</span>
            </div>
          </div>
          <div class="sidebar-footer abogado-footer">
            <button type="button" class="btn-logout" (click)="auth.logout()">Cerrar sesión</button>
          </div>
        </div>
      </aside>

      <main class="main-content">
        <router-outlet />
      </main>
      <!-- Confirmation modal -->
      <div *ngIf="showConfirm" class="modal-backdrop">
        <div class="modal-card">
          <h4>¿Estás seguro?</h4>
          <p>¿Deseas cerrar sesión?</p>
          <div class="modal-actions">
            <button type="button" class="btn btn-primary" (click)="confirmLogout()">Aceptar</button>
            <button type="button" class="btn btn-secondary" (click)="cancel()">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LayoutComponent implements OnInit {
  showConfirm = false;
  avatarDataUrl: string | null = null;

  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    // initialize avatar from user profile if available (use any to avoid strict typing if backend hasn't set this field)
    const u: any = this.auth.currentUser();
    this.avatarDataUrl = u?.avatarUrl ?? null;
  }

  openConfirm(): void {
    this.showConfirm = true;
  }

  confirmLogout(): void {
    this.showConfirm = false;
    this.auth.logout();
  }

  cancel(): void {
    this.showConfirm = false;
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarDataUrl = reader.result as string;
      // attempt to upload to backend if endpoint exists
      try {
        const form = new FormData();
        form.append('file', file);
        this.http.post(`${environment.apiUrl}/users/avatar`, form).subscribe({ next: () => {}, error: () => {} });
      } catch (e) {
        // ignore if no backend
      }
    };
    reader.readAsDataURL(file);
  }
}
 
// Note: confirmation modal controlled in template by `showConfirm` property.
