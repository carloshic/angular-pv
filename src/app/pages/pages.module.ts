
import { NgModule } from '@angular/core';

import { PAGES_ROUTES } from './pages.routes';

import { SharedModule } from '../shared/shared.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';





// ng2-charts
import { ChartsModule } from 'ng2-charts';

import { TableroComponent } from './tablero/tablero.component';

// Pipe Module
import { PipesModule } from '../pipes/pipes.module';

import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';
import { AccoutSettingsComponent } from './accout-settings/accout-settings.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { ProductoComponent } from './producto/producto.component';
import { ProductosComponent } from './producto/productos.component';
import { MarcasComponent } from './marcas/marcas.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { UnidadesComponent } from './unidad/unidades.component';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { KeyDownMonedaDirective } from '../directives/key-down-moneda.directive';
import { EntradaMonedaDirective } from '../directives/entrada-moneda.directive';
import { VentaComponent } from './venta/venta.component';
import { PersonasComponent } from './personas/personas.component';

// slim scroll
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { InventarioComponent } from './inventario/inventario.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    declarations: [
        TableroComponent,
        IncrementadorComponent,
        GraficoDonaComponent,
        AccoutSettingsComponent,
        PerfilUsuarioComponent,
        UsuariosComponent,
        BusquedaComponent,
        ProductoComponent,
        ProductosComponent,
        MarcasComponent,
        CategoriasComponent,
        UnidadesComponent,
        ConfiguracionesComponent,
        EntradaMonedaDirective,
        KeyDownMonedaDirective,
        VentaComponent,
        PersonasComponent,
        InventarioComponent,
    ],
    exports: [
        TableroComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        PAGES_ROUTES,
        FormsModule,
        ChartsModule,
        PipesModule,
        PerfectScrollbarModule,
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ]
})
export class PagesModule { }
