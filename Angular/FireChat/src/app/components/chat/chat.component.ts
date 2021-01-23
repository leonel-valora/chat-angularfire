import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/providers/chat.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {

  mensaje = '';
  chatBody: any;
  miUsuarioId: any;
  constructor(public chatService: ChatService) {
    this.chatService.cargarMensajes().subscribe(() => {
      setTimeout( () => {
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
      }, 20);
    });
   }

  ngOnInit() {
    this.chatBody = document.getElementById('chat-body');
  }

  enviarMensaje(form: NgForm)  {
    if (form.invalid ) {
      return;
    }

    this.chatService.agregarMensaje(this.mensaje);
  }
}
