import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared/shared.service';

@Injectable()
export class VerificaTokenGuard implements CanActivate {

  constructor(
    private _sharedService: SharedService,
    public _usuarioService: UsuarioService,
    public router: Router
  ) { }

  canActivate(): Promise<boolean> | boolean {

    let token = this._sharedService.token;
    let payload = JSON.parse( atob( token.accessToken.split('.')[1] ));
    let expirado = this.expirado( payload.exp );

    if ( expirado ) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.verificaRenueva( payload.exp );
  }


  verificaRenueva( fechaExp: number ): Promise<boolean>  {

    return new Promise( (resolve, reject) => {

      let tokenExp = new Date( fechaExp * 1000 );
      let ahora = new Date();

      // ahora.setTime( ahora.getTime() + ( 1 * 60 * 60 * 1000 ) );

      // console.log( tokenExp );
      // console.log( ahora );

      if ( tokenExp.getTime() > ahora.getTime() ) {
        resolve(true);
      } else {

        this._usuarioService.renuevaToken()
              .subscribe( () => {
                resolve(true);
              }, () => {
                this.router.navigate(['/login']);
                reject(false);
              });

      }

    });

  }


  expirado( fechaExp: number ) {

    let ahora = new Date().getTime() / 1000;

    if ( fechaExp < ahora ) {
      return true;
    }else {
      return false;
    }


  }



}
