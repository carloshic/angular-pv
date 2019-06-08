import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages/pages.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
// import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { LoginGuardGuard } from './guards/login-guard.guard';
import { VentaComponent } from './pages/venta/venta.component';


const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    // {
    //     path: 'venta',
    //     component: VentaComponent,
    //     canActivate: [ LoginGuardGuard ],
    // },
    {
        path: '',
        component: PagesComponent,
        canActivate: [ LoginGuardGuard ],
        loadChildren: './pages/pages.module#PagesModule'
    },
    { path: '**', component: LoginComponent }
];


export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash: true } );
