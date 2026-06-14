import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Calendario</h1>
        <p class="page-subtitle">Visualiza el calendario de audiencias y fechas importantes.</p>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <p>Esta sección está en construcción. Aquí se mostrará el calendario de eventos.</p>
        <a routerLink="/dashboard" class="btn btn-primary">Volver al dashboard</a>
      </div>
    </div>
  `
})
export class CalendarioComponent {}
