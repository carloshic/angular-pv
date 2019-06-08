import { Usuario } from './usuario.model';

export class Caja {
    public id: number;
    public fechamodificacion: Date;
    public usuariomodificacion: Usuario;

    constructor() {
        this.id = -1;
        this.fechamodificacion = new Date();
        this.usuariomodificacion = new Usuario();
    }
}
