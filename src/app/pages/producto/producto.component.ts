import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto/producto.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Unidad } from '../../models/unidad.model';
import { Categori } from '../../models/categori.model';
import { Marca } from '../../models/marca.model';
import { UnidadService } from '../../services/unidad/unidad.service';
import { MarcaService } from '../../services/marca/marca.service';
import { CategoriaService } from '../../services/categoria/categoria.service';
import { Observable } from 'rxjs/Observable';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { IResponse } from '../../interfaces/response.interface';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styles: []
})
export class ProductoComponent {
  producto: Producto = new Producto();
  unidades: Unidad [] = [];
  categorias: Categori [] = [];
  marcas: Marca [] = [];
  form: FormGroup;
  esNuevo = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private productoService: ProductoService,
    private unidadService: UnidadService,
    private marcaService: MarcaService,
    private categoriaService: CategoriaService,
    private modalUploadService: ModalUploadService
    ) {

      this.unidadService.consultarTodo().subscribe((unidades: Unidad []) => {
          this.unidades = unidades;
      });

      this.marcaService.consultarTodo(false).subscribe((marcas: Marca []) => {
        this.marcas = marcas;
      });

      this.categoriaService.consultarTodo(false).subscribe((categorias: Categori []) => {
        this.categorias = categorias;
      });

      this.activatedRoute.params.subscribe((params) => {
          if ( params.id !== 'nuevo') {
            this.productoService.consultarPorId(params.id).subscribe((producto: Producto) => {
                this.producto = producto;
            });
          } else {
            this.esNuevo = true;
          }
          this.inicializarForm();
      });

      this.modalUploadService.notificacion.subscribe((response: IResponse) => {
          this.producto.imagen = response.data.imagen;
      });
  }

  private inicializarForm() {
    this.form = new FormGroup({
      codigo:       new FormControl('', Validators.required),
      nombre:       new FormControl('', Validators.required),
      descripcion:  new FormControl('', Validators.required),
      costo:        new FormControl('', Validators.required),
      precio:       new FormControl('', [Validators.required, Validators.pattern('\d+(\.\d{1,2})$')]),
      unidad:       new FormControl('', [Validators.required, Validators.pattern('\d+(\.\d{1,2})$')]),
      stockMinimo:  new FormControl('', Validators.required),
      marca:        new FormControl('', Validators.required),
      categoria:    new FormControl('', Validators.required),
      estatus:      new FormControl('', Validators.required)
    });

    if ( this.esNuevo ) {
      this.form.controls.codigo.setAsyncValidators(this.existeCodigo.bind(this));
    }
  }

  mostrarModal(id: number) {
    this.modalUploadService.mostrarModal('producto', id);
  }
  existeCodigo(control: FormControl): Promise<any> | Observable<any> {
    return this.productoService.existeCodigo(control.value);
  }

  submit() {
    const productoDto: any = Object();
    productoDto.codigo = this.producto.codigo;
    productoDto.nombre = this.producto.nombre;
    productoDto.descripcion = this.producto.descripcion;
    productoDto.costo = this.producto.costo;
    productoDto.precio = this.producto.precio;
    productoDto.unidadId = this.producto.unidad.id;
    productoDto.stockminimo = this.producto.stockminimo;
    productoDto.marcaId = this.producto.marca.id;
    productoDto.categoriaId = this.producto.categoria.id;
    productoDto.estatus = this.producto.estatus;
    if ( this.esNuevo ) {
      this.productoService.registrar(productoDto).subscribe();
    } else {
      this.productoService.actualizar(this.producto.id, productoDto).subscribe();
    }
  }

}
