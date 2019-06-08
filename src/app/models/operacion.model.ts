import { Persona } from './persona.model';
import { TipoOperacion } from './tipo-operacion.model';
import { DetalleOperacion } from './detalle-operacion.model';
import { Caja } from './caja.model';
import { Usuario } from './usuario.model';

export class Operacion {
    id: number;
    persona: Persona;
    total: number;
    tipooperacion: TipoOperacion;
    detalleOperacion: DetalleOperacion[];
    caja: Caja;
    fechamodificacion: Date;
    usuariomodificacion: Usuario;

    constructor() {
        this.id = -1;
        this.persona = new Persona();
        this.total = 0;
        this.tipooperacion = new TipoOperacion();
        this.detalleOperacion = [];
        this.caja = new Caja();
        this.fechamodificacion = new Date();
        this.usuariomodificacion = new Usuario();
    }
}