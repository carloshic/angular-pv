import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { GOOGLE_CLIENT_ID } from '../config/config';
import { EmpresaService } from '../services/empresa/empresa.service';
import { Empresa } from '../models/empresa.model';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs/Observable';

declare function init_plugins();
declare const gapi: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Autenticacion por goole
  auth2: any;

  // **** Recordar ***
  email: string;
  recuerdame: boolean;
  empresa: Empresa;

  empresas: Empresa [] = [];

  @ViewChild('password') password: ElementRef;

  constructor(
    public router: Router,
    public usuarioService: UsuarioService,
    public empresaService: EmpresaService
  ) {
    this.empresa = new Empresa();
    this.empresaService.cargarEmpresas(true).subscribe((empresas: Empresa[]) => {
      this.empresas = empresas;
      this.empresaDefault();
    });
  }

  empresaDefault() {
    let recordarEmpresa: Empresa = null;

    if ( localStorage.getItem('recordar_empresa') != null ) {

      recordarEmpresa = JSON.parse(localStorage.getItem('recordar_empresa')) as Empresa;

    }

    if ( recordarEmpresa ) {

      this.empresa = this.empresas.find(x => x.id === recordarEmpresa.id);

    } else {
      this.empresa = this.empresas[0];
    }
  }

  ngOnInit() {

    init_plugins();

    // this.googleInit();

    this.email = localStorage.getItem('recordar_email') || '';
    if ( this.email.length > 1 ) {
      this.recuerdame = true;
    }

    this.password.nativeElement.focus();
  }

  ingresar( forma: NgForm) {

    if ( forma.valid ) {
      const usuario = new Usuario();
      usuario.email = forma.value.email;
      usuario.password = forma.value.password;
      this.usuarioService.login( usuario, this.empresa, forma.value.recuerdame )
                    .subscribe( (correcto ) => {
                      this.router.navigate(['/tablero']);
                    });
    }
  }

  // GOOGLE INIT
  googleInit() {

    gapi.load('auth2', () => {

      this.auth2 = gapi.auth2.init({
        client_id: GOOGLE_CLIENT_ID,
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin( document.getElementById('btnGoogle') );

    });

  }

  attachSignin( element ) {

    this.auth2.attachClickHandler( element, {}, (googleUser) => {

      // let profile = googleUser.getBasicProfile();
      const token = googleUser.getAuthResponse().id_token;

      this.usuarioService.loginGoogle( token )
              .subscribe( () => window.location.href = '#/tablero'  );

    });

  }
}
