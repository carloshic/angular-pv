import { Usuario } from './usuario.model';

export class Unidad {
    public id: number;
    public codigo: string;
    public descripcion: string;
    public estatus: boolean;
    public fechamodificacion: Date;
    public usuariomodificacion: Usuario;

    constructor() {
        this.id = -1;
        this.estatus = true;
        this.usuariomodificacion = new Usuario();
     }
}
