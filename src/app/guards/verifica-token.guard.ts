import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared/shared.service';
import swal from 'sweetalert2';

@Injectable()
export class VerificaTokenGuard implements CanActivate {

  constructor(
    private sharedService: SharedService,
    public usuarioService: UsuarioService,
    public router: Router
  ) { }

  canActivate(): Promise<boolean> | boolean {

    const token = this.sharedService.token;
    const payload = JSON.parse( atob( token.accessToken.split('.')[1] ));
    const expirado = this.expirado( payload.exp );

    if ( expirado ) {
      swal.fire('La sesión  ha expidaro', 'por favór vuelva a iniciar sesión', 'info').then(() => {
        this.router.navigate(['/login']);
      });
      return false;
    }

    return this.verificaRenueva( payload.exp );
  }


  verificaRenueva( fechaExp: number ): Promise<boolean>  {

    return new Promise( (resolve, reject) => {

      const tokenExp = new Date( fechaExp * 1000 );
      const ahora = new Date();

      // ahora.setTime( ahora.getTime() + ( 1 * 60 * 60 * 1000 ) );

      // console.log( tokenExp );
      // console.log( ahora );

      if ( tokenExp.getTime() > ahora.getTime() ) {
        resolve(true);
      } else {

        this.usuarioService.renuevaToken()
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

    const ahora = new Date().getTime() / 1000;

    if ( fechaExp < ahora ) {
      return true;
    } else {
      return false;
    }


  }



}
