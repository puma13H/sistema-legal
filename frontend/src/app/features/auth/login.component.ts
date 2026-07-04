import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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

      <section class="roles-column">
        <div class="roles-header">
          <h2 class="roles-title">Accede con tu rol</h2>
          <p class="roles-sub">Selecciona tu perfil para iniciar sesión</p>
        </div>
        <div *ngIf="infoMsg" class="alert alert-success" style="margin:1rem 0">{{ infoMsg }}</div>
        <div *ngIf="!showForm" class="role-cards">
            <a class="role-card purple" [class.active]="role === 'admin'" (click)="openRoleWindow('admin')">
              <div class="role-left"><div class="role-icon">👤</div></div>
              <div class="role-body">
                <div class="role-name">ADMIN</div>
                <div class="role-desc">Acceso para administradores del sistema.</div>
              </div>
              <div class="role-arrow">›</div>
            </a>

            <a class="role-card gold" [class.active]="role === 'abogado'" (click)="openRoleWindow('abogado')">
              <div class="role-left"><div class="role-icon">⚖️</div></div>
              <div class="role-body">
                <div class="role-name">ABOGADO</div>
                <div class="role-desc">Acceso para abogados y gestión de casos.</div>
              </div>
              <div class="role-arrow">›</div>
            </a>

            <a class="role-card navy" [class.active]="role === 'cliente'" (click)="openRoleWindow('cliente')">
              <div class="role-left"><div class="role-icon">👥</div></div>
              <div class="role-body">
                <div class="role-name">CLIENTE</div>
                <div class="role-desc">Acceso para clientes y consulta de casos.</div>
              </div>
              <div class="role-arrow">›</div>
            </a>
        </div>

        <div *ngIf="showForm" class="panel-inner auth-below">
          <div class="auth-card">
            <div class="auth-header">
              <h3>Iniciar sesión - {{ roleLabel }}</h3>
              <span class="status-badge" *ngIf="backendOk">Backend conectado</span>
            </div>
            <form (ngSubmit)="submit()">
              <div *ngIf="role === 'admin' || role === 'abogado'">
                <div class="form-group">
                  <label>Correo electrónico</label>
                  <div class="input-wrap">
                    <span class="icon-left">✉️</span>
                    <input class="input" type="email" [(ngModel)]="email" name="email" required />
                  </div>
                </div>

                <div class="form-group">
                  <label>Contraseña</label>
                  <div class="input-wrap">
                    <span class="icon-left">🔒</span>
                    <input class="input" [type]="showPassword ? 'text' : 'password'" [(ngModel)]="password" name="password" required />
                    <button type="button" class="icon-right" (click)="toggleShow()">{{ showPassword ? '🙈' : '👁️' }}</button>
                  </div>
                </div>

                <div class="form-row between">
                  <label class="checkbox"><input type="checkbox" [(ngModel)]="remember" name="remember"> Recordarme</label>
                  <a class="forgot" href="#" (click)="openRecover($event)">¿Olvidaste tu contraseña?</a>
                </div>
              </div>

              <div *ngIf="role === 'cliente'">
                <div class="form-group">
                  <label>Correo electrónico</label>
                  <input class="input" type="email" [(ngModel)]="email" name="email" required />
                </div>
                <div class="form-group">
                  <label>Contraseña</label>
                  <input class="input" type="password" [(ngModel)]="password" name="password" required />
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-full btn-pill" [disabled]="loading || !backendOk">
                <span class="btn-icon">🔐</span>
                {{ loading ? 'Ingresando...' : 'Ingresar' }}</button>
            </form>

            <div class="alert alert-error" *ngIf="error">{{ error }}</div>
          </div>
        </div>
      </section>
    </div>
  `
})
 
export class LoginComponent implements OnInit, OnDestroy {
  role: 'admin' | 'abogado' | 'cliente' = 'admin';
  showForm = false;
  email = '';
  password = '';
  loading = false;
  error = '';
  backendOk = false;
  backendDown = false;
  remember = false;
  showPassword = false;
  // forgot password
  showRecover = false;
  recoverEmail = this.email;
  recoverMessage = '';
  infoMsg = '';
  private healthInterval: number | null = null;
  private paramSub: Subscription | null = null;

  get roleLabel(): string {
    return this.role === 'admin'
      ? 'Administrador'
      : this.role === 'abogado'
        ? 'Abogado'
        : 'Cliente';
  }

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.checkBackend();
    this.paramSub = this.route.paramMap.subscribe(params => {
      const p = params.get('role');
      if (p === 'admin' || p === 'abogado' || p === 'cliente') {
        this.setRole(p as 'admin' | 'abogado' | 'cliente');
        this.showForm = true;
      } else {
        this.showForm = false;
      }
    });
    this.healthInterval = window.setInterval(() => this.checkBackend(), 5000);
    // show message set after logout
    try {
      const m = sessionStorage.getItem('casos_legales_msg');
      if (m) { this.infoMsg = m; sessionStorage.removeItem('casos_legales_msg'); }
    } catch {}
  }

  ngOnDestroy(): void {
    if (this.healthInterval) {
      window.clearInterval(this.healthInterval);
    }
    if (this.paramSub) {
      this.paramSub.unsubscribe();
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
    // when opening the role-specific login page, the login form appears for the selected role
    if (role === 'admin') { this.email = 'admin@casoslegales.com'; this.password = 'admin123'; }
    if (role === 'abogado') { this.email = 'abogado@casoslegales.com'; this.password = 'abogado123'; }
    if (role === 'cliente') { this.email = 'cliente@casoslegales.com'; this.password = 'cliente123'; }
  }

  navigateToRole(role: 'admin' | 'abogado' | 'cliente'): void {
    // navigate to the role-specific login route so URL reflects selection
    this.router.navigate(['/login', role]);
  }

  openRoleWindow(role: 'admin' | 'abogado' | 'cliente'): void {
    // Map each role to its own localhost port so each can run a customized frontend
    const portMap: Record<string, number> = { admin: 4200, abogado: 4300, cliente: 4400 };
    const host = window.location.hostname || 'localhost';
    const port = portMap[role] ?? window.location.port;
    const url = `${window.location.protocol}//${host}:${port}/login/${role}`;
    window.open(url, '_blank');
  }

  submit(): void {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password, this.role).subscribe({
      next: (user) => {
        this.loading = false;
        this.router.navigate(['/dashboard', user.role]);
      },
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

  toggleShow(): void {
    this.showPassword = !this.showPassword;
  }

  openRecover(event?: Event): void {
    if (event) event.preventDefault();
    this.recoverEmail = this.email || '';
    this.recoverMessage = '';
    this.showRecover = true;
  }

  closeRecover(): void {
    this.showRecover = false;
    this.recoverMessage = '';
  }

  sendRecover(): void {
    if (!this.recoverEmail) { this.recoverMessage = 'Introduce tu correo electrónico.'; return; }
    const url = `${environment.apiUrl}/auth/forgot`;
    this.http.post(url, { email: this.recoverEmail }).subscribe({
      next: () => { this.recoverMessage = 'Si existe una cuenta, se ha enviado un correo con instrucciones.'; },
      error: (err) => { this.recoverMessage = err.error?.message || 'Error al enviar instrucciones. Intenta más tarde.'; }
    });
  }

  
}
