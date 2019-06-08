import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaLocal'
})
export class FechaLocalPipe implements PipeTransform {

  transform(fecha: Date, args?: any): any {
    const numeroMes = fecha.getMonth();
    const numeroDiaSemana = fecha.getDay();
    const numeroDiaMes = fecha.getDate();
    const NOMBRE_MESES = [
              'Enero',
              'Febrero',
              'Marzo',
              'Abril',
              'Mayo',
              'Junio',
              'Julio',
              'Agosto',
              'Septiembre',
              'Ocutubre',
              'Noviembre',
              'Diciembre',
        ];
    const NOMBRE_DIAS_SEMANA = [
      'Lunes',
      'Martes',
      'Miercoles',
      'Juevez',
      'Viernes',
      'Sabado',
      'Domingo',
    ];
    return `${NOMBRE_DIAS_SEMANA[numeroDiaSemana]} ${numeroDiaMes} de ${NOMBRE_MESES[numeroMes]} de ${fecha.getFullYear()}`;
  }
}
