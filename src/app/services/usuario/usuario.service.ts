import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import swal from 'sweetalert2';


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Empresa } from '../../models/empresa.model';
import { Status } from '../../definitions/definitions';
import { IResponse } from '../../interfaces/response.interface';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class UsuarioService {

  menu: any[] = [];



  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService,
    private _sharedService: SharedService
  ) {
    this._sharedService.cargarSesion();
  }

  renuevaToken() {

    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token=' + this._sharedService.token;

    return this.http.get( url )
                .map( (response: IResponse) => {
                  this._sharedService.token = response.data.token;
                  localStorage.setItem('token', JSON.stringify(this._sharedService.token) );
                  console.log('Token renovado');
                  return true;
                })
                .catch( err => {
                  this.router.navigate(['/login']);
                  swal.fire( 'No se pudo renovar token', 'No fue posible renovar token', 'error' );
                  return Observable.throw( err );
                });
  }


  estaLogueado() {
    return ( this._sharedService.token != null && this._sharedService.token.accessToken.length > 5 ) ? true : false;
  }


  logout() {
    this._sharedService.usuarioActivo = null;
    this._sharedService.empresaActiva = null;
    this._sharedService.token = null;

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {

    let url = URL_SERVICIOS + '/login/google';

    return this.http.post( url, { token, empresa_id: 1 } )
                .map( (resp: any) => {
                  this._sharedService.incializarSesion( resp.token, resp.usuario, resp.empresa );
                  return true;
                }).catch( resp => {
                  swal.fire( 'Ocurrió un error al iniciar sesión', resp.message, 'error' );
                  return Observable.throw( resp );
                });


  }

  login( usuario: Usuario, empresa: Empresa, recordar: boolean = false ) {
    if ( recordar ) {
      localStorage.setItem('email', usuario.email );
    }else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/auth/login';
    return this.http.post( url, { email: usuario.email, password: usuario.password, empresaId: empresa.id } )
                .map( (response: IResponse) => {

                  switch ( response.status ) {
                    case Status.OK:
                      this._sharedService.incializarSesion(response.data.token, response.data.usuario, response.data.empresa);
                    return response.data;
                    case Status.ERROR:
                      swal.fire('Ops!!', response.error.message, 'error');
                    break;
                  }
                  return true;
                })
                .catch( resp => {
                  swal.fire( 'Ops!! ' + resp.error.message, resp.error.error.message, 'error' );
                  return Observable.throw( resp );
                });

  }

  crearUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario )
              .map( (response: IResponse) => {
                switch ( response.status ) {
                  case Status.OK:
                    swal.fire({
                      type: 'success',
                      title: 'Exito',
                      text: `Usuario: ${usuario.email} creado con exito`,
                      showConfirmButton: false,
                      timer: 1500
                    });
                    return response.data;

                  case Status.ERROR:
                    swal.fire(response.message, response.error.message, 'error');
                  break;
                }
              })
              .catch( resp  => {
                swal.fire( 'Ops!!', resp.error.message, 'error' );
                return Observable.throw( resp );
              });
  }

  actualizarUsuario( usuario: Usuario ) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this._sharedService.token.accessToken })};

    let url = URL_SERVICIOS + '/usuario/' + usuario.id;

    return this.http.put( url, usuario, httpOptions )
                .map( (response: IResponse) => {

                  this._sharedService.token = response.token;

                  switch ( response.status ) {
                    case Status.OK:
                      swal.fire({
                        type: 'success',
                        title: 'Exito',
                        text: `Usuario: ${usuario.email} actualizado con exito`,
                        showConfirmButton: false,
                        timer: 1500
                      });
                      return response.data;
                    case Status.ERROR:
                      swal.fire('Ocurrio un error al actualizar los datos', response.message, 'warning' );
                    break;
                    case Status.SESSION_EXPIRED:
                    swal.fire('La sesión  ha expidaro', 'por favór vuelva a iniciar sesión', 'info').then(() => {
                      this.router.navigate(['/login']);
                    });
                    break;
                    case Status.NOT_RECORDS_FOUND:
                    localStorage.setItem('token', JSON.stringify(response.token));
                    break;
                  }
                  return true;
                })
                .catch( resp => {
                  swal.fire('Ops!!', resp.error.message, 'error' );
                  return Observable.throw( resp );
                });

  }

  cambiarImagen( archivo: File, id: number ) {

    this._subirArchivoService.subirArchivo( archivo, 'usuario', id )
          .then( (resp: any) => {
            this._sharedService.usuarioActivo.img = resp.data.img;
            swal.fire( 'Imagen Actualizada', this._sharedService.usuarioActivo.nombre, 'success' );
          })
          .catch( resp => {
            swal.fire( 'Ops!!', 'Ocurrió un error al actualizar la imagen', 'error' );
            throw new Error(resp);
          }) ;
  }

  cargarUsuarios( incluirInactivos: boolean) {

    const httpOptions = { headers: new HttpHeaders({ Authorization: this._sharedService.token.accessToken })};

    let url = URL_SERVICIOS + `/usuario?inactivos=${incluirInactivos}`;

    return this.http.get( url, httpOptions).map((response: IResponse) => {

      this._sharedService.token = response.token;

        switch ( response.status ) {
          case Status.OK:
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
            break;
        }
        return response.data;
    }).catch(err => {
      swal.fire( 'Ocurrió un error al cargar el listado de usuarios', err.message, 'error' );
      return Observable.throw( err );
    });
  }

  buscarUsuarios( termino: string, incluirInactivos: boolean ) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this._sharedService.token.accessToken })};
    let url = URL_SERVICIOS + `/busqueda/usuario/${termino}/?inactivos=${incluirInactivos}`;

    return this.http.get( url, httpOptions )
                .map( (resp: any) => {
                  return resp.data;
                } )
                .catch( err => {
                  swal.fire( 'Ocurrió un error al realizar la busqueda', err.message, 'error' );
                  return Observable.throw( err );
                });

  }

  borrarUsuario( id: number ) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this._sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/usuario/' + id;

    return this.http.delete( url, httpOptions )
                .map( (response: IResponse) => {
                  switch ( response.status ) {
                    case Status.OK:
                    swal.fire('Usuario borrado', 'El usuario a sido eliminado correctamente', 'success');
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
                }).catch( (response) => {
                   swal.fire('Ops!!', response.error.message, 'error');
                   return Observable.throw( response );
                });
  }
  existeEmail(email) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this._sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/validador/usuario/existe_email/' + email;

    return this.http.get(url, httpOptions);
  }
}
