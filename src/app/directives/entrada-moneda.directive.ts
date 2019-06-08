import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appEntradaMoneda]'
})
export class EntradaMonedaDirective {

  constructor() { }
  @HostListener('keypress', ['$event'])
  onkeydown( event ) {
    const PUNTO = '.';
    const tecla = event.key;
    const valorActual = event.target.value as string;

    if ( isNaN(event.key) && event.key !== PUNTO ) {

      this.detener(event);

    }

    if ( event.target.value.indexOf(PUNTO) > -1 ) {

      if ( event.key === PUNTO ) {

        this.detener(event);

      } else {

        if ( event.target.value.split(PUNTO)[1].length === 2 &&
              event.target.selectionStart < event.target.value.indexOf(PUNTO)) {

          this.detener(event);

        }
      }
    }
  }
  detener(ev: any) {
    ev.preventDefault();
  }

}
