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
    <div class="dashboard-hero">
      <div>
        <div style="margin-bottom:.75rem; display:flex; align-items:center; gap:1rem;">
          <div class="admin-badge"><span class="crown">👑</span> ADMINISTRADOR</div>
          <div style="color:var(--muted-light);">Vista completa del sistema</div>
        </div>
        <p class="eyebrow">Hola, {{ auth.currentUser()?.name }} 👋</p>
        <h1 class="page-title">Bienvenido al Sistema Jurídico</h1>
        <p class="page-subtitle">Administra tus casos, clientes y documentos desde un solo panel.</p>
      </div>
      <div class="hero-actions">
        <div class="search-card">
          <input class="input search-input" type="text" placeholder="Buscar casos, clientes, documentos..." />
          <button type="button" class="btn btn-primary">Buscar</button>
        </div>
        <div class="hero-meta">
          <div>
            <span class="meta-label">Hoy</span>
            <strong>{{ today | date:'d MMM yyyy' }}</strong>
          </div>
          <div>
            <span class="meta-label">Rol</span>
            <strong>{{ auth.currentUser()?.role }}</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="summary-grid">
      <div class="summary-card">
        <div>
          <p class="summary-label">Total casos</p>
          <p class="summary-value">{{ stats?.totalCasos ?? 0 }}</p>
        </div>
        <span class="summary-icon">📁</span>
      </div>
      <div class="summary-card">
        <div>
          <p class="summary-label">Casos activos</p>
          <p class="summary-value">{{ stats?.casosActivos ?? 0 }}</p>
        </div>
        <span class="summary-icon">✓</span>
      </div>
      <div class="summary-card" *ngIf="auth.hasRole('admin')">
        <div>
          <p class="summary-label">Clientes</p>
          <p class="summary-value">{{ stats?.totalClientes ?? 0 }}</p>
        </div>
        <span class="summary-icon">👥</span>
      </div>
      <div class="summary-card" *ngIf="auth.hasRole('admin')">
        <div>
          <p class="summary-label">Abogados</p>
          <p class="summary-value">{{ stats?.totalAbogados ?? 0 }}</p>
        </div>
        <span class="summary-icon">⚖</span>
      </div>
      <div class="summary-card">
        <div>
          <p class="summary-label">Mis casos</p>
          <p class="summary-value">{{ myCasosCount }}</p>
        </div>
        <span class="summary-icon">📂</span>
      </div>
      <div class="summary-card">
        <div>
          <p class="summary-label">Audiencias</p>
          <p class="summary-value">{{ upcomingAudienciasCount }}</p>
        </div>
        <span class="summary-icon">🗓️</span>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-column">
        <div class="card">
          <div class="card-header">
            <h2>Casos por estado</h2>
          </div>
          <div class="card-body">
            <div class="progress-list">
              <div class="progress-item">
                <span>En trámite</span>
                <span>{{ countByState('En trámite') }}</span>
              </div>
              <div class="progress-bar progress-bar-blue" [style.width]="percentByState('En trámite') + '%'">
              </div>
              <div class="progress-item">
                <span>Finalizado</span>
                <span>{{ countByState('Finalizado') }}</span>
              </div>
              <div class="progress-bar progress-bar-green" [style.width]="percentByState('Finalizado') + '%'">
              </div>
              <div class="progress-item">
                <span>Pendiente</span>
                <span>{{ countByState('Pendiente') }}</span>
              </div>
              <div class="progress-bar progress-bar-amber" [style.width]="percentByState('Pendiente') + '%'">
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2>Actividad reciente</h2>
          </div>
          <div class="card-body activity-list">
            <div class="activity-item">
              <div>
                <strong>Se creó un nuevo caso</strong>
                <p>{{ casos.length ? casos[0]?.nombreCaso : 'Sin actividad reciente' }}</p>
              </div>
              <span>Ahora</span>
            </div>
            <div class="activity-item">
              <div>
                <strong>Cliente registrado</strong>
                <p>Nuevo cliente agregado al sistema</p>
              </div>
              <span>Hace 1 h</span>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-column dashboard-right">
        <div class="card quick-actions-card">
          <div class="card-header">
            <h2>Accesos rápidos</h2>
          </div>
          <div class="card-body quick-actions">
            <a routerLink="/casos/nuevo" class="quick-action">
              <span>+ Nuevo caso</span>
              <span>➡</span>
            </a>
            <a routerLink="/clientes" class="quick-action">
              <span>+ Nuevo cliente</span>
              <span>➡</span>
            </a>
            <a class="quick-action disabled">
              <span>+ Nueva audiencia</span>
              <span>➡</span>
            </a>
            <a class="quick-action disabled">
              <span>+ Subir documento</span>
              <span>➡</span>
            </a>
          </div>
        </div>

        <div class="card calendar-card">
          <div class="card-header">
            <h2>Calendario</h2>
          </div>
          <div class="card-body">
            <div class="calendar-grid">
              <div class="calendar-weekday">Lu</div>
              <div class="calendar-weekday">Ma</div>
              <div class="calendar-weekday">Mi</div>
              <div class="calendar-weekday">Ju</div>
              <div class="calendar-weekday">Vi</div>
              <div class="calendar-weekday">Sa</div>
              <div class="calendar-weekday">Do</div>
              <div class="calendar-day inactive">27</div>
              <div class="calendar-day inactive">28</div>
              <div class="calendar-day inactive">29</div>
              <div class="calendar-day active">1</div>
              <div class="calendar-day today">2</div>
              <div class="calendar-day">3</div>
              <div class="calendar-day">4</div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
  today = new Date();

  constructor(
    public auth: AuthService,
    private dashboardService: DashboardService,
    private casoService: CasoService,
    private documentoService: DocumentoService
  ) {}

  ngOnInit(): void {
    this.dashboardService.stats().subscribe(s => this.stats = s);
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

    const relevant = this.casos.filter(c => (this.auth.hasRole('abogado') && c.abogadoId === userId) || (this.auth.hasRole('cliente') && c.clienteId === userId)).slice(0, 10);
    if (relevant.length === 0) { this.documentosCount = 0; return; }

    const calls = relevant.map(caso => this.documentoService.list(caso.id));
    forkJoin(calls).subscribe(results => {
      this.documentosCount = results.reduce((sum, arr) => sum + (arr?.length ?? 0), 0);
    }, () => this.documentosCount = 0);
  }

  countByState(state: string): number {
    return this.casos.filter(c => c.estado === state).length;
  }

  percentByState(state: string): number {
    if (!this.casos.length) {
      return 0;
    }
    return Math.round((this.countByState(state) / this.casos.length) * 100);
  }
}
