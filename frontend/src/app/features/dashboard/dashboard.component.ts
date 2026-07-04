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
    <div [ngSwitch]="role">
      <div *ngSwitchCase="'admin'" class="dashboard-view admin-view">
        <div class="dashboard-hero">
          <div>
            <div style="margin-bottom:.75rem; display:flex; align-items:center; gap:1rem;">
              <div class="admin-badge"><span class="crown">👑</span> Administrador</div>
              <div style="color:var(--muted-light);">Vista completa del sistema</div>
            </div>
            <p class="eyebrow">Hola, {{ auth.currentUser()?.name }} 👋</p>
            <h1 class="page-title">Panel Administrativo</h1>
            <p class="page-subtitle">Administra casos, clientes y abogados desde un solo panel.</p>
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
                <strong>Administrador</strong>
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
          <div class="summary-card">
            <div>
              <p class="summary-label">Clientes</p>
              <p class="summary-value">{{ stats?.totalClientes ?? 0 }}</p>
            </div>
            <span class="summary-icon">👥</span>
          </div>
          <div class="summary-card">
            <div>
              <p class="summary-label">Abogados</p>
              <p class="summary-value">{{ stats?.totalAbogados ?? 0 }}</p>
            </div>
            <span class="summary-icon">⚖️</span>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="dashboard-column">
            <div class="card">
              <div class="card-header">
                <h2>Visión del sistema</h2>
              </div>
              <div class="card-body">
                <p>Resumen completo de usuarios, casos y recursos del sistema.</p>
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
                    <strong>Usuario nuevo</strong>
                    <p>Entrada de datos reciente en el sistema</p>
                  </div>
                  <span>Hace 1 h</span>
                </div>
              </div>
            </div>
          </div>
          <div class="dashboard-column dashboard-right">
            <div class="card quick-actions-card">
              <div class="card-header">
                <h2>Accesos administrativos</h2>
              </div>
              <div class="card-body quick-actions">
                <a routerLink="/clientes" class="quick-action">
                  <span>Gestionar clientes</span>
                  <span>➡</span>
                </a>
                <a routerLink="/abogados" class="quick-action">
                  <span>Gestionar abogados</span>
                  <span>➡</span>
                </a>
                <a routerLink="/usuarios" class="quick-action">
                  <span>Gestionar usuarios</span>
                  <span>➡</span>
                </a>
                <a class="quick-action disabled">
                  <span>Configuración avanzada</span>
                  <span>➡</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngSwitchCase="'abogado'" class="dashboard-view abogado-view abogado-new">
        <div class="abogado-top">
          <div class="abogado-badge">⚖️ <span>ABOGADO</span></div>
          <div class="abogado-sub">Gestión de casos y clientes asignados</div>
        </div>

        <div class="abogado-hero">
          <div class="welcome-card">
            <div class="welcome-left">
              <h3>Bienvenido, {{ auth.currentUser()?.name }}</h3>
              <p class="muted">Abogado Senior</p>
            </div>
            <div class="welcome-meta">
              <div class="small-card">
                <div class="label">Mis Casos Activos</div>
                <div class="value">{{ myCasosCount }}</div>
              </div>
              <div class="small-card">
                <div class="label">Audiencias Hoy</div>
                <div class="value">{{ upcomingAudienciasCount }}</div>
              </div>
              <div class="small-card">
                <div class="label">Documentos</div>
                <div class="value">{{ documentosCount }}</div>
              </div>
            </div>
          </div>

          <div class="stats-row">
            <div class="stat"> <div class="stat-label">Mis casos</div> <div class="stat-value">{{ myCasosCount }}</div> </div>
            <div class="stat"> <div class="stat-label">Audiencias</div> <div class="stat-value">{{ upcomingAudienciasCount }}</div> </div>
            <div class="stat"> <div class="stat-label">Clientes</div> <div class="stat-value">{{ stats?.totalClientes ?? 0 }}</div> </div>
            <div class="stat"> <div class="stat-label">Documentos</div> <div class="stat-value">{{ documentosCount }}</div> </div>
          </div>
        </div>

        <div class="abogado-main">
          <div class="left-col">
            <div class="card cases-card">
              <div class="card-header"><h2>Mis casos recientes</h2></div>
              <div class="card-body cases-list">
                <div *ngIf="casos.length === 0" class="empty">No tienes casos recientes.</div>
                <div *ngFor="let c of casos | slice:0:5" class="case-item">
                  <div class="case-title">{{ c.nombreCaso }}</div>
                  <div class="case-meta">Cliente: {{ c.clienteNombre || '-' }} · {{ c.estado }}</div>
                  <div class="case-actions"><a routerLink="/casos/{{c.id}}">Ver</a></div>
                </div>
              </div>
            </div>

            <div class="card agenda-card">
              <div class="card-header"><h2>Agenda de audiencias</h2></div>
              <div class="card-body">
                <div *ngIf="upcomingAudienciasCount === 0">No hay audiencias para hoy.</div>
                <!-- simplified list -->
                <div *ngFor="let c of casos | slice:0:5" class="agenda-item">
                  <div class="time">{{ c.fechaAudiencia ? (c.fechaAudiencia | date:'HH:mm') : '—' }}</div>
                  <div class="agenda-desc">{{ c.nombreCaso }} · {{ c.clienteNombre || '-' }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="right-col">
            <div class="card quick-actions-card">
              <div class="card-header"><h2>Acciones rápidas</h2></div>
              <div class="card-body quick-actions">
                <a routerLink="/casos" class="quick-action">Nuevo Caso</a>
                <a routerLink="/clientes" class="quick-action">Nuevo Cliente</a>
                <a routerLink="/documentos" class="quick-action">Subir Documento</a>
                <a class="quick-action">Nueva Tarea</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngSwitchCase="'cliente'" class="dashboard-view cliente-view">
        <div class="dashboard-hero">
          <div>
            <div style="margin-bottom:.75rem; display:flex; align-items:center; gap:1rem;">
              <div class="admin-badge"><span class="crown">👥</span> Cliente</div>
              <div style="color:var(--muted-light);">Consulta tus casos y documentos</div>
            </div>
            <p class="eyebrow">Hola, {{ auth.currentUser()?.name }} 👋</p>
            <h1 class="page-title">Panel de Cliente</h1>
            <p class="page-subtitle">Visualiza el estado de tus casos y documentos.</p>
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
                <strong>Cliente</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="summary-grid">
          <div class="summary-card">
            <div>
              <p class="summary-label">Mis casos</p>
              <p class="summary-value">{{ myCasosCount }}</p>
            </div>
            <span class="summary-icon">📂</span>
          </div>
          <div class="summary-card">
            <div>
              <p class="summary-label">Documentos</p>
              <p class="summary-value">{{ documentosCount }}</p>
            </div>
            <span class="summary-icon">📎</span>
          </div>
          <div class="summary-card">
            <div>
              <p class="summary-label">Casos abiertos</p>
              <p class="summary-value">{{ countByState('En trámite') }}</p>
            </div>
            <span class="summary-icon">🔔</span>
          </div>
          <div class="summary-card">
            <div>
              <p class="summary-label">Casos finalizados</p>
              <p class="summary-value">{{ countByState('Finalizado') }}</p>
            </div>
            <span class="summary-icon">🏁</span>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="dashboard-column">
            <div class="card">
              <div class="card-header">
                <h2>Mi relación con el caso</h2>
              </div>
              <div class="card-body">
                <p>Tienes {{ myCasosCount }} casos en el sistema.</p>
              </div>
            </div>
            <div class="card">
              <div class="card-header">
                <h2>Documentos</h2>
              </div>
              <div class="card-body">
                <p>Hay {{ documentosCount }} documentos vinculados a tus casos.</p>
              </div>
            </div>
          </div>
          <div class="dashboard-column dashboard-right">
            <div class="card quick-actions-card">
              <div class="card-header">
                <h2>Acciones</h2>
              </div>
              <div class="card-body quick-actions">
                <a routerLink="/casos" class="quick-action">
                  <span>Ver mis casos</span>
                  <span>➡</span>
                </a>
                <a class="quick-action disabled">
                  <span>Subir documento</span>
                  <span>➡</span>
                </a>
                <a class="quick-action disabled">
                  <span>Revisar audiencias</span>
                  <span>➡</span>
                </a>
                <a class="quick-action disabled">
                  <span>Contactar abogado</span>
                  <span>➡</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngSwitchDefault class="dashboard-view cliente-view">
        <p>Rol no identificado. Vuelve a iniciar sesión.</p>
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

  get role(): string {
    return this.auth.currentUser()?.role?.toLowerCase() ?? 'unknown';
  }

  get roleLabel(): string {
    if (this.role === 'admin') {
      return 'Administrador';
    }
    if (this.role === 'abogado') {
      return 'Abogado';
    }
    return 'Cliente';
  }

  get roleDescription(): string {
    if (this.role === 'admin') {
      return 'Vista completa del sistema';
    }
    if (this.role === 'abogado') {
      return 'Gestiona tus casos y audiencias';
    }
    return 'Consulta tus casos y documentos';
  }

  get roleIcon(): string {
    if (this.role === 'admin') {
      return '👑';
    }
    if (this.role === 'abogado') {
      return '⚖️';
    }
    return '👥';
  }

  get pageTitle(): string {
    if (this.role === 'admin') {
      return 'Panel Administrativo';
    }
    if (this.role === 'abogado') {
      return 'Panel de Abogado';
    }
    return 'Panel de Cliente';
  }

  get pageSubtitle(): string {
    if (this.role === 'admin') {
      return 'Administra casos, clientes y recursos del sistema.';
    }
    if (this.role === 'abogado') {
      return 'Revisa tus casos asignados y prepara tus audiencias.';
    }
    return 'Visualiza el estado de tus casos y documentos.';
  }

  ngOnInit(): void {
    this.dashboardService.stats().subscribe(s => this.stats = s);
    this.casoService.list().subscribe(c => {
      this.casos = c;
      this.computeRoleCounts();
    });
  }

  private getRoleLabel(): string {
    if (this.auth.hasRole('admin')) {
      return 'Administrador';
    }
    if (this.auth.hasRole('abogado')) {
      return 'Abogado';
    }
    return 'Cliente';
  }

  private getRoleDescription(): string {
    if (this.auth.hasRole('admin')) {
      return 'Vista completa del sistema';
    }
    if (this.auth.hasRole('abogado')) {
      return 'Gestiona tus casos y audiencias';
    }
    return 'Consulta tus casos y documentos';
  }

  private getRoleIcon(): string {
    if (this.auth.hasRole('admin')) {
      return '👑';
    }
    if (this.auth.hasRole('abogado')) {
      return '⚖️';
    }
    return '👥';
  }

  private getPageTitle(): string {
    if (this.auth.hasRole('admin')) {
      return 'Panel Administrativo';
    }
    if (this.auth.hasRole('abogado')) {
      return 'Panel de Abogado';
    }
    return 'Panel de Cliente';
  }

  private getPageSubtitle(): string {
    if (this.auth.hasRole('admin')) {
      return 'Administra casos, clientes y recursos del sistema.';
    }
    if (this.auth.hasRole('abogado')) {
      return 'Revisa tus casos asignados y prepara tus audiencias.';
    }
    return 'Visualiza el estado de tus casos y documentos.';
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
