import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { TableroComponent } from './tablero/tablero.component';
import { AccoutSettingsComponent } from './accout-settings/accout-settings.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';

// Guards
import { LoginGuardGuard } from '../services/service.index';
import { AdminGuard } from '../services/service.index';

import { UsuariosComponent } from './usuarios/usuarios.component';

import { VerificaTokenGuard } from '../guards/verifica-token.guard';
import { ProductosComponent } from './producto/productos.component';
import { ProductoComponent } from './producto/producto.component';
import { MarcasComponent } from './marcas/marcas.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { UnidadesComponent } from './unidad/unidades.component';



const pagesRoutes: Routes = [
    {
        path: 'tablero',
        component: TableroComponent,
        canActivate: [ VerificaTokenGuard ],
        data: { titulo: 'Tablero', carpeta: 'Principal' }
    },
    {
        path: 'account-settings',
        component: AccoutSettingsComponent,
        data: { titulo: 'Ajustes de Tema', carpeta: 'Personal' },
        canActivate: [
            VerificaTokenGuard,
        ],
    },
    {
        path: 'perfil',
        component: PerfilUsuarioComponent,
        data: { titulo: 'Perfil de usuario', carpeta: 'Personal' },
        canActivate: [
            VerificaTokenGuard,
        ],
    },
    // { path: 'busqueda/:termino', component: BusquedaComponent, data: { titulo: 'Buscador' } },
    // Mantenimientos
    {
        path: 'usuarios',
        component: UsuariosComponent,
        data: { titulo: 'Mantenimiento de Usuarios', carpeta: 'Mantenimiento' },
        canActivate: [
            VerificaTokenGuard, AdminGuard
        ]
    },
    {
        path: 'producto/:id',
        component: ProductoComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Mantenimiento de Producto' }
    },
    {
        path: 'productos',
        component: ProductosComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Listado de Productos' }
    },
    {
        path: 'marcas',
        component: MarcasComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Listado de Marcas' }
    },
    {
        path: 'categorias',
        component: CategoriasComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Listado de Categorias' }
    },
    {
        path: 'unidades',
        component: UnidadesComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Listado de Unidades' }
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
];


export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
