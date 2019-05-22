import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import swal from 'sweetalert2';


import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
  ) {
    this.forma = new FormGroup({
      nombre: new FormControl( null , Validators.required ),
      correo: new FormControl( null , [Validators.required, Validators.email], this.existeEmail.bind(this)  ),
      password: new FormControl( null , Validators.required ),
      password2: new FormControl( null , Validators.required ),
      condiciones: new FormControl(false,  Validators.pattern('true') )
    }, { validators: this.sonIguales( 'password', 'password2' )  } );

  }

  sonIguales( campo1: string, campo2: string ) {

    return ( group: FormGroup ) => {

      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;

      if ( pass1 === pass2 ) {
        return null;
      }

      return {
        sonIguales: true
      };

    };

  }


  ngOnInit() {
      init_plugins();




      // this.forma.setValue({
      //   nombre: 'Test ',
      //   correo: 'test@test.com',
      //   password: '123456',
      //   password2: '123456',
      //   condiciones: true
      // });

  }


  registrarUsuario() {

    if ( this.forma.invalid ) {
      return;
    }

    if ( !this.forma.value.condiciones ) {
      swal.fire('Importante', 'Debe de aceptar las condiciones', 'warning');
      return;
    }


    const usuario = new Usuario();
    usuario.id = 0;
    usuario.nombre = this.forma.value.nombre;
    usuario.email = this.forma.value.correo;
    usuario.password = this.forma.value.password;
    usuario.img = '';
    usuario.google = false;
    usuario.role = 'USER_ROLE';
    usuario.estatus = false;

    this._usuarioService.crearUsuario( usuario )
              .subscribe( );

  }

  existeEmail(control: FormControl): Promise<any> | Observable<any> {
    return this._usuarioService.existeEmail(control.value);
  }

}
