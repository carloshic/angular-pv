import { Categori } from './categori.model';
import { Empresa } from './empresa.model';
import { Unidad } from './unidad.model';
import { Usuario } from './usuario.model';
import { Marca } from './marca.model';

export class Producto {
    public id: number;
    public empresa: Empresa;
    public codigo: string;
    public nombre: string;
    public descripcion: string;
    public costo: number;
    public precio: number;
    public unidad: Unidad;
    public stockminimo: number;
    public imagen: string;
    public marca: Marca;
    public categoria: Categori;
    public estatus: boolean;
    public usuarioestatus: Usuario;
    public fechamodificacion: Date;
    public usuariomodificacion: Usuario;
    constructor( ) {
        this.codigo = '';
        this.nombre = '';
        this.descripcion = '';
        this.costo = 0;
        this.precio = 0;
        this.stockminimo = 0;
        this.imagen = '';
        this.estatus = true;
        this.unidad = new Unidad();
        this.marca = new Marca();
        this.categoria = new Categori();
        this.usuarioestatus = new Usuario();
        this.usuariomodificacion = new Usuario();
    }
}
