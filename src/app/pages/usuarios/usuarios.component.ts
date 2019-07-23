import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { SharedService } from '../../services/shared/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde = 0;

  incluirInactivos = false;
  totalRegistros = 0;
  cargando = true;

  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService,
    public _sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.cargarUsuarios();

    this._modalUploadService.notificacion
          .subscribe( response => {
            const usaurioActualizado = response.data as Usuario;

            if ( this._sharedService.usuarioActivo.id === usaurioActualizado.id ) {
              this._sharedService.usuarioActivo.img = usaurioActualizado.img;
            }

            this.usuarios.map((usuario: Usuario) => {
                if ( usuario.id === usaurioActualizado.id ) {
                  usuario.img = usaurioActualizado.img;
                }
            });

            swal.fire( 'Imagen Actualizada', usaurioActualizado.nombre, 'success' );
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
      swal.fire('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }

    swal.fire({
      title: 'Confirmación',
      text: '¿Desea borrar al usuario',
      type: 'warning',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<i class="fa fa-trash"></i> Borrar',
      confirmButtonColor: '#d33'
    }).then((borrar) => {

      if (borrar.value) {

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
