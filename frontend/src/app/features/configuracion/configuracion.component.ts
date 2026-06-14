import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AuthUser } from '../../core/models';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Mi Perfil</h1>
        <p class="page-subtitle">Actualiza tus datos y revisa la información de tu cuenta.</p>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <form (ngSubmit)="saveProfile()">
          <div class="form-group">
            <label>Nombre</label>
            <input class="input" [(ngModel)]="profile.name" name="name" required />
          </div>
          <div class="form-group">
            <label>Correo electrónico</label>
            <input class="input" type="email" [(ngModel)]="profile.email" name="email" required />
          </div>
          <button type="submit" class="btn btn-primary">Guardar cambios</button>
        </form>
        <div *ngIf="message" class="alert alert-success" style="margin-top:1rem">{{ message }}</div>
      </div>
    </div>
  `
})
export class ConfiguracionComponent implements OnInit {
  profile: AuthUser = { userId: 0, name: '', email: '', role: 'cliente', token: '' };
  message = '';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.profile = { ...user };
    }
  }

  saveProfile(): void {
    this.auth.updateProfile(this.profile.name, this.profile.email);
    this.message = 'Perfil actualizado correctamente';
  }
}
