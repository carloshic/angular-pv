import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../service.index';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { IResponse } from '../../interfaces/response.interface';
import { Status } from '../../definitions/definitions';
import swal from 'sweetalert2';
import { Observable } from 'rxjs/Observable';
import { Inventario } from '../../models/inventario.model';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) { }

  consultarTodo() {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + `/inventario`;
    return this.http.get(url, httpOptions ).map((response: IResponse): Inventario[] => {
      let retorno: Inventario[] = [];
      this.sharedService.token = response.token;

      switch ( response.status ) {
        case Status.OK:
          retorno = response.data as Inventario[];
          break;
        case Status.ERROR:
          swal.fire(response.message, response.error.message, 'error');
          break;
        case Status.SESSION_EXPIRED:
          swal.fire('La sesión  ha expirado', 'por favor vuelva a iniciar sesión', 'info').then(() => {
            this.router.navigate(['/login']);
          });
          break;
        case Status.NOT_RECORDS_FOUND:
          swal.fire('Ops!!', 'No hay Inventarioes registradas', 'info');
          break;
      }
      return retorno;
    }).catch(err => {
      swal.fire( 'Ops!!', err.message, 'error' );
      return Observable.throwError( err );
    });
  }

  consultarPorCodigoProducto(codigo: string) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/inventario/producto/' + codigo;

    return this.http.get( url, httpOptions )
                .map( (response: IResponse) => {

                  let retorno: Inventario;

                  this.sharedService.token = response.token;

                  switch ( response.status ) {
                    case Status.OK:
                      retorno = response.data as Inventario;
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
                      swal.fire('Ops!!', response.message, 'info');
                  }
                  return retorno;
                }).catch(response => {
                  swal.fire('Ops!!', response.error.error.message, 'error');
                  return Observable.throwError( response );
                });
  }

  consultarPorId(id: number) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/inventario/' + id;

    return this.http.get( url, httpOptions )
                .map( (response: IResponse) => {
                  let retorno: Inventario;
                  this.sharedService.token = response.token;

                  switch ( response.status ) {
                    case Status.OK:
                      retorno = response.data as Inventario;
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
                      swal.fire('Ops!!', response.message, 'info');
                  }
                  return retorno;
                }).catch(response => {
                  swal.fire('Ops!!', response.error.error.message, 'error');
                  return Observable.throwError( response );
                });
  }

  abastecer(idInventario: number, entrada: number) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/inventario/supply/' + idInventario;

    const inventarioDto = {
      incremento: entrada
    };
    return this.http.put(url, inventarioDto, httpOptions)
    .map((response: IResponse) => {

      this.sharedService.token = response.token;

      switch ( response.status ) {
        case Status.OK:
          swal.fire({
            type: 'success',
            title: 'Exito',
            text: `Stock actualizado con exito`,
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
    .catch(response => {
      swal.fire('Ops!!', response.error.error.message, 'error');
      return Observable.throwError( response );
    });
  }
  borrar(id: number) {

  }

  buscar(termino: string) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + `/busqueda/inventario/${termino}`;
    return this.http.get( url, httpOptions )
                .map( (response: IResponse) => {
                  return response.data;
                } )
                .catch(response => {
                  swal.fire('Ops!!', response.error.error.message, 'error');
                  return Observable.throwError( response );
                });
  }
}
