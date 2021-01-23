import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Mensaje } from '../interface/mensaje.interface';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private msgsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor(private firestore: AngularFirestore, public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe( user => {
      //console.log( 'Estado del usuario: ', user );
      if (!user) {
        return;
      }
      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
  }

  login(proveedor: string) {
    if( proveedor === 'google' ){
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }/*else{
      this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
    }*/
  }
  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

  cargarMensajes() {
    this.msgsCollection = this.firestore.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc')
    .limit(5));
    return this.msgsCollection.valueChanges().pipe(
      map((mensajes: Mensaje[]) => {
        console.log( mensajes );
        this.chats = [];
        for ( let mensaje of mensajes ) {
          this.chats.unshift( mensaje );
        }
        console.log(this.chats)
        return this.chats;
      })
    );
  }

  agregarMensaje(texto: string) {
    const mensaje: Mensaje = {
      nombre:  this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    }
    this.msgsCollection.add(mensaje);
  }
}
