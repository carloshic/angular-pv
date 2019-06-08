import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';
import { ProductoService } from './producto/producto.service';
import { EmpresaService } from './empresa/empresa.service';
import { MarcaService } from './marca/marca.service';
import { CategoriaService } from './categoria/categoria.service';
import { ConfiguracionService } from './configuracion/configuracion.service';
import { TipoOperacionService } from './tipo-operacion/tipo-operacion.service';

import {
  SettingsService,
  SidebarService,
  SharedService,
  UsuarioService,
  LoginGuardGuard,
  AdminGuard,
  SubirArchivoService,
  VerificaTokenGuard,
  UnidadService,
 } from './service.index';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService,
    SidebarService,
    SharedService,
    UsuarioService,
    LoginGuardGuard,
    AdminGuard,
    SubirArchivoService,
    ModalUploadService,
    VerificaTokenGuard,
    ProductoService,
    EmpresaService,
    UnidadService,
    MarcaService,
    CategoriaService,
    ConfiguracionService,
    TipoOperacionService
  ],
  declarations: []
})
export class ServiceModule { }
