import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthUser } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'casos_legales_auth';
  readonly currentUser = signal<AuthUser | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string, role: string) {
    return this.http.post<AuthUser>(`${environment.apiUrl}/auth/login`, { email, password, role }).pipe(
      tap(user => {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  logout(): void {
    // set a short message to show on the login page after logout
    try { sessionStorage.setItem('casos_legales_msg', 'Has cerrado sesión correctamente'); } catch {}
    localStorage.removeItem(this.storageKey);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  updateProfile(name: string, email: string): void {
    const current = this.currentUser();
    if (!current) return;
    const updated = { ...current, name, email };
    this.currentUser.set(updated);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  getToken(): string | null {
    const token = this.currentUser()?.token ?? null;
    return token && !this.isTokenExpired(token) ? token : null;
  }

  hasValidToken(): boolean {
    const token = this.currentUser()?.token;
    return !!token && !this.isTokenExpired(token);
  }

  hasRole(...roles: string[]): boolean {
    const role = this.currentUser()?.role;
    return !!role && roles.includes(role);
  }

  private loadUser(): AuthUser | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;

    try {
      const user = JSON.parse(raw) as AuthUser;
      if (user.token && this.isTokenExpired(user.token)) {
        localStorage.removeItem(this.storageKey);
        return null;
      }
      return user;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  private parseJwt(token: string): { exp?: number } {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(escape(decoded)));
    } catch {
      return {};
    }
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.parseJwt(token);
    if (!payload.exp) return false;
    return payload.exp * 1000 < Date.now();
  }
}
