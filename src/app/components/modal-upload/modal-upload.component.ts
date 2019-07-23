import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

import swal from 'sweetalert2';
import { IResponse } from '../../interfaces/response.interface';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string;

  constructor(
    public subirArchivoService: SubirArchivoService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;

    this.modalUploadService.ocultarModal();
  }

  seleccionImage( archivo: File ) {

    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }

    if ( archivo.type.indexOf('image') < 0 ) {
      swal.fire('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp = reader.result.toString();

  }

  subirImagen() {

    // this.subirArchivoService.subirArchivo( this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id )
    //       .then( (response: IResponse) => {

    //         this.modalUploadService.notificacion.emit( response );
    //         swal.fire({
    //           type: 'success',
    //           title: 'Exito',
    //           text: 'Imagen actualizada con exito',
    //           showConfirmButton: false,
    //           timer: 1500
    //         });

    //         this.cerrarModal();

    //       })
    //       .catch( err => {
    //         swal.fire( 'Ops!!', 'Ocurio un error al subir la imagen', 'error' );
    //       });

    this.subirArchivoService.subirArchivo2( this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id )
          .subscribe( (response: IResponse) => {

            if ( response ) {
              this.modalUploadService.notificacion.emit( response );
            }


            this.cerrarModal();

          });

  }

}
