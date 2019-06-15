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
    public subirArchivoService: SubirArchivoService,
    private sharedService: SharedService
  ) {
     this.sharedService.cargarSesion();
  }

  renuevaToken() {

    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token=' + this.sharedService.token;

    return this.http.get( url )
                .map( (response: IResponse) => {
                  this.sharedService.token = response.data.token;
                  localStorage.setItem('token', JSON.stringify(this.sharedService.token) );
                  console.log('Token renovado');
                  return true;
                })
                .catch( err => {
                  this.router.navigate(['/login']);
                  swal.fire( 'No se pudo renovar token', 'No fue posible renovar token', 'error' );
                  return Observable.throwError( err );
                });
  }


  estaLogueado() {
    return ( this.sharedService.token != null && this.sharedService.token.accessToken.length > 5 ) ? true : false;
  }


  logout() {

    this.sharedService.usuarioActivo = null;
    this.sharedService.empresaActiva = null;
    this.sharedService.token = null;

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {

    const url = URL_SERVICIOS + '/login/google';

    return this.http.post( url, { token, empresa_id: 1 } )
                .map( (resp: any) => {
                  this.sharedService.incializarSesion( resp.token, resp.usuario, resp.empresa );
                  return true;
                }).catch( resp => {
                  swal.fire( 'Ocurrió un error al iniciar sesión', resp.message, 'error' );
                  return Observable.throwError( resp );
                });


  }

  login( usuario: Usuario, empresa: Empresa, recordar: boolean = false ) {
    if ( recordar ) {
      localStorage.setItem('recordar_email', usuario.email );
      localStorage.setItem('recordar_empresa', JSON.stringify(empresa) );
    } else {
      localStorage.removeItem('recordar_email');
      localStorage.removeItem('recordar_empresa');
    }

    const url = URL_SERVICIOS + '/auth/login';
    return this.http.post( url, { email: usuario.email, password: usuario.password, empresaId: empresa.id } )
                .map( (response: IResponse) => {
                  let retorno = false;
                  switch ( response.status ) {
                    case Status.OK:
                      this.sharedService.incializarSesion(response.token, response.data.usuario, response.data.empresa);
                      retorno = true;
                      return response.data;
                    case Status.ERROR:
                      swal.fire(response.message, response.error.message, 'error');
                      break;
                  }
                  return retorno;
                })
                .catch( resp => {
                  swal.fire( 'Ops!! ' + resp.error.message, resp.error.error.message, 'error' );
                  return Observable.throwError( resp );
                });

  }

  crearUsuario( usuario: Usuario ) {

    const url = URL_SERVICIOS + '/usuario';

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
                return Observable.throwError( resp );
              });
  }

  actualizarUsuario( usuario: Usuario ) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};

    const url = URL_SERVICIOS + '/usuario/' + usuario.id;

    return this.http.put( url, usuario, httpOptions )
                .map( (response: IResponse) => {

                  this.sharedService.token = response.token;

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
                  return Observable.throwError( resp );
                });

  }

  cambiarImagen( archivo: File, id: number ) {

    this.subirArchivoService.subirArchivo( archivo, 'usuario', id )
          .then( (resp: any) => {
            this.sharedService.usuarioActivo.img = resp.data.img;
            swal.fire( 'Imagen Actualizada', this.sharedService.usuarioActivo.nombre, 'success' );
          })
          .catch( resp => {
            swal.fire( 'Ops!!', 'Ocurrió un error al actualizar la imagen', 'error' );
            throw new Error(resp);
          }) ;
  }

  cargarUsuarios( incluirInactivos: boolean) {

    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};

    const url = URL_SERVICIOS + `/usuario?inactivos=${incluirInactivos}`;

    return this.http.get( url, httpOptions).map((response: IResponse) => {
      let retorno: Usuario[] = [];
      this.sharedService.token = response.token;

      switch ( response.status ) {
          case Status.OK:
            retorno = response.data as Usuario[];
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
      return retorno;
    }).catch(err => {
      swal.fire( 'Ocurrió un error al cargar el listado de usuarios', err.message, 'error' );
      return Observable.throwError( err );
    });
  }

  buscarUsuarios( termino: string, incluirInactivos: boolean ) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + `/busqueda/usuario/${termino}/?inactivos=${incluirInactivos}`;

    return this.http.get( url, httpOptions )
                .map( (resp: any) => {
                  return resp.data;
                } )
                .catch( err => {
                  swal.fire( 'Ocurrió un error al realizar la busqueda', err.message, 'error' );
                  return Observable.throwError( err );
                });

  }

  borrarUsuario( id: number ) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
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
                   return Observable.throwError( response );
                });
  }
  existeEmail(email) {
    const httpOptions = { headers: new HttpHeaders({ Authorization: this.sharedService.token.accessToken })};
    const url = URL_SERVICIOS + '/validador/usuario/existe_email/' + email;

    return this.http.get(url, httpOptions);
  }
}
