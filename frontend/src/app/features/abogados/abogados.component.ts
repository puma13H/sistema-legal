import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbogadoService } from '../../core/services/abogado.service';
import { Abogado } from '../../core/models';

@Component({
  selector: 'app-abogados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Abogados</h1>
        <p class="page-subtitle">Equipo legal del bufete</p>
      </div>
    </div>

    <div class="form-card">
      <h3>Registrar nuevo abogado</h3>
      <form (ngSubmit)="crear()">
        <div class="form-group">
          <label>Nombre completo</label>
          <input class="input" [(ngModel)]="form.nombre" name="nombre" required />
        </div>
        <div class="form-group">
          <label>Especialidad</label>
          <input class="input" [(ngModel)]="form.especialidad" name="especialidad" required />
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
        <button type="submit" class="btn btn-primary">Crear abogado</button>
        <div *ngIf="passwordInfo" class="alert alert-success" style="margin-top:1rem">
          Contraseña temporal: <strong>{{ passwordInfo }}</strong>
        </div>
      </form>
    </div>

    <div class="card">
      <div class="card-header"><h2>Listado de abogados</h2></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>Nombre</th><th>Especialidad</th><th>Email</th><th>Teléfono</th><th></th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of abogados">
              <td><strong>{{ a.nombre }}</strong></td>
              <td><span class="badge badge-primary">{{ a.especialidad }}</span></td>
              <td>{{ a.email }}</td>
              <td>{{ a.telefono }}</td>
              <td><button type="button" class="btn btn-danger" (click)="eliminar(a.id)">Eliminar</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AbogadosComponent implements OnInit {
  abogados: Abogado[] = [];
  form = { nombre: '', telefono: '', email: '', especialidad: '', direccion: '' };
  passwordInfo = '';

  constructor(private abogadoService: AbogadoService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.abogadoService.list().subscribe(a => this.abogados = a);
  }

  crear(): void {
    this.abogadoService.create(this.form).subscribe(res => {
      this.passwordInfo = res.passwordTemporal;
      this.form = { nombre: '', telefono: '', email: '', especialidad: '', direccion: '' };
      this.load();
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar abogado?')) {
      this.abogadoService.delete(id).subscribe(() => this.load());
    }
  }
}
