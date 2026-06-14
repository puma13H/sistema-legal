import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

interface Message {
  from: string;
  text: string;
  time: string;
}

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Mensajes</h1>
        <p class="page-subtitle">Revisa las conversaciones de tus casos y comunícate con tu abogado.</p>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div class="messages-list">
          <div *ngFor="let msg of messages" class="message-item" [class.from-me]="msg.from === 'Yo'">
            <div class="message-meta">
              <strong>{{ msg.from }}</strong>
              <span>{{ msg.time }}</span>
            </div>
            <div class="message-text">{{ msg.text }}</div>
          </div>
        </div>
        <div class="message-compose">
          <textarea class="input" rows="4" [(ngModel)]="newMessage" placeholder="Escribe tu mensaje..."></textarea>
          <button class="btn btn-primary" (click)="sendMessage()" [disabled]="!newMessage.trim()">Enviar</button>
        </div>
      </div>
    </div>
  `
})
export class MensajesComponent implements OnInit {
  messages: Message[] = [];
  newMessage = '';

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.messages = [
      { from: 'Abogado', text: 'Hola, aquí tienes la información de tu audiencia.', time: '09:10' },
      { from: 'Yo', text: 'Perfecto, ¿puedes enviarme los documentos?', time: '09:15' }
    ];
  }

  sendMessage(): void {
    const content = this.newMessage.trim();
    if (!content) return;
    this.messages.push({ from: 'Yo', text: content, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    this.newMessage = '';
  }
}
