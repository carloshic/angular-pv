import { Injectable } from '@angular/core';
import { IServiceBase } from '../../interfaces/service-base.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { IResponse } from '../../interfaces/response.interface';
import { Status } from '../../definitions/definitions';
import { Marca } from '../../models/marca.model';
import swal from 'sweetalert2';
import { Observable } from 'rxjs/Observable';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class MarcaService implements IServiceBase  {

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) { }

  consultarTodo(incluirInactivos: boolean) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + `/marca?inactivos=${incluirInactivos}`;
    return this.http.get(url, httpOptions ).map((response: IResponse): Marca[] => {

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
    const url = URL_SERVICIOS + '/marca/' + id;

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
  registrar(marca: Marca) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/Marca/';

    return this.http.post(url, marca, httpOptions)
    .map((response: IResponse) => {

      this.sharedService.token = response.token;

      switch ( response.status ) {
        case Status.OK:
          swal.fire({
            type: 'success',
            title: 'Exito',
            text: `Marca: ${marca.nombre} creada con exito`,
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
  actualizar(id: number, marca: Marca) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/marca/' + id;

    return this.http.put(url, marca, httpOptions)
    .map((response: IResponse) => {

      this.sharedService.token = response.token;

      switch ( response.status ) {
        case Status.OK:
          swal.fire({
            type: 'success',
            title: 'Exito',
            text: `Marca: ${marca.nombre} actualizada con exito`,
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
  borrar(id: number) { }

  buscar(termino: string, incluirInactivos: boolean) {
    const httpOptions = {
        headers: new HttpHeaders({
          Authorization: this.sharedService.token.accessToken
        })};
    const url = URL_SERVICIOS + `/busqueda/marca/${termino}/?inactivos=${incluirInactivos}`;
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
