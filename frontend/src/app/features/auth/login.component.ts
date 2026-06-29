import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page modern">
      <aside class="hero-left">
        <div class="hero-inner">
          <div class="brand">
            <div class="brand-icon">⚖</div>
            <div class="brand-text">
              <div class="brand-name">CASOS</div>
              <div class="brand-sub">LEGALES</div>
            </div>
          </div>

          <h1 class="hero-title">Sistema de Gestión Legal</h1>
          <p class="hero-desc">Administra casos, clientes y documentación desde un solo lugar.</p>

          <div class="hero-visual"> <!-- placeholder for image/illustration -->
            <div class="scales">⚖️</div>
          </div>
        </div>
      </aside>

      <main class="panel-right">
        <div class="panel-inner">
          <div class="role-cards">
            <button type="button" class="role-card" [class.active]="role === 'admin'" (click)="setRole('admin')">
              <div class="role-left"><div class="role-icon">👤</div></div>
              <div class="role-body">
                <div class="role-name">ADMIN</div>
                <div class="role-desc">Acceso para administradores del sistema.</div>
              </div>
              <div class="role-arrow">›</div>
            </button>

            <button type="button" class="role-card" [class.active]="role === 'abogado'" (click)="setRole('abogado')">
              <div class="role-left"><div class="role-icon">⚖️</div></div>
              <div class="role-body">
                <div class="role-name">ABOGADO</div>
                <div class="role-desc">Acceso para abogados y gestión de casos.</div>
              </div>
              <div class="role-arrow">›</div>
            </button>

            <button type="button" class="role-card" [class.active]="role === 'cliente'" (click)="setRole('cliente')">
              <div class="role-left"><div class="role-icon">👥</div></div>
              <div class="role-body">
                <div class="role-name">CLIENTE</div>
                <div class="role-desc">Acceso para clientes y consulta de casos.</div>
              </div>
              <div class="role-arrow">›</div>
            </button>
          </div>

          <div class="auth-card">
            <div class="auth-header">
              <h3>Iniciar sesión</h3>
              <span class="status-badge" *ngIf="backendOk">Backend conectado</span>
            </div>
            <form (ngSubmit)="submit()">
              <div class="form-group">
                <label>Correo electrónico</label>
                <input class="input" type="email" [(ngModel)]="email" name="email" required />
              </div>
              <div class="form-group">
                <label>Contraseña</label>
                <input class="input" type="password" [(ngModel)]="password" name="password" required />
              </div>
              <button type="submit" class="btn btn-primary btn-full" [disabled]="loading || !backendOk">{{ loading ? 'Ingresando...' : 'Ingresar' }}</button>
            </form>

            <div class="alert alert-error" *ngIf="error">{{ error }}</div>
            <p class="login-note">Si el backend no responde, ejecuta INICIAR-TODO.bat.</p>
          </div>
        </div>
      </main>
    </div>
  `
})
export class LoginComponent implements OnInit, OnDestroy {
  role: 'admin' | 'abogado' | 'cliente' = 'admin';
  email = 'admin@casoslegales.com';
  password = 'admin123';
  loading = false;
  error = '';
  backendOk = false;
  backendDown = false;
  private healthInterval: number | null = null;

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.checkBackend();
    const p = this.route.snapshot.paramMap.get('role');
    if (p === 'admin' || p === 'abogado' || p === 'cliente') {
      this.setRole(p as 'admin' | 'abogado' | 'cliente');
    }
    this.healthInterval = window.setInterval(() => this.checkBackend(), 5000);
  }

  ngOnDestroy(): void {
    if (this.healthInterval) {
      window.clearInterval(this.healthInterval);
    }
  }

  public checkBackend(): void {
    this.http.get(`${environment.apiUrl}/auth/health`).subscribe({
      next: () => { this.backendOk = true; this.backendDown = false; },
      error: () => { this.backendOk = false; this.backendDown = true; }
    });
  }

  setRole(role: 'admin' | 'abogado' | 'cliente'): void {
    this.role = role;
    if (role === 'admin') { this.email = 'admin@casoslegales.com'; this.password = 'admin123'; }
    if (role === 'abogado') { this.email = 'abogado@casoslegales.com'; this.password = 'abogado123'; }
    if (role === 'cliente') { this.email = 'cliente@casoslegales.com'; this.password = 'cliente123'; }
    // keep form visible and just prefill credentials for the selected role
  }

  submit(): void {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password, this.role).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/dashboard']); },
      error: (err) => {
        this.loading = false;
        if (err.status === 0) {
          this.error = 'Backend no responde. Ejecuta INICIAR-TODO.bat';
        } else if (err.error?.error) {
          this.error = err.error.error;
        } else {
          this.error = 'Credenciales inválidas o rol incorrecto';
        }
      }
    });
  }

  
}
