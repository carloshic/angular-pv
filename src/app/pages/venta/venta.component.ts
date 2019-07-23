import { Component, OnInit, IterableDiffers, DoCheck, ViewChild, ElementRef, ɵConsole  } from '@angular/core';
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
import { OperacionService } from '../../services/operacion/operacion.service';
import { InventarioService } from '../../services/inventario/inventario.service';
import { Inventario } from '../../models/inventario.model';
import swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit, DoCheck {
  clientes: Persona [] = [];
  clienteDefault: Persona;
  productos: Producto[] = [];
  operacion: Operacion;
  differ: any;
  pantallaCompleta = false;

  @ViewChild(PerfectScrollbarComponent) public scrollListadoProd: PerfectScrollbarComponent;

  constructor(
    private inventarioService: InventarioService,
    private tipoOperacionService: TipoOperacionService,
    private personaService: PersonaService,
    private operacionService: OperacionService,
    differs: IterableDiffers,
  ) {
    this.operacion = new Operacion();
    this.differ = differs.find([]).create(null);
  }

  ngOnInit() {
    this.tipoOperacionService.consultarPorCodigo('VENTA').subscribe((ventaTO: TipoOperacion) => {
      this.operacion.tipooperacion = ventaTO;
    });

    this.cargarPersonas();
    this.personaService.consultarDefaultParaVenta().subscribe((clienteDefault: Persona) => {
      this.operacion.persona = clienteDefault;
      this.clienteDefault = clienteDefault;
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

      this.agregarProducto(1, event.target.value);

      event.target.value = '';
    }
  }

  agregarProducto(cantidad: number, codigo: string) {

    if ( codigo.trim() ) {

      this.inventarioService.consultarPorCodigoProducto(codigo).subscribe((inventario: Inventario) => {
        if ( inventario ) {

          const detalleOp = this.operacion.detalleOperacion.find(x => x.producto.id === inventario.producto.id );

          if ( detalleOp ) {

            let cantidadTmp = (detalleOp.cantidad + cantidad);

            if ( cantidadTmp <= inventario.stock ) {

              if ( cantidadTmp <= 1 ) {

                cantidadTmp = 1;
              }
              detalleOp.cantidad = cantidadTmp;

              detalleOp.total = Number(detalleOp.producto.precio) * detalleOp.cantidad;

              this.despuesProductoAgregado(detalleOp);

            } else if ( cantidadTmp > inventario.stock) {
              // El producto ya fue vendido desde otro pv Igualar la cantidad al stock
              if ( inventario.stock > 0 ) {
                detalleOp.cantidad = inventario.stock;

                swal.fire(
                  'Producto Agotado',
                  `No hay suficiente <strong class="text-danger">${ inventario.producto.nombre } </strong>
                  <br> Stock disponible: <br><span class="text-info fa-2x"> ${ inventario.stock } </span>
                  `, 'warning');
              }
            }
          } else {

            if ( inventario.stock > 0 ) {
              const detalleOperacion: DetalleOperacion = new DetalleOperacion();

              detalleOperacion.producto = inventario.producto;

              detalleOperacion.cantidad = 1;

              detalleOperacion.total = inventario.producto.precio * detalleOperacion.cantidad;

              this.operacion.detalleOperacion.push(detalleOperacion);

              this.despuesProductoAgregado(detalleOperacion);
            } else {
              swal.fire(
                'Producto Agotado',
                `No hay suficiente <strong class="text-danger">${ inventario.producto.nombre } </strong>
                <br> Stock disponible: <br><span class="text-info fa-2x"> ${ inventario.stock } </span>
                `, 'warning');
            }
          }
        }
    });
  }
  }

  moverCantidadProducto(numero: number,  detalleOperacion: DetalleOperacion) {
      this.agregarProducto(numero, detalleOperacion.producto.codigo);
  }

  despuesProductoAgregado(detalleOperacion: DetalleOperacion, mantenerSroll: boolean = false) {
    this.actualizarTotalVenta(this.operacion.detalleOperacion);
    this.highlight(detalleOperacion);
    if ( !mantenerSroll ) {
      this.mantenerScrollAbajo();
    }
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

  guardar() {
    const operacionDto = {
      personaId : this.operacion.persona.id,
      total: this.operacion.total,
      tipooperacionId: this.operacion.tipooperacion.id,
      detalleOperacion : []
    };

    this.operacion.detalleOperacion.forEach(detalle => {
      operacionDto.detalleOperacion.push( {
        productoId : detalle.producto.id,
        cantidad: detalle.cantidad,
        total: detalle.total
      });
    });

    this.operacionService.registrar(operacionDto).subscribe((operacion: any) => {
      if ( operacion ) {
        swal.fire({
          type: 'success',
          title: 'Exito',
          text: `Venta # ${operacion.id} registrada con exito`,
          showConfirmButton: false,
          timer: 1500,
          onClose: () => {
            swal.fire({
              title: 'Impresion',
              text: '¿Desea realizar la impresión?',
              type: 'info',
              showCloseButton: true,
              showCancelButton: true,
              focusConfirm: false,
              confirmButtonText: '<i class="fa fa-print"></i> Imprimir Recibo',
            }).then((result) => {
              this.operacion.detalleOperacion = [];
              this.operacion.persona = this.clienteDefault;
              // if (result.value) {
              // }
            });
          }
        });
      }
    });
  }
  cargarPersonas() {
    this.personaService.consultarTodo().subscribe((personas: Persona[]) => {
      this.clientes = personas.filter(x => x.tipo.toUpperCase() === 'CLIENTE' && !x.esPersonaVentaPublico);
    });
  }
  buscarPersona(term: string) {
    if ( term.length > 0 ) {
      this.personaService.buscar(term).subscribe((personas: Persona []) => {
        this.clientes = personas.filter(x => x.tipo.toUpperCase() === 'CLIENTE' && !x.esPersonaVentaPublico);
      });
    } else {
      this.cargarPersonas();
    }
  }

  seleccionarPersona(persona: Persona) {
    this.operacion.persona = persona;
  }

  establecerClienteDefault() {
    this.operacion.persona = this.clienteDefault;
  }
}
