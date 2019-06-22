import { Usuario } from './usuario.model';
import { Producto } from './producto.model';
import { Operacion } from './operacion.model';

export class DetalleOperacion {
    public id: number;
    //public operacion: Operacion;
    public producto: Producto;
    public cantidad: number;
    public total: number;
    public fechamodificacion: Date;
    public usuariomodificacion: Usuario;
    public highlight: boolean;

    constructor() {
        this.id = -1;
        //this.operacion = new Operacion();
        this.producto = new Producto();
        this.cantidad = 0;
        this.total = 0;
        this.fechamodificacion = new Date();
        this.usuariomodificacion  = new Usuario();
        this.highlight = false;
    }
}