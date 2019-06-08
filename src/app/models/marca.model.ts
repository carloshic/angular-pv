import { Usuario } from './usuario.model';
import { Empresa } from './empresa.model';

export class Marca {
    public id: number;
    public empresa: Empresa;
    public nombre: string;
    public descripcion: string;
    public estatus: boolean;
    public usuarioestatus: Usuario;
    public fechamodificacion: Date;
    public usuariomodificacion: Usuario;
    constructor( ) {
        this.empresa = new Empresa();
        this.estatus = true;
        this.usuarioestatus = new Usuario();
        this.usuariomodificacion = new Usuario();
    }
}
