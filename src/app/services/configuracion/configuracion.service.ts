import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { IResponse } from 'src/app/interfaces/response.interface';
import { Configuracion } from 'src/app/models/configuracion.model';
import { Status } from 'src/app/definitions/definitions';
import swal from 'sweetalert2';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) { }

  consultarTodo() {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + `/configuracion`;
    return this.http.get(url, httpOptions ).map((response: IResponse): Configuracion[] => {
      let retorno: Configuracion[] = [];
      this.sharedService.token = response.token;

      switch ( response.status ) {
        case Status.OK:
          retorno = response.data as Configuracion[];
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
          swal.fire('Ops!!', 'No hay configuraciones registradas', 'info');
          break;
      }
      return retorno;
    }).catch(response => {
      swal.fire('Ops!!', response.error.error.message, 'error');
      return Observable.throwError( response );
    });
  }
  consultarPorId(id: number) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/configuracion/' + id;

    return this.http.get( url, httpOptions )
                .map( (response: IResponse) => {

                  this.sharedService.token = response.token;

                  switch ( response.status ) {
                    case Status.OK:
                    return response.data as Configuracion;
                    case Status.ERROR:
                      swal.fire(response.message, response.error.message, 'error');
                      return null;
                    case Status.SESSION_EXPIRED:
                      swal.fire('La sesión ha expidaro', 'por favor vuelva a iniciar sesión', 'info').then(() => {
                        this.router.navigate(['/login']);
                      });
                      return null;
                    case Status.NOT_RECORDS_FOUND:
                      swal.fire('Ops!!', response.message, 'info');
                      return null;
                  }
                }).catch(response => {
                  swal.fire('Ops!!', response.error.error.message, 'error');
                  return Observable.throwError( response );
                });
  }

  consultarPorCodigo(codigo: string) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/configuracion/codigo/' + codigo;

    return this.http.get( url, httpOptions )
                .map( (response: IResponse) => {
                  let retorno: Configuracion = null;

                  this.sharedService.token = response.token;

                  switch ( response.status ) {
                    case Status.OK:
                      retorno = response.data as Configuracion;
                      break;
                    case Status.ERROR:
                      swal.fire(response.message, response.error.message, 'error');
                      retorno = null;
                      break;
                    case Status.SESSION_EXPIRED:
                      swal.fire('La sesión ha expidaro', 'por favor vuelva a iniciar sesión', 'info').then(() => {
                        this.router.navigate(['/login']);
                      });
                      retorno = null;
                      break;
                    case Status.NOT_RECORDS_FOUND:
                      swal.fire('Ops!!', response.message, 'info');
                      retorno = null;
                      break;
                  }
                  return retorno;
                }).catch(response => {
                  swal.fire('Ops!!', response.error.error.message, 'error');
                  return Observable.throwError( response );
                });
  }
  registrar(configuracion: Configuracion) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/configuracion/';

    return this.http.post(url, configuracion, httpOptions)
    .map((response: IResponse) => {

      this.sharedService.token = response.token;

      switch ( response.status ) {
        case Status.OK:
          swal.fire({
            type: 'success',
            title: 'Exito',
            text: `configuracion: ${configuracion.codigo} creada con exito`,
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
  actualizar(id: number, configuracion: Configuracion) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/configuracion/' + id;

    return this.http.put(url, configuracion, httpOptions)
    .map((response: IResponse) => {

      this.sharedService.token = response.token;

      switch ( response.status ) {
        case Status.OK:
          swal.fire({
            type: 'success',
            title: 'Exito',
            text: `Configuracion: ${configuracion.codigo} actualizada con exito`,
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
    const url = URL_SERVICIOS + `/busqueda/configuracion/${termino}`;
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
