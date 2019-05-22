import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Unidad } from '../../models/unidad.model';
import { IServiceBase } from '../../interfaces/service-base.interface';
import { URL_SERVICIOS } from '../../config/config';
import { SharedService } from '../shared/shared.service';
import { IResponse } from '../../interfaces/response.interface';
import { Status } from '../../definitions/definitions';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UnidadService implements IServiceBase {

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) { }

  consultarTodo(incluirInactivos: boolean = false) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + `/unidad?inactivos=${incluirInactivos}`;
    return this.http.get(url, httpOptions ).map((response: IResponse): Unidad[] => {

      this.sharedService.token = response.token;

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
      return Observable.throwError( err );
    });
  }
  consultarPorId(id: number) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/unidad/' + id;

    return this.http.get( url, httpOptions )
                .map( (response: IResponse) => {

                  this.sharedService.token = response.token;

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
                   return Observable.throwError( response );
                });
  }
  registrar(unidad: Unidad) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/unidad/';

    return this.http.post(url, unidad, httpOptions)
    .map((response: IResponse) => {

      this.sharedService.token = response.token;

      switch ( response.status ) {
        case Status.OK:
          swal.fire({
            type: 'success',
            title: 'Exito',
            text: `Unidad: ${unidad.codigo} creada con exito`,
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
      return Observable.throwError( response );
    });
  }
  actualizar(id: number, unidad: Unidad) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/unidad/' + id;

    return this.http.put(url, unidad, httpOptions)
    .map((response: IResponse) => {

      this.sharedService.token = response.token;

      switch ( response.status ) {
        case Status.OK:
          swal.fire({
            type: 'success',
            title: 'Exito',
            text: `Unidad: ${unidad.codigo} actualizada con exito`,
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
      return Observable.throwError( response );
    });
  }
  borrar(id: number) {

  }

  buscar(termino: string, incluirInactivos: boolean) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + `/busqueda/unidad/${termino}/?inactivos=${incluirInactivos}`;
    return this.http.get( url, httpOptions )
                .map( (response: IResponse) => {
                  return response.data;
                } )
                .catch( response => {
                  swal.fire('Ops!!', response.error.message, 'error');
                  return Observable.throwError( response );
                });
  }
}
