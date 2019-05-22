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
        this.id = -1;
        this.empresa = new Empresa();
        this.estatus = true;
        this.usuarioestatus = new Usuario();
        this.usuariomodificacion = new Usuario();
    }
}
