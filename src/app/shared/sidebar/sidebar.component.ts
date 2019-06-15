import { Component, OnInit } from '@angular/core';

import { SidebarService, UsuarioService, SharedService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  usuario: Usuario;
  public fecha = new Date();

  constructor(
    private _sharedService: SharedService,
    public _sidebar: SidebarService,
    public _usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.usuario = this._sharedService.usuarioActivo;
    this._sidebar.cargarMenu();
  }

}
