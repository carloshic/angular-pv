import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';
import { IServiceBase } from '../../interfaces/service-base.interface';
import { IResponse } from '../../interfaces/response.interface';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { SharedService } from '../service.index';
import { URL_SERVICIOS } from 'src/app/config/config';
import { TipoOperacion } from '../../models/tipo-operacion.model';
import { Status } from 'src/app/definitions/definitions';
@Injectable({
  providedIn: 'root'
})
export class TipoOperacionService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) { }

  consultarTodo(incluirInactivos: boolean = false) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/tipo-operacion';
    return this.http.get(url, httpOptions ).map((response: IResponse): TipoOperacion[] => {

      let retorno: TipoOperacion [] = [];

      switch ( response.status ) {
        case Status.OK:
          retorno = response.data as TipoOperacion[];
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

  consultarPorCodigo(codigo: string) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/tipo-operacion/codigo/' + codigo;

    return this.http.get( url, httpOptions )
                .map( (response: IResponse) => {
                  let retorno: TipoOperacion = null;

                  this.sharedService.token = response.token;

                  switch ( response.status ) {
                    case Status.OK:
                      retorno = response.data as TipoOperacion;
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
                      swal.fire('Ops!!', response.error.message, 'info');
                      retorno = null;
                      break;
                  }
                  return retorno;
                }).catch( (response) => {
                   swal.fire('Ops!!', response.error.message, 'error');
                   return Observable.throwError( response );
                });
  }
}
