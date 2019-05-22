import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { SharedService } from '../../services/shared/shared.service';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;

  incluirInactivos: boolean = false;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService,
    public _sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.cargarUsuarios();

    this._modalUploadService.notificacion
          .subscribe( resp => {
            // swal.fire( 'Imagen Actualizada', this.usuarioActivo.nombre, 'success' );
            this.cargarUsuarios();
          });
  }

  mostrarModal( id: number ) {

    this._modalUploadService.mostrarModal( 'usuario', id );
  }

  print() {
    console.log(this.incluirInactivos);
  }
  cargarUsuarios() {

    window.setTimeout(() => {
      this._usuarioService.cargarUsuarios( this.incluirInactivos )
      .subscribe( (usuarios: Usuario[]) => {
          this.totalRegistros = usuarios.length;
          this.usuarios = usuarios;
      });
    }, 100);
  }

  cambiarDesde( valor: number ) {

    let desde = this.desde + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();

  }

  buscarUsuario( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this._usuarioService.buscarUsuarios( termino, this.incluirInactivos )
            .subscribe( (usuarios: Usuario[]) => {

              this.usuarios = usuarios;
              this.cargando = false;
            });

  }

  borrarUsuario( usuario: Usuario ) {

    if ( usuario.email === this._sharedService.usuarioActivo.email ) {
      swal('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }

    swal({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {

      if (borrar) {

        this._usuarioService.borrarUsuario( usuario.id )
                  .subscribe( () => {
                      this.cargarUsuarios();
                  });
      }

    });

  }

  guardarUsuario( usuario: Usuario ) {

    this._usuarioService.actualizarUsuario( usuario )
            .subscribe();

  }

}
