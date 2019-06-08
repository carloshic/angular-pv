import { Usuario } from './usuario.model';

export class TipoOperacion {

    public id: number;
    public codigo: string;
    public nombre: string;
    public naturaleza: number;
    public fechamodificacion: Date;
    public usuariomodificacion: Usuario;

    constructor() {
        this.id = -1;
        this.codigo = '';
        this.nombre = '';
        this.naturaleza = -1;
        this.fechamodificacion = new Date();
        this.usuariomodificacion = new Usuario();
    }
}