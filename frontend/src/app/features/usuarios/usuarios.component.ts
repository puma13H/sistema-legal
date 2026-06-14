import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <p class="eyebrow">Administración</p>
        <h1 class="page-title">Usuarios</h1>
        <p class="page-subtitle">Gestiona los usuarios del sistema desde aquí.</p>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h2>Lista de usuarios</h2>
      </div>
      <div class="card-body">
        <p>Próximamente podrás ver y administrar usuarios.</p>
      </div>
    </div>
  `
})
export class UsuariosComponent {}
