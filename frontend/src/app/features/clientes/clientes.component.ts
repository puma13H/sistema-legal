import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../core/services/cliente.service';
import { Cliente } from '../../core/models';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Clientes</h1>
        <p class="page-subtitle">Gestión de clientes del bufete</p>
      </div>
    </div>

    <div class="form-card">
      <h3>Registrar nuevo cliente</h3>
      <form (ngSubmit)="crear()">
        <div class="form-group">
          <label>Nombre completo</label>
          <input class="input" [(ngModel)]="form.nombre" name="nombre" required />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input class="input" [(ngModel)]="form.telefono" name="telefono" required />
        </div>
        <div class="form-group">
          <label>Correo electrónico</label>
          <input class="input" type="email" [(ngModel)]="form.email" name="email" required />
        </div>
        <div class="form-group">
          <label>Dirección</label>
          <input class="input" [(ngModel)]="form.direccion" name="direccion" />
        </div>
        <button type="submit" class="btn btn-primary">Crear cliente</button>
        <div *ngIf="passwordInfo" class="alert alert-success" style="margin-top:1rem">
          Contraseña temporal: <strong>{{ passwordInfo }}</strong>
        </div>
      </form>
    </div>

    <div class="card">
      <div class="card-header"><h2>Listado de clientes</h2></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>Nombre</th><th>Email</th><th>Teléfono</th><th></th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of clientes">
              <td><strong>{{ c.nombre }}</strong></td>
              <td>{{ c.email }}</td>
              <td>{{ c.telefono }}</td>
              <td><button type="button" class="btn btn-danger" (click)="eliminar(c.id)">Eliminar</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  form = { nombre: '', telefono: '', email: '', direccion: '' };
  passwordInfo = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.clienteService.list().subscribe(c => this.clientes = c);
  }

  crear(): void {
    this.clienteService.create(this.form).subscribe(res => {
      this.passwordInfo = res.passwordTemporal;
      this.form = { nombre: '', telefono: '', email: '', direccion: '' };
      this.load();
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar cliente?')) {
      this.clienteService.delete(id).subscribe(() => this.load());
    }
  }
}
