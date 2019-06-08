import { Usuario } from './usuario.model';

export class Persona {
    public id: number;
    public nombre: string;
    public nombreempresa: string;
    public direccion: string;
    public telefono: string;
    public correo: string;
    public tipo: string;
    public estatus: boolean;
    public usuarioestatus: Usuario;
    public fechamodificacion: Date;
    public usuariomodificacion: Usuario;

    constructor() {
        this.id = -1;
        this.nombre = '';
        this.nombreempresa = '';
        this.direccion = '';
        this.telefono = '';
        this.correo = '';
        this.tipo = '';
        this.estatus = true;
        this.usuarioestatus = new Usuario();
        this.fechamodificacion = new Date();
        this.usuariomodificacion = new Usuario();
    }
}