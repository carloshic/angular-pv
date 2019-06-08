import { Usuario } from './usuario.model';
import { Empresa } from './empresa.model';

export class Categori {
    public id: number;
        public empresaId: number;
        public empresa: Empresa;
        public nombre: string;
        public descripcion: string;
        public estatus: boolean;
        public usuarioestatus: Usuario;
        public fechamodificacion: Date;
        public usuariomodificacion: Usuario;
    constructor( ) {
        this.estatus = true;
        this.usuariomodificacion = new Usuario();
     }
}
