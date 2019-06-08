import { Component, OnInit } from '@angular/core';
import { ConfiguracionService } from 'src/app/services/configuracion/configuracion.service';
import { Configuracion } from '../../models/configuracion.model';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styles: []
})
export class ConfiguracionesComponent {
  timeOutBusqueda = -1;
  configuraciones: Configuracion [] = [];
  configuracion: Configuracion = new Configuracion();
  esNuevo = false;

  constructor(
    private configuracionService: ConfiguracionService
  ) {
    this.cargarConfiguraciones();
  }

  cargarConfiguraciones() {
    window.setTimeout(() => {
      this.configuracionService.consultarTodo().subscribe((configuracions: Configuracion []) => {
        this.configuraciones = configuracions;
      });
    }, 100);
  }

  editarConfiguracion(configuracion: Configuracion) {
    this.configuracion = configuracion;
    this.esNuevo = false;
  }

  nuevaConfiguracion() {
    this.configuracion = new Configuracion();
    this.esNuevo = true;
  }

  guardar() {
    if ( this.esNuevo) {
      this.configuracionService.registrar(this.configuracion).subscribe(() => {
        this.cargarConfiguraciones();
      });
    } else {
      this.configuracionService.actualizar(this.configuracion.id, this.configuracion).subscribe(() => {
        this.cargarConfiguraciones();
      });
    }
  }
  buscarConfiguraciones(termino: string) {
    if ( termino.length <= 0 ) {

      this.cargarConfiguraciones();

    } else {
      if ( this.timeOutBusqueda !== -1) {
        window.clearTimeout(this.timeOutBusqueda);
      }

      this.timeOutBusqueda = window.setTimeout(() => {

        this.timeOutBusqueda = -1;

        this.configuracionService.buscar( termino ).subscribe( (configuracions: Configuracion[]) => {
          this.configuraciones = configuracions;
        });
      }, 400);
    }
  }

}
