import { RouterModule, Routes } from '@angular/router';
import { TableroComponent } from './tablero/tablero.component';
import { AccoutSettingsComponent } from './accout-settings/accout-settings.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';

// Guards
import { AdminGuard } from '../services/service.index';
import { VerificaTokenGuard } from '../guards/verifica-token.guard';

import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProductosComponent } from './producto/productos.component';
import { ProductoComponent } from './producto/producto.component';
import { MarcasComponent } from './marcas/marcas.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { UnidadesComponent } from './unidad/unidades.component';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { VentaComponent } from './venta/venta.component';
import { PersonasComponent } from './personas/personas.component';
import { InventarioComponent } from './inventario/inventario.component';



const pagesRoutes: Routes = [
    /*============================================================
                             - Personal -
      ============================================================*/    
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
    /*============================================================
                     - Matnenimiento de Catalogos-
      ============================================================*/
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
        canActivate: [ VerificaTokenGuard, AdminGuard ],
        data: { titulo: 'Mantenimiento de Producto' }
    },
    {
        path: 'productos',
        component: ProductosComponent,
        canActivate: [ VerificaTokenGuard, AdminGuard ],
        data: { titulo: 'Listado de Productos' }
    },
    {
        path: 'marcas',
        component: MarcasComponent,
        canActivate: [ VerificaTokenGuard, AdminGuard ],
        data: { titulo: 'Listado de Marcas' }
    },
    {
        path: 'categorias',
        component: CategoriasComponent,
        canActivate: [ VerificaTokenGuard, AdminGuard ],
        data: { titulo: 'Listado de Categorias' }
    },
    {
        path: 'unidades',
        component: UnidadesComponent,
        canActivate: [ VerificaTokenGuard, AdminGuard ],
        data: { titulo: 'Listado de Unidades' }
    },
    {
        path: 'configuraciones',
        component: ConfiguracionesComponent,
        canActivate: [ VerificaTokenGuard, AdminGuard ],
        data: { titulo: 'Listado de Configuraciones' }
    },
    {
        path: 'personas',
        component: PersonasComponent,
        canActivate: [ VerificaTokenGuard, AdminGuard ],
        data: { titulo: 'Listado de Clientes/Proveedores' }
    },

    /*============================================================
                            - Principal -
      ============================================================*/
    {
        path: 'tablero',
        component: TableroComponent,
        canActivate: [ VerificaTokenGuard ],
        data: { titulo: 'Tablero', carpeta: 'Principal' }
    },
    {
        path: 'venta',
        component: VentaComponent,
        canActivate: [ VerificaTokenGuard ],
        data: { titulo: 'Venta' }
    },

    /*============================================================
                            - Reportes -
      ============================================================*/
    {
        path: 'inventario',
        component: InventarioComponent,
        canActivate: [ VerificaTokenGuard ],
        data: { titulo: 'Inventario' }
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
];


export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
