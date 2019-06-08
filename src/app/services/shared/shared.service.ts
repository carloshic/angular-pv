import { Injectable } from '@angular/core';
import { IToken } from '../../interfaces/token.interface';
import { Usuario } from '../../models/usuario.model';
import { Empresa } from '../../models/empresa.model';

@Injectable()
export class SharedService {
// tslint:disable-next-line: variable-name
  private _usuarioActivo: Usuario;
// tslint:disable-next-line: variable-name
  private _empresaActiva: Empresa;
// tslint:disable-next-line: variable-name
  private _token: IToken;

  constructor() { }

  get usuarioActivo(): Usuario {
    return this._usuarioActivo;
  }
  set usuarioActivo(usuario: Usuario) {
    this._usuarioActivo = usuario;
    localStorage.setItem('usuario', JSON.stringify(usuario) );
  }

  get empresaActiva(): Empresa {
    return this._empresaActiva;
  }

  set empresaActiva(empresa: Empresa) {
    this._empresaActiva = empresa;
    localStorage.setItem('empresa', JSON.stringify(empresa) );
  }

  get token(): IToken {
    return this._token;
  }

  set token(token: IToken) {
    this._token = token;
    localStorage.setItem('token', JSON.stringify(token) );
  }

  cargarSesion() {

    if ( localStorage.getItem('token')) {
      this._token = JSON.parse(localStorage.getItem('token'));
      this._usuarioActivo = JSON.parse( localStorage.getItem('usuario'));
      this._empresaActiva = JSON.parse( localStorage.getItem('empresa'));
    } else {
      this._token = null;
      this._usuarioActivo = null;
      this._empresaActiva = null;
    }
  }

  incializarSesion( token: any, usuario: Usuario, empresa: Empresa ) {

    localStorage.setItem('token', JSON.stringify(token) );
    localStorage.setItem('usuario', JSON.stringify(usuario) );
    localStorage.setItem('empresa', JSON.stringify(empresa) );

    this._usuarioActivo = usuario;
    this._empresaActiva = empresa;
    this._token = token;
  }
}
