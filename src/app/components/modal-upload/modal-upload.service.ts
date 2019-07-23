import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import swal from 'sweetalert2';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';

@Injectable()
export class ModalUploadService {

  public tipo: string;
  public id: number;

  public oculto = 'oculto';

  public notificacion = new EventEmitter<any>();

  constructor(
    private subirArchivservice: SubirArchivoService,
  ) { }

  ocultarModal() {
    this.oculto = 'oculto';
    this.tipo = null;
    this.id = null;
  }

  mostrarModal( tipo: string, id: number ) {

    this.subirArchivservice.progreso = 0;

    if ( tipo && id && id > 0) {
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
