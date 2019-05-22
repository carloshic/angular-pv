export interface IServiceBase {
    consultarTodo(incluirInactivos: boolean): any;
    consultarPorId(id: number): any;
    registrar(nuevo: any): any;
    actualizar(id: number, actualizar: any): any;
    borrar(id: number): any;
}
