import { Component, OnInit, IterableDiffers, DoCheck, ViewChild, ElementRef  } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';
import { ProductoService } from '../../services/producto/producto.service';
import { Producto } from '../../models/producto.model';
import { Operacion } from '../../models/operacion.model';
import { TipoOperacion } from '../../models/tipo-operacion.model';
import { DetalleOperacion } from '../../models/detalle-operacion.model';
import { TipoOperacionService } from '../../services/tipo-operacion/tipo-operacion.service';
import { PersonaService } from '../../services/persona/persona.service';
import { Persona } from '../../models/persona.model';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit, DoCheck {
  productos: Producto[] = [];
  operacion: Operacion;

  differ: any;

  @ViewChild(PerfectScrollbarComponent) public scrollListadoProd: PerfectScrollbarComponent;
  constructor(
    private productoService: ProductoService,
    private differs: IterableDiffers,
    private tipoOperacionService: TipoOperacionService,
    private personaService: PersonaService
  ) {
    this.operacion = new Operacion();
    this.differ = differs.find([]).create(null);
  }

  ngOnInit() {
    this.tipoOperacionService.consultarPorCodigo('VENTA').subscribe((ventaTO: TipoOperacion) => {
      this.operacion.tipooperacion = ventaTO;
    });

    this.personaService.buscar('General').subscribe((persona: Persona[]) => {
      if ( persona.length > 0 ) {
        this.operacion.persona = persona[0];
      }
    });
  }

  ngDoCheck() {
    const change = this.differ.diff(this.operacion.detalleOperacion);

    if ( change ) {
      const detalle: DetalleOperacion [] = change.collection as  DetalleOperacion [];
      this.actualizarTotalVenta(detalle);
    }
  }

  borrarProducto(producto: Producto) {
      this.operacion.detalleOperacion = this.operacion.detalleOperacion
      .filter((detalle: DetalleOperacion) => detalle.producto.id !== producto.id);
  }

  entradaProducto(event) {
    if ( event.key === 'Enter') {
      this.productoService.consultarPorCodigo(event.target.value).subscribe((producto: Producto) => {
          if ( producto ) {
            let prductoAgregado = false;
            for ( const detalleOp of this.operacion.detalleOperacion ) {
              if ( detalleOp.producto.id === producto.id ) {
                detalleOp.cantidad ++;
                detalleOp.total = Number(detalleOp.producto.precio) * detalleOp.cantidad;
                prductoAgregado = true;
                this.despuesProductoAgregado(detalleOp);
              }
            }
            if ( !prductoAgregado ) {
              const detalleOperacion: DetalleOperacion = new DetalleOperacion();
              detalleOperacion.producto = producto;
              detalleOperacion.cantidad = 1;
              detalleOperacion.operacion = this.operacion;
              detalleOperacion.total = producto.precio * detalleOperacion.cantidad;
              this.operacion.detalleOperacion.push(detalleOperacion);
              this.despuesProductoAgregado(detalleOperacion);
            }
          }
      });
    }
  }

  moverCantidadProducto(numero: number,  detalleOperacion: DetalleOperacion) {
      detalleOperacion.cantidad += numero;
      detalleOperacion.total = detalleOperacion.cantidad * detalleOperacion.producto.precio;
      this.despuesProductoAgregado(detalleOperacion);
  }

  despuesProductoAgregado(detalleOperacion: DetalleOperacion) {
    this.actualizarTotalVenta(this.operacion.detalleOperacion);
    this.highlight(detalleOperacion);
    this.mantenerScrollAbajo();
  }

  highlight(detalleOperacion: DetalleOperacion) {
    if ( detalleOperacion.highlight ) {
      detalleOperacion.highlight = false;
    }

    detalleOperacion.highlight = true;
    window.setTimeout(() => {
      detalleOperacion.highlight = false;
    }, 700);
  }

  mantenerScrollAbajo() {
    try {
        window.setTimeout(() => {
          this.scrollListadoProd.directiveRef.scrollToBottom(0, 100);
        }, 50);
    } catch ( err ) {

    }
  }

  actualizarTotalVenta(detalle: DetalleOperacion []) {
      let total = 0;
      for ( const p of detalle ) {
        total += Number(p.total);
      }
      this.operacion.total = total;
  }
}
