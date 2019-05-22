import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto/producto.service';
import { Producto } from '../../models/producto.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { IResponse } from '../../interfaces/response.interface';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styles: []
})
export class ProductosComponent {

  private timeOutBusqueda = -1;
  public productos: Producto[] = [];
  incluirInactivos = false;

  constructor(
    public productoService: ProductoService,
    public modalUploadService: ModalUploadService,
    private router: Router,
    ) {
    this.cargarProductos();
    this.modalUploadService.notificacion.subscribe((response: IResponse) => {
        this.productos.map((producto: Producto) => {
          if ( producto.id === response.data.id ) {
            producto.imagen = response.data.imagen;
          }
        });
    });
  }

  mostrarModal( id: number ) {
    this.modalUploadService.mostrarModal( 'producto', id );
  }

  cargarProductos() {
    window.setTimeout(() => {
      this.productoService.consultarTodo(this.incluirInactivos).subscribe(( productos: Producto[] ) => {
        this.productos = productos;
      });
    }, 100);
  }

  buscarProductos( termino: string ) {

    if ( termino.length <= 0 ) {

      this.cargarProductos();

    } else {
      if ( this.timeOutBusqueda !== -1) {
        window.clearTimeout(this.timeOutBusqueda);
      }

      this.timeOutBusqueda = window.setTimeout(() => {

        this.timeOutBusqueda = -1;

        this.productoService.buscar( termino, this.incluirInactivos ).subscribe( (productos: Producto[]) => {
          this.productos = productos;
        });
      }, 400);
    }
  }
  nuevoProducto() {
    this.router.navigate(['/producto', 'nuevo']);
  }
  editarProducto(id: number) {
    this.router.navigate(['/producto', id]);
  }

}
