import { Usuario } from './usuario.model';
import { Empresa } from './empresa.model';

export class Configuracion {
    public id: number;
    public empresa: Empresa;
    public codigo: string;
    public valor: string;
    public fechamodificacion: Date;
    public usuariomodificacion: Usuario;

    constructor() {
        this.empresa = new Empresa();
    }
}
