import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Status } from '../../definitions/definitions';
import swal from 'sweetalert2';
import { Observable } from 'rxjs/Observable';
import { Empresa } from '../../models/empresa.model';

@Injectable()
export class EmpresaService {

  constructor( private http: HttpClient) { }

  cargarEmpresas(incluirInactivos: boolean) {
    const url = URL_SERVICIOS + `/empresa?inactivos=${incluirInactivos}`;
    return this.http.get( url ).map((response: any) => {
      let retorno: Empresa [] = [];
      switch ( response.status ) {
        case Status.OK:
          retorno = response.data as Empresa[];
          break;
        case Status.ERROR:
          swal.fire(response.message, response.error.message, 'error');
          break;
        case Status.NOT_RECORDS_FOUND:
          swal.fire('Ops!!', response.message, 'info');
          break;
      }
      return retorno;
    }).catch( (response) => {
      if ( response.status === 0) {
        swal.fire('Ops!!', 'No fue posible conectar con el servidor de la aplicación [backend]', 'error');
      } else {
        swal.fire('Ops!!', response.error.message, 'error');
      }
      return Observable.throwError( response );
    });
  }

}
