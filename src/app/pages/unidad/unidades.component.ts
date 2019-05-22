import { Component, OnInit } from '@angular/core';
import { Unidad } from 'src/app/models/unidad.model';
import { UnidadService } from '../../services/unidad/unidad.service';

@Component({
  selector: 'app-unidades',
  templateUrl: './unidades.component.html',
  styles: []
})
export class UnidadesComponent {
  public unidades: Unidad [] = [];
  public unidad: Unidad = new Unidad();
  public incluirInactivos = false;
  public esNuevo = false;

  private timeOutBusqueda = -1;

  constructor(
    private unidadService: UnidadService,
  ) {
    this.cargarUnidades();
   }

  cargarUnidades() {
    window.setTimeout(() => {
      this.unidadService.consultarTodo(this.incluirInactivos).subscribe((unidades: Unidad[]) => {
        this.unidades = unidades;
      });
    }, 100);
  }

  nuevaUnidnad() {
    this.unidad = new Unidad();
    this.esNuevo = true;
  }

  buscarUnidades(termino: string) {
    if ( termino.length <= 0 ) {

      this.cargarUnidades();

    } else {
      if ( this.timeOutBusqueda !== -1) {
        window.clearTimeout(this.timeOutBusqueda);
      }

      this.timeOutBusqueda = window.setTimeout(() => {

        this.timeOutBusqueda = -1;

        this.unidadService.buscar( termino, this.incluirInactivos ).subscribe( (unidades: Unidad[]) => {
          this.unidades = unidades;
        });
      }, 400);
    }
  }

  editarUnidad(unidad: Unidad) {
    this.unidad = unidad;
    this.esNuevo = false;
  }

  guardar() {
    if ( this.esNuevo) {
      this.unidadService.registrar(this.unidad).subscribe(() => {
        this.cargarUnidades();
      });
    } else {
      this.unidadService.actualizar(this.unidad.id, this.unidad).subscribe(() => {
        this.cargarUnidades();
      });
    }
  }
}
