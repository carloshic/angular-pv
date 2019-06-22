import { Component, ViewChild, ElementRef } from '@angular/core';
import { Inventario } from '../../models/inventario.model';
import { InventarioService } from '../../services/inventario/inventario.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent {

  inventarioAbastecer: Inventario = new Inventario();
  inventario: Inventario[] = [];

  nuevoStock: number;
  cantidadEntrada: number;

  @ViewChild('cantidad') txtCantidad: ElementRef;
  constructor(
    private inventarioService: InventarioService
  ) {
    this.inicializar();
    this.cargarInventario();
  }
  inicializar() {
    this.nuevoStock = 0;
    this.cantidadEntrada = null;
    this.inventarioAbastecer = new Inventario();
  }

  cargarInventario() {
    this.inventarioService.consultarTodo().subscribe((inventario: Inventario[]) => {
      this.inventario = inventario;
    });
  }

  seleccionar(inventario: Inventario) {
    this.inicializar();

    this.inventarioAbastecer = inventario;

    window.setTimeout(() => {
      this.nuevoStock = this.inventarioAbastecer.stock;

      this.txtCantidad.nativeElement.focus();
    }, 300);
  }
  regresar() {
    this.inventarioAbastecer = new Inventario();
  }
  entrada(cantidad: number) {
    this.nuevoStock = this.inventarioAbastecer.stock + Number(cantidad);
  }
  guardar() {
    this.inventarioService.abastecer(this.inventarioAbastecer.id, this.cantidadEntrada).subscribe(() => {
      this.cargarInventario();
      this.inventarioAbastecer = new Inventario();
    });
  }


  // entradaProducto(event) {
  //   if ( event.key === 'Enter' && event.target.value.length > 0) {
  //     this.inventarioService.consultarPorCodigo(event.target.value).subscribe((producto: Producto) => {
  //         if ( producto ) {
  //           this.stock.producto = producto;
  //         }
  //     });
  //   } else if (event.target.value.trim() === '') {
  //     this.stock = new Stock();
  //   }
  // }

}
