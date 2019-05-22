import { Injectable, Pipe } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { URL_SERVICIOS } from '../../config/config';
import { Producto } from '../../models/producto.model';

import swal from 'sweetalert2';
import { IResponse } from '../../interfaces/response.interface';
import { Observable } from 'rxjs/Observable';
import { Status } from '../../definitions/definitions';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { IServiceBase } from '../../interfaces/service-base.interface';

@Injectable()
export class ProductoService implements IServiceBase {
  constructor(
    private http: HttpClient,
    private router: Router,
    private _sharedService: SharedService
    ) { }

    consultarTodo(incluirInactivos: boolean = false) {
      const httpOptions = { headers: new HttpHeaders({ Authorization: this._sharedService.token.accessToken })};
      let url = URL_SERVICIOS + `/producto?inactivos=${incluirInactivos}`;
      return this.http.get(url, httpOptions ).map((response: IResponse): Producto[] => {

        switch ( response.status ) {
          case Status.OK:
          return response.data;
          case Status.ERROR:
            swal.fire(response.message, response.error.message, 'error');
          break;
          case Status.SESSION_EXPIRED:
            swal.fire('La sesión  ha expidaro', 'por favor vuelva a iniciar sesión', 'info').then(() => {
              this.router.navigate(['/login']);
            });
          break;
          case Status.NOT_RECORDS_FOUND:

          break;
        }
      }).catch(err => {
        swal.fire( 'Ops!!', err.message, 'error' );
        return Observable.throw( err );
      });
    }
    consultarPorId(id: number) {
      const httpOptions = { headers: new HttpHeaders({ Authorization: this._sharedService.token.accessToken })};
      const url = URL_SERVICIOS + '/producto/' + id;

      return this.http.get( url, httpOptions )
                  .map( (response: IResponse) => {

                    this._sharedService.token = response.token;

                    switch ( response.status ) {
                      case Status.OK:
                      return response.data;
                      case Status.ERROR:
                        swal.fire(response.message, response.error.message, 'error');
                      break;
                      case Status.SESSION_EXPIRED:
                        swal.fire('La sesión ha expidaro', 'por favor vuelva a iniciar sesión', 'info').then(() => {
                          this.router.navigate(['/login']);
                        });
                      break;
                      case Status.NOT_RECORDS_FOUND:
                          swal.fire('Ops!!', response.error.message, 'info');
                      break;
                    }
                  }).catch( (response) => {
                     swal.fire('Ops!!', response.error.message, 'error');
                     return Observable.throw( response );
                  });
    }
    registrar(producto: Producto) {
      const httpOptions = { headers: new HttpHeaders({ Authorization: this._sharedService.token.accessToken })};
      let url = URL_SERVICIOS + '/producto/';

      return this.http.post(url, producto, httpOptions)
      .map((response: IResponse) => {

        this._sharedService.token = response.token;

        switch ( response.status ) {
          case Status.OK:
              swal.fire({
                type: 'success',
                title: 'Exito',
                text: `Producto: ${producto.nombre} creado con exito`,
                showConfirmButton: false,
                timer: 1500
              });
            break;
          case Status.ERROR:
            swal.fire(response.message, response.error.message, 'error');
          break;
          case Status.SESSION_EXPIRED:
            swal.fire('La sesión ha expidaro', 'por favor vuelva a iniciar sesión', 'info').then(() => {
              this.router.navigate(['/login']);
            });
          break;
          case Status.NOT_RECORDS_FOUND:
          break;
        }
      })
      .catch((response) => {
        swal.fire('Ops!!', response.error.message, 'error');
        return Observable.throw( response );
      });
    }
    actualizar(id: number,  producto: Producto) {
      const httpOptions = { headers: new HttpHeaders({ Authorization: this._sharedService.token.accessToken })};
      let url = URL_SERVICIOS + '/producto/' + id;

      return this.http.put(url, producto, httpOptions)
      .map((response: IResponse) => {

        this._sharedService.token = response.token;

        switch ( response.status ) {
          case Status.OK:
              swal.fire({
                type: 'success',
                title: 'Exito',
                text: `Producto: ${producto.nombre} actualizado con exito`,
                showConfirmButton: false,
                timer: 1500
              });
          break;
          case Status.ERROR:
            swal.fire(response.message, response.error.message, 'error');
          break;
          case Status.SESSION_EXPIRED:
            swal.fire('La sesión ha expidaro', 'por favor vuelva a iniciar sesión', 'info').then(() => {
              this.router.navigate(['/login']);
            });
          break;
          case Status.NOT_RECORDS_FOUND:
          break;
        }
      })
      .catch((response) => {
        swal.fire('Ops!!', response.error.message, 'error');
                     return Observable.throw( response );
      });
    }
    borrar(id: number) {

    }

    buscar( termino: string, incluirInactivos: boolean = false ) {
      const httpOptions = { headers: new HttpHeaders({ Authorization: this._sharedService.token.accessToken })};
      let url = URL_SERVICIOS + `/busqueda/producto/${termino}/?inactivos=${incluirInactivos}`;
      return this.http.get( url, httpOptions )
                  .map( (resp: any) => {
                    return resp.data;
                  } )
                  .catch( err => {
                    swal.fire( 'Ocurrió un error al realizar la busqueda', err.message, 'error' );
                    return Observable.throw( err );
                  });
    }
    existeCodigo(codigo:string) {
      const httpOptions = { headers: new HttpHeaders({ Authorization: this._sharedService.token.accessToken })};
      const url = URL_SERVICIOS + '/validador/producto/existe_codigo/' + codigo;
      return this.http.get(url, httpOptions);
    }
}
