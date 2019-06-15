import { Injectable } from '@angular/core';
import { IServiceBase } from '../../interfaces/service-base.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { IResponse } from '../../interfaces/response.interface';
import { Status } from '../../definitions/definitions';
import { Categori } from '../../models/categori.model';
import swal from 'sweetalert2';
import { Observable } from 'rxjs/Observable';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class CategoriaService implements IServiceBase {

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) { }
  consultarTodo(incluirInactivos: boolean = false) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + `/categoria?inactivos=${incluirInactivos}`;
    return this.http.get(url, httpOptions ).map((response: IResponse): Categori[] => {
      let retorno: Categori[] = [];
      switch ( response.status ) {
        case Status.OK:
          retorno = response.data;
          break;
        case Status.ERROR:
        swal.fire(response.message, response.error.message, 'error');
        break;
        case Status.SESSION_EXPIRED:
        swal.fire('La sesión  ha expidaro', 'por favor vuelva a iniciar sesión', 'info').then(() => {
          this.router.navigate(['/login']);
        });
        break;
        case Status.NOT_RECORDS_FOUND:
          swal.fire('Ops!!', 'No hay categorias registradas', 'info');
          break;
      }
      return retorno;
    }).catch(err => {
      swal.fire( 'Ops!!', err.message, 'error' );
      return Observable.throwError( err );
    });
  }
  consultarPorId(id: number) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/categoria/' + id;

    return this.http.get( url, httpOptions ).map( (response: IResponse) => {
                  let retorno: Categori;

                  this.sharedService.token = response.token;

                  switch ( response.status ) {
                    case Status.OK:
                      retorno = response.data as Categori;
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
                    swal.fire('Ops!!', response.error.message, 'info');
                    break;
                  }

                  return retorno;
                }).catch( (response) => {
                   swal.fire('Ops!!', response.error.message, 'error');
                   return Observable.throwError( response );
                });
  }
  registrar(categoria: Categori) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/categoria/';

    return this.http.post(url, categoria, httpOptions)
    .map((response: IResponse) => {

      this.sharedService.token = response.token;

      switch ( response.status ) {
        case Status.OK:
          swal.fire({
            type: 'success',
            title: 'Exito',
            text: `Categoria: ${categoria.nombre} creada con exito`,
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
  actualizar(id: number, categori: Categori) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/categoria/' + id;

    return this.http.put(url, categori, httpOptions)
    .map((response: IResponse) => {

      this.sharedService.token = response.token;

      switch ( response.status ) {
        case Status.OK:
            swal.fire({
              type: 'success',
              title: 'Exito',
              text: `Categoria: ${categori.nombre} actualizada con exito`,
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
    const url = URL_SERVICIOS + `/busqueda/categoria/${termino}/?inactivos=${incluirInactivos}`;
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
