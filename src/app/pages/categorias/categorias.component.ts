import { Component, OnInit } from '@angular/core';
import { Categori } from '../../models/categori.model';
import { CategoriaService } from '../../services/categoria/categoria.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styles: []
})
export class CategoriasComponent{
  private timeOutBusqueda = -1;

  categorias: Categori [] = [];
  categoria: Categori = new Categori();
  esNuevo = false;
  incluirInactivos = false;

  constructor(
    private _categoriaService: CategoriaService,
  ) {
      this.cargarCategorias();
  }

  cargarCategorias() {
    window.setTimeout(() => {
      this._categoriaService.consultarTodo(this.incluirInactivos).subscribe((categorias: Categori []) => {
        this.categorias = categorias;
      });
    }, 100);
  }

  editarCategoria( categoria: Categori ) {
    this.categoria = categoria;
    this.esNuevo = false;
  }

  nuevaCategoria() {
    this.categoria = new Categori();
    this.esNuevo = true;
  }

  guardar() {
    if ( this.esNuevo) {
      this._categoriaService.registrar(this.categoria).subscribe(() => {
        this.cargarCategorias();
      });
    } else {
      this._categoriaService.actualizar(this.categoria.id, this.categoria).subscribe(() => {
        this.cargarCategorias();
      });
    }
  }

  buscarCategorias(termino: string) {
    if ( termino.length <= 0 ) {

      this.cargarCategorias();

    } else {
      if ( this.timeOutBusqueda !== -1) {
        window.clearTimeout(this.timeOutBusqueda);
      }

      this.timeOutBusqueda = window.setTimeout(() => {

        this.timeOutBusqueda = -1;

        this._categoriaService.buscar( termino, this.incluirInactivos ).subscribe( (marcas: Categori[]) => {
          this.categorias = marcas;
        });
      }, 400);
    }
  }
}
