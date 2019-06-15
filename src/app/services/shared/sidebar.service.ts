import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class SidebarService {

//  menu: any[] = [];

  menu: any = [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Tablero', url: '/tablero' },
        { titulo: 'Ventas', url: '/venta' },
        { titulo: 'Abstecimiento', url: '/abastecimiento' },
      ]
    },
    {
      titulo: 'Reportes',
      icono: 'mdi mdi-trending-up',
      submenu: [
      ]
    },
    {
      titulo: 'Mantenimientos',
      icono: 'mdi mdi-folder-lock-open',
      submenu: [
        { titulo: 'Usuarios', url: '/usuarios' },
        { titulo: 'Productos', url: '/productos' },
        { titulo: 'Marcas', url: '/marcas' },
        { titulo: 'Categorias', url: '/categorias' },
        { titulo: 'Unidades', url: '/unidades' },
        { titulo: 'Clientes/Proveedores', url: '/personas' },
      ]
    },
    {
      titulo: 'Configuración',
      icono: 'mdi mdi-wrench',
      submenu: [
        { titulo: 'Configuraciones', url: '/configuraciones' },
      ]
    },
  ];

  constructor(
    public usuarioService: UsuarioService
  ) { }

  cargarMenu() {
    // this.menu = this._usuarioService.menu;
  }

}
