import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Rutas
import { APP_ROUTES } from './app.routes';

// Modulos
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Servicios
import { ServiceModule } from './services/service.module';
// Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { PagesComponent } from './pages/pages.component';
import { SharedModule } from './shared/shared.module';
import { BlockUIModule  } from 'ng-block-ui';
import { BlockUiTemplateComponent } from './components/block-ui-template/block-ui-template.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PagesComponent,
    BlockUiTemplateComponent,
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    FormsModule,
    ReactiveFormsModule,
    ServiceModule,
    SharedModule,
    BlockUIModule.forRoot({
      delayStart: 500,
      delayStop: 500
    })
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
