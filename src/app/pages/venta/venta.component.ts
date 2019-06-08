import { Component, OnInit, AfterContentChecked, IterableDiffers, DoCheck  } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';
import { ProductoService } from '../../services/producto/producto.service';
import { Producto } from '../../models/producto.model';
import { Operacion } from '../../models/operacion.model';
import { TipoOperacion } from '../../models/tipo-operacion.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DetalleOperacion } from '../../models/detalle-operacion.model';
import { TipoOperacionService } from '../../services/tipo-operacion/tipo-operacion.service';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { PersonaService } from '../../services/persona/persona.service';
import { Persona } from '../../models/persona.model';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit, DoCheck {
  productos: Producto[] = [];
  fechaActual = new Date();
  operacion: Operacion;

  differ: any;
  constructor(
    private sharedService: SharedService,
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

    this.personaService.consultarPorId(1).subscribe((persona: Persona) => {
      this.operacion.persona = persona;
    });
  }

  ngDoCheck() {
    const change = this.differ.diff(this.operacion.detalleOperacion);

    if ( change ) {
      const detalle: DetalleOperacion [] = change.collection as  DetalleOperacion [];
      this.actualizarTotal(detalle);
    }
  }

  actualizarTotal(detalle: DetalleOperacion []) {
      let total = 0;
      for ( const p of detalle ) {
        total += Number(p.total);
      }
      this.operacion.total = total;
  }

  borrar(producto: Producto) {
      // this.operacion.detalleOperacion = this.operacion.detalleOperacion.filter((det: DetalleOperacion) => {
      //   if ( det.producto.id === producto.id ) {
      //       if ( det.cantidad === 1) {
      //         return false;
      //       } else {
      //         det.cantidad--;
      //         return true;
      //       }
      //   }
      //   return true;
      // });
    //}
  }

  keypress(event) {
    if ( event.key === 'Enter') {
      this.productoService.consultarPorCodigo(event.target.value).subscribe((producto: Producto) => {
          if ( producto ) {
            let prductoAgregado = false;
            for ( const detalleOp of this.operacion.detalleOperacion ) {
              if ( detalleOp.producto.id === producto.id ) {
                detalleOp.cantidad ++;
                detalleOp.total = Number(detalleOp.producto.precio) * detalleOp.cantidad;
                prductoAgregado = true;
              }
            }
            if ( !prductoAgregado ) {
              const detalleOperacion: DetalleOperacion = new DetalleOperacion();
              detalleOperacion.producto = producto;
              detalleOperacion.cantidad = 1;
              detalleOperacion.operacion = this.operacion;
              detalleOperacion.total = producto.precio * detalleOperacion.cantidad;

              this.operacion.detalleOperacion.push(detalleOperacion);
            }
            this.actualizarTotal(this.operacion.detalleOperacion);
          }
      });
    }
  }

  incrementarCantidad(detalleOperacion: DetalleOperacion) {
      detalleOperacion.cantidad++;
      detalleOperacion.total = detalleOperacion.cantidad * detalleOperacion.producto.precio;
      this.actualizarTotal(this.operacion.detalleOperacion);
  }

  decrementarCantidad(detalleOperacion: DetalleOperacion) {
    if ( detalleOperacion.cantidad > 1) {
      detalleOperacion.cantidad--;
      detalleOperacion.total = detalleOperacion.cantidad * detalleOperacion.producto.precio;
      this.actualizarTotal(this.operacion.detalleOperacion);
    }
  }
}
