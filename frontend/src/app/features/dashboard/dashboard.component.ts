import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { CasoService } from '../../core/services/caso.service';
import { DocumentoService } from '../../core/services/documento.service';
import { AuthService } from '../../core/services/auth.service';
import { forkJoin } from 'rxjs';
import { Caso, DashboardStats } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Resumen general del sistema</p>
      </div>
    </div>

    <ng-container *ngIf="stats">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card-icon indigo">📁</div>
          <div>
            <div class="stat-label">Total casos</div>
            <div class="stat-value">{{ stats.totalCasos }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon green">✓</div>
          <div>
            <div class="stat-label">Casos activos</div>
            <div class="stat-value">{{ stats.casosActivos }}</div>
          </div>
        </div>
        <ng-container *ngIf="auth.hasRole('admin')">
          <div class="stat-card">
            <div class="stat-card-icon blue">👥</div>
            <div>
              <div class="stat-label">Clientes</div>
              <div class="stat-value">{{ stats.totalClientes }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon amber">⚖</div>
            <div>
              <div class="stat-label">Abogados</div>
              <div class="stat-value">{{ stats.totalAbogados }}</div>
            </div>
          </div>
        </ng-container>
      </div>
      <!-- Role specific quick cards -->
      <div *ngIf="auth.hasRole('abogado') || auth.hasRole('cliente')" class="stats-grid" style="margin-top:1rem">
        <div class="stat-card">
          <div class="stat-card-icon purple">⚙️</div>
          <div>
            <div class="stat-label">Mis casos</div>
            <div class="stat-value">{{ myCasosCount }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon amber">🗓️</div>
          <div>
            <div class="stat-label">Próximas audiencias</div>
            <div class="stat-value">{{ upcomingAudienciasCount }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon teal">💬</div>
          <div>
            <div class="stat-label">Mensajes</div>
            <div class="stat-value">—</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon teal">📎</div>
          <div>
            <div class="stat-label">Documentos</div>
            <div class="stat-value">{{ documentosCount }}</div>
          </div>
        </div>
      </div>
    </ng-container>

    <div class="card">
      <div class="card-header">
        <h2>Últimos casos</h2>
        <a routerLink="/casos" class="btn-link">Ver todos →</a>
      </div>
      <div class="table-wrap">
        <ng-container *ngIf="casos.length; else noCasos">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Caso</th>
                <th>Cliente</th>
                <th>Abogado</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let caso of casos.slice(0, 8)">
                <td>#{{ caso.id }}</td>
                <td><a [routerLink]="['/casos', caso.id]">{{ caso.nombreCaso }}</a></td>
                <td>{{ caso.clienteNombre }}</td>
                <td>{{ caso.abogadoNombre }}</td>
                <td><span class="badge badge-primary">{{ caso.estado }}</span></td>
              </tr>
            </tbody>
          </table>
        </ng-container>
        <ng-template #noCasos>
          <div class="empty-state">No hay casos registrados</div>
        </ng-template>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  casos: Caso[] = [];
  myCasosCount = 0;
  upcomingAudienciasCount = 0;
  documentosCount = 0;

  constructor(
    public auth: AuthService,
    private dashboardService: DashboardService,
    private casoService: CasoService
    , private documentoService: DocumentoService
  ) {}

  ngOnInit(): void {
    this.dashboardService.stats().subscribe(s => this.stats = s);
    // load casos and recompute role-specific counts when they arrive
    this.casoService.list().subscribe(c => {
      this.casos = c;
      this.computeRoleCounts();
    });
  }

  private computeRoleCounts(): void {
    const userId = this.auth.currentUser()?.userId ?? null;
    if (!userId) { this.myCasosCount = 0; this.upcomingAudienciasCount = 0; return; }

    if (this.auth.hasRole('abogado')) {
      this.myCasosCount = this.casos.filter(x => x.abogadoId === userId).length;
      this.upcomingAudienciasCount = this.casos.filter(x => x.abogadoId === userId && x.fechaAudiencia && new Date(x.fechaAudiencia) > new Date()).length;
    } else if (this.auth.hasRole('cliente')) {
      this.myCasosCount = this.casos.filter(x => x.clienteId === userId).length;
      this.upcomingAudienciasCount = this.casos.filter(x => x.clienteId === userId && x.fechaAudiencia && new Date(x.fechaAudiencia) > new Date()).length;
    } else {
      this.myCasosCount = 0;
      this.upcomingAudienciasCount = 0;
    }

    // compute documentos count for the user's cases (limit to first 10 cases to avoid many requests)
    const relevant = this.casos.filter(c => (this.auth.hasRole('abogado') && c.abogadoId === userId) || (this.auth.hasRole('cliente') && c.clienteId === userId)).slice(0, 10);
    if (relevant.length === 0) { this.documentosCount = 0; return; }

    const calls = relevant.map(caso => this.documentoService.list(caso.id));
    forkJoin(calls).subscribe(results => {
      this.documentosCount = results.reduce((sum, arr) => sum + (arr?.length ?? 0), 0);
    }, () => this.documentosCount = 0);
  }
}
