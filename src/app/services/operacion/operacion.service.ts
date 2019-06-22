import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { IServiceBase } from '../../interfaces/service-base.interface';
import { URL_SERVICIOS } from '../../config/config';
import { Operacion } from '../../models/operacion.model';
import { IResponse } from 'src/app/interfaces/response.interface';
import { Status } from 'src/app/definitions/definitions';

import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class OperacionService implements IServiceBase {

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService,
  ) { }

  consultarTodo() {

  }
  consultarPorId(id: number) {

  }
  registrar(operacion: any) {
    const url = `${URL_SERVICIOS}/operacion/`;
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};

    return this.http.post(url, operacion, httpOptions)
    .map((response: IResponse) => {
      let venta: Operacion;
      this.sharedService.token = response.token;

      switch ( response.status ) {
        case Status.OK:
            venta = response.data as Operacion;
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
      return venta;
    })
    .catch((response) => {
      swal.fire('Ops!!', `${response.error.message} <br><small class="text-danger"> ${response.error.error.message}</small>`, 'error');
      return Observable.throwError( response );
    });
  }
  actualizar(id: number) {

  }
  borrar(id: number) {

  }
}
