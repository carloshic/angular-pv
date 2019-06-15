import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SubirArchivoService {

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

    return new Promise( (resolve, reject ) => {
      const url = URL_SERVICIOS + '/upload/' + type + '/' + id;
  
      const formData = new FormData();
  
      formData.append( 'file', file, file.name );
  
      this.http.post<any>(url, formData, {
        reportProgress: true,
        observe: 'events'
      }).map((event) => {
        switch (event.type) {
  
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / event.total);
            console.log(progress);
            //return { status: 'progress', message: progress };
            break;
          case HttpEventType.Response:
            resolve(event.body);
            break;
          default:
            reject(`Unhandled event: ${event.type}`);
            break;
        }
      }).catch((error) => {
          console.log(error);
          return Observable.throwError( error );
      });
    });
  }
}
