import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../services/usuario/usuario.service';
import swal from 'sweetalert2';
import { SharedService } from '../services/shared/shared.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private _sharedService: SharedService,
    public _usuarioService: UsuarioService
  ) { }

  canActivate() {

    if ( this._sharedService.usuarioActivo.role === 'ADMIN_ROLE' ) {
      return true;
    }else {
      swal.fire(
        'Ops!!',
        'Para ingresar a esta opcion se requieren contar con rol de administrador',
        'warning'
      );
      return false;
    }

  }

}
