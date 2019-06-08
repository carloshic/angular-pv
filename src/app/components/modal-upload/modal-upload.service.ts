import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import swal from 'sweetalert2';

@Injectable()
export class ModalUploadService {

  public tipo: string;
  public id: number;

  public oculto = 'oculto';

  public notificacion = new EventEmitter<any>();

  constructor() { }

  ocultarModal() {
    this.oculto = 'oculto';
    this.tipo = null;
    this.id = null;
  }

  mostrarModal( tipo: string, id: number ) {
    if ( tipo && id) {
      this.oculto = '';
      this.id = id;
      this.tipo = tipo;
    } else {
      swal.fire({
        type: 'warning',
        title: 'Parametros no validos',
        text: 'Los parametros recibidos son invalido',
        showConfirmButton: false,
        timer: 2000
      });
    }
    
  }

}
