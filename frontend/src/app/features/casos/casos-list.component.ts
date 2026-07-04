import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CasoService } from '../../core/services/caso.service';
import { AuthService } from '../../core/services/auth.service';
import { Caso } from '../../core/models';

@Component({
  selector: 'app-casos-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ auth.hasRole('cliente') ? 'Mis Casos' : 'Casos' }}</h1>
        <p class="page-subtitle">{{ auth.hasRole('cliente') ? 'Lista de casos asignados a tu cuenta' : 'Listado de casos legales' }}</p>
      </div>
      <div *ngIf="auth.hasRole('abogado')">
        <a routerLink="/casos/nuevo" class="btn btn-primary">Nuevo caso</a>
      </div>
    </div>

    <div class="card">
      <div class="table-wrap">
        <ng-container *ngIf="loading; else showCasos">
          <div class="empty-state">Cargando casos...</div>
        </ng-container>
        <ng-template #showCasos>
          <ng-container *ngIf="casos.length; else noCasos">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre del caso</th>
                  <th>Cliente</th>
                  <th>Abogado</th>
                  <th>Estado</th>
                  <th>Apertura</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let caso of casos">
                  <td>#{{ caso.id }}</td>
                  <td><strong>{{ caso.nombreCaso }}</strong></td>
                  <td>{{ caso.clienteNombre }}</td>
                  <td>{{ caso.abogadoNombre }}</td>
                  <td><span class="badge badge-primary">{{ caso.estado }}</span></td>
                  <td>{{ caso.fechaApertura }}</td>
                  <td><a [routerLink]="['/casos', caso.id]" class="btn-link">Ver detalle</a></td>
                </tr>
              </tbody>
            </table>
          </ng-container>
          <ng-template #noCasos>
            <div class="empty-state">No hay casos registrados</div>
          </ng-template>
        </ng-template>
      </div>
    </div>
  `
})
export class CasosListComponent implements OnInit {
  casos: Caso[] = [];
  loading = false;

  constructor(
    private casoService: CasoService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.casoService.list().subscribe({
      next: data => { this.casos = data; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
