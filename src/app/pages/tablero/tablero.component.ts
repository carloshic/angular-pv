import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';

  

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styles: [`
    .pp-grafico-dona {
      min-height: 400px;
    }
  `]
})
export class TableroComponent implements OnInit {

  graficos  = {
    tipo_autenticacion: {
      labels: ['Google', 'Normal'],
      data:  [0,0],
      // 'type': 'doughnut',
      leyenda: 'Tipos de Autenticación'
    },
    tipo_usuario: {
      labels: ['Administrador', 'Usuario'],
      data:  [0, 0],
      // 'type': 'doughnut',
      leyenda: 'Tipos de Usuario'
    }
  };

  constructor(_usuariosService: UsuarioService) {
    setTimeout(() => {
      _usuariosService.cargarUsuarios(false).subscribe((usuarios: Usuario[]) => {

        let _usuarios = {
          tipo: {
            Normal: 0,
            Google: 0
          },
          role: {
            Admin: 0,
            User: 0
          }
        };

        usuarios.map( ( usuario: Usuario ) => {
          if ( usuario.google ) {
            _usuarios.tipo.Google++;
          } else {
            _usuarios.tipo.Normal++;
          }

          if ( usuario.role === 'ADMIN_ROLE' ) {
            _usuarios.role.Admin++;
          } else {
            _usuarios.role.User++;
          }

          this.graficos.tipo_autenticacion.data = [_usuarios.tipo.Google, _usuarios.tipo.Normal];
          this.graficos.tipo_usuario.data = [_usuarios.role.Admin, _usuarios.role.User];

        });
      });
    }, 500);
  }

  ngOnInit() {
  }

}
