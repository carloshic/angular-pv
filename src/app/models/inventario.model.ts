import { Producto } from './producto.model';
import { Usuario } from './usuario.model';

export class Inventario {
    public id: number;
    public producto: Producto;
    public stock: number;
    public fechamodificacion: Date;
    public usuariomodificacion: Usuario;

    constructor() {
        this.id = -1;
        this.producto = new Producto();
        this.stock = 0;
        this.fechamodificacion = new Date();
        this.usuariomodificacion = new Usuario();
    }
}
