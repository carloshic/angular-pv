import { Component, OnInit } from '@angular/core';
import { Marca } from '../../models/marca.model';
import { MarcaService } from '../../services/marca/marca.service';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styles: []
})
export class MarcasComponent {
  private timeOutBusqueda = -1;

  marcas: Marca [] = [];
  marca: Marca = new Marca();
  esNuevo = false;
  incluirInactivos = false;

  constructor(
    private marcaService: MarcaService
  ) {
    this.cargarMarcas();
  }

  cargarMarcas() {
    window.setTimeout(() => {
      this.marcaService.consultarTodo(this.incluirInactivos).subscribe((marcas: Marca []) => {
        this.marcas = marcas;
      });
    }, 100);
  }

  editarMarca(marca: Marca) {
    this.marca = marca;
    this.esNuevo = false;
  }

  nuevaMarca() {
    this.marca = new Marca();
    this.esNuevo = true;
  }

  guardar() {
    if ( this.esNuevo) {
      this.marcaService.registrar(this.marca).subscribe(() => {
        this.cargarMarcas();
      });
    } else {
      this.marcaService.actualizar(this.marca.id, this.marca).subscribe(() => {
        this.cargarMarcas();
      });
    }
  }
  buscarMarcas(termino: string) {
    if ( termino.length <= 0 ) {

      this.cargarMarcas();

    } else {
      if ( this.timeOutBusqueda !== -1) {
        window.clearTimeout(this.timeOutBusqueda);
      }

      this.timeOutBusqueda = window.setTimeout(() => {

        this.timeOutBusqueda = -1;

        this.marcaService.buscar( termino, this.incluirInactivos ).subscribe( (marcas: Marca[]) => {
          this.marcas = marcas;
        });
      }, 400);
    }
  }
}
