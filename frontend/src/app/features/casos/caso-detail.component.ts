import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CasoService } from '../../core/services/caso.service';
import { MensajeService } from '../../core/services/mensaje.service';
import { DocumentoService } from '../../core/services/documento.service';
import { AuthService } from '../../core/services/auth.service';
import { Caso, Documento, Mensaje } from '../../core/models';

@Component({
  selector: 'app-caso-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-header">
      <div>
        <a routerLink="/casos" class="btn-link">← Volver a casos</a>
        <ng-container *ngIf="caso">
          <h1 class="page-title" style="margin-top:.5rem">{{ caso.nombreCaso }}</h1>
          <p class="page-subtitle">Caso #{{ caso.id }}</p>
        </ng-container>
      </div>
    </div>

    <ng-container *ngIf="caso; else noCaso">
      <div class="card" style="margin-bottom:1.5rem">
        <div class="card-body">
          <div class="detail-grid">
            <div class="detail-item"><label>Cliente</label><span>{{ caso.clienteNombre }}</span></div>
            <div class="detail-item"><label>Abogado</label><span>{{ caso.abogadoNombre }}</span></div>
            <div class="detail-item"><label>Estado</label>
              <ng-container *ngIf="canEditState(); else readonlyState">
                <select class="input" [(ngModel)]="caso.estado" name="estado">
                  <option value="En trámite">En trámite</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </ng-container>
              <ng-template #readonlyState>
                <span class="badge badge-primary">{{ caso.estado }}</span>
              </ng-template>
            </div>
            <div class="detail-item"><label>Apertura</label><span>{{ caso.fechaApertura }}</span></div>
            <ng-container *ngIf="caso.tarifa">
              <div class="detail-item"><label>Tarifa</label><span>S/ {{ caso.tarifa }}</span></div>
            </ng-container>
          </div>
          <ng-container *ngIf="caso.descripcion">
            <p style="margin:1rem 0 0;color:var(--muted)">{{ caso.descripcion }}</p>
          </ng-container>
          <div *ngIf="canEditState()" style="margin-top:1rem; display:flex; gap:.75rem; align-items:center;">
            <button type="button" class="btn btn-primary" (click)="saveCase()">Guardar cambios</button>
            <span style="color:var(--muted)">Cambio de estado permitido para abogado y admin.</span>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:1.5rem">
        <div class="card-header"><h2>Mensajes</h2></div>
        <div class="card-body">
          <div class="msg-list">
            <div *ngFor="let m of mensajes" class="msg-item">
              <strong>{{ m.userName }}</strong>
              <p>{{ m.contenido }}</p>
            </div>
            <ng-container *ngIf="!mensajes.length">
              <p class="empty-state" style="padding:1rem">Sin mensajes aún</p>
            </ng-container>
          </div>
          <form (ngSubmit)="enviarMensaje()" style="margin-top:1rem">
            <textarea class="input" [(ngModel)]="nuevoMensaje" name="mensaje" rows="3" placeholder="Escribe un mensaje..."></textarea>
            <button type="submit" class="btn btn-primary" style="margin-top:.5rem">Enviar mensaje</button>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h2>Documentos</h2></div>
        <div class="card-body">
          <ng-container *ngIf="documentos.length; else noDocumentos">
            <table class="data-table">
              <thead><tr><th>Nombre</th><th>Tipo</th><th></th></tr></thead>
              <tbody>
                <tr *ngFor="let d of documentos">
                  <td>{{ d.nombre }}</td>
                  <td><span class="badge badge-warning">{{ d.tipoArchivo }}</span></td>
                  <td><button type="button" class="btn-link" (click)="descargar(d.id)">Descargar</button></td>
                </tr>
              </tbody>
            </table>
          </ng-container>
          <ng-template #noDocumentos>
            <p class="empty-state" style="padding:1rem">Sin documentos</p>
          </ng-template>
          <form (ngSubmit)="subirDocumento()" style="margin-top:1.5rem;display:grid;gap:.75rem;max-width:480px">
            <div class="form-group">
              <label>Nombre del documento</label>
              <input class="input" type="text" [(ngModel)]="docNombre" name="docNombre" required />
            </div>
            <div class="form-group">
              <label>Archivo</label>
              <input class="input" type="file" (change)="onFile($event)" required />
            </div>
            <button type="submit" class="btn btn-primary">Subir documento</button>
          </form>
        </div>
      </div>
    </ng-container>
    <ng-template #noCaso>
      <div class="empty-state">Caso no encontrado</div>
    </ng-template>
  `
})
export class CasoDetailComponent implements OnInit {
  caso: Caso | null = null;
  mensajes: Mensaje[] = [];
  documentos: Documento[] = [];
  nuevoMensaje = '';
  docNombre = '';
  selectedFile: File | null = null;
  private casoId = 0;

  constructor(
    private route: ActivatedRoute,
    private casoService: CasoService,
    private mensajeService: MensajeService,
    private documentoService: DocumentoService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.casoId = Number(this.route.snapshot.paramMap.get('id'));
    this.casoService.get(this.casoId).subscribe(c => this.caso = c);
    this.loadMensajes();
    this.loadDocumentos();
  }

  loadMensajes(): void {
    this.mensajeService.list(this.casoId).subscribe(m => this.mensajes = m);
  }

  loadDocumentos(): void {
    this.documentoService.list(this.casoId).subscribe(d => this.documentos = d);
  }

  canEditState(): boolean {
    return this.auth.hasRole('admin') || this.auth.hasRole('abogado');
  }

  saveCase(): void {
    if (!this.caso) return;
    this.casoService.update(this.caso.id, {
      clienteId: this.caso.clienteId,
      nombreCaso: this.caso.nombreCaso,
      estado: this.caso.estado,
      fechaApertura: this.caso.fechaApertura,
      descripcion: this.caso.descripcion,
      tarifa: this.caso.tarifa,
      fechaAudiencia: this.caso.fechaAudiencia
    }).subscribe(c => this.caso = c);
  }

  enviarMensaje(): void {
    if (!this.nuevoMensaje.trim()) return;
    this.mensajeService.send(this.casoId, this.nuevoMensaje).subscribe(() => {
      this.nuevoMensaje = '';
      this.loadMensajes();
    });
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  subirDocumento(): void {
    if (!this.selectedFile || !this.docNombre.trim()) return;
    this.documentoService.upload(this.casoId, this.docNombre, this.selectedFile).subscribe(() => {
      this.docNombre = '';
      this.selectedFile = null;
      this.loadDocumentos();
    });
  }

  descargar(id: number): void {
    this.documentoService.download(id).subscribe(res => {
      const blob = res.body!;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documento-${id}`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
