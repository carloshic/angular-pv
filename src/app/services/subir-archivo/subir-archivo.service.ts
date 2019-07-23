import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import swal from 'sweetalert2';
import { IResponse } from '../../interfaces/response.interface';

@Injectable()
export class SubirArchivoService {
  public progreso = 0;
  constructor(
    private http: HttpClient
  ) { }


  subirArchivo( file: File, type: string, id: number ) {

    return new Promise( (resolve, reject ) => {

      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append( 'file', file, file.name );

      xhr.onreadystatechange = function() {
        console.log(xhr.readyState);
        if ( xhr.readyState === 4 ) {

          if ( xhr.status === 200 ) {
            console.log( 'Imagen subida' );
            resolve( JSON.parse( xhr.response ) );
          } else {
            console.log( 'Fallo la subida' );
            reject( xhr.response );
          }
        }
      };

      const url = URL_SERVICIOS + '/upload/' + type + '/' + id;

      xhr.open('PUT', url, true );
      xhr.send( formData );

    });
  }

  subirArchivo2(file: File, type: string, id: number) {
      const url = URL_SERVICIOS + '/upload/' + type + '/' + id;

      const formData = new FormData();

      formData.append( 'file', file, file.name );

      return this.http.put(url, formData, {
        reportProgress: true,
        observe: 'events'
      }).map((event) => {

        let retorno: IResponse;

        if ( event.type === HttpEventType.UploadProgress) {

          this.progreso = Math.round(100 * event.loaded / event.total);

        } else if ( event.type === HttpEventType.Response ) {

          retorno = event.body as IResponse;
        }

        return retorno;
      }).catch((response) => {
          swal.fire({
            type: 'error',
            title: 'Ops!!',
            text: response.error.error.message,
            showConfirmButton: false,
            timer: 1500
          });
          return Observable.throwError( response );
      });
  }
}
