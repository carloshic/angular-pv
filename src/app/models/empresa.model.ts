import { Usuario } from './usuario.model';

export class Empresa {
        public id: number;
        public nombre: string;
        public rfc: string;
        public direccion: string;
        public logo: string;
        public estatus: boolean;
        public usuarioestatus: Usuario;
        public fechamodificacion: Date;
        public usuariomodificacion: Usuario;
    constructor( ) {
        this.id = -1;
        this.usuarioestatus = new Usuario();
        this.usuariomodificacion = new Usuario();
    }
}
