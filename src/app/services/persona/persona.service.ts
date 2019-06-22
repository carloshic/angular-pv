import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../service.index';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { IResponse } from 'src/app/interfaces/response.interface';
import { Persona } from '../../models/persona.model';
import { Status } from 'src/app/definitions/definitions';

import swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) { }

  consultarTodo(incluirInactivos: boolean = false) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + `/persona?inactivos=${incluirInactivos}`;
    return this.http.get(url, httpOptions )
    .map((response: IResponse): Persona[] => {
      let retorno: Persona [] = [];

      switch ( response.status ) {
        case Status.OK:
          retorno = response.data as Persona[];
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
          swal.fire('Ops!!', response.message, 'info');
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
    const url = URL_SERVICIOS + '/persona/' + id;

    return this.http.get( url, httpOptions )
      .map( (response: IResponse) => {
        let retorno: Persona = null;

        this.sharedService.token = response.token;

        switch ( response.status ) {
          case Status.OK:
            retorno = response.data as Persona;
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
            // swal.fire('Ops!!', response.error.message, 'info');
            retorno = null;
            break;
        }
        return retorno;
      }).catch( (response) => {
          swal.fire('Ops!!', response.error.message, 'error');
          return Observable.throwError( response );
      });
  }

  consultarDefaultParaVenta() {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/persona/persona_default_venta/';

    return this.http.get( url, httpOptions )
      .map( (response: IResponse) => {
        let retorno: Persona = null;

        this.sharedService.token = response.token;

        switch ( response.status ) {
          case Status.OK:
            retorno = response.data as Persona;
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
            swal.fire('Atencion!!', response.message, 'warning');
            retorno = new Persona();
            break;
        }
        return retorno;
      }).catch( (response) => {
          swal.fire('Ops!!', response.error.message, 'error');
          return Observable.throwError( response );
      });
  }

  registrar(persona: Persona) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/persona/';

    return this.http.post(url, persona, httpOptions)
    .map((response: IResponse) => {

      this.sharedService.token = response.token;

      switch ( response.status ) {
        case Status.OK:
            swal.fire({
              type: 'success',
              title: 'Exito',
              text: `${persona.tipo}: ${persona.nombre} creado(a) con exito`,
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

  actualizar(id: number,  persona: Persona) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/persona/' + id;

    return this.http.put(url, persona, httpOptions)
    .map((response: IResponse) => {

      this.sharedService.token = response.token;

      switch ( response.status ) {
        case Status.OK:
            swal.fire({
              type: 'success',
              title: 'Exito',
              text: `${persona.tipo}: ${persona.nombre} actualizado(a) con exito`,
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

  buscar( termino: string, incluirInactivos: boolean = false ) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + `/busqueda/persona/${termino}/?inactivos=${incluirInactivos}`;
    return this.http.get( url, httpOptions )
                .map( (resp: any) => {
                  return resp.data;
                } )
                .catch( err => {
                  swal.fire( 'Ocurrió un error al realizar la busqueda', err.message, 'error' );
                  return Observable.throwError( err );
                });
  }
}
