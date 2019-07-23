import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appEntradaMoneda]'
})
export class EntradaMonedaDirective {

  constructor() { }
  @HostListener('keypress', ['$event'])
  onkeydown( event ) {
    const PUNTO = '.';

    if ( isNaN(event.key) && event.key !== PUNTO ) {

      this.detener(event);

    }

    if ( event.target.value.indexOf(PUNTO) > -1 ) {

      if ( event.key === PUNTO ) {

        this.detener(event);

      } else {

        if ( event.target.value.split(PUNTO)[1].length === 2 ) {

          this.detener(event);

        } else if ( event.target.selectionStart && event.target.selectionStart < event.target.value.indexOf(PUNTO) ) {
          this.detener(event);
        }
        console.log(event.target.selectionStart);
        console.log(event.target.selectionEnd);
      }
    }
  }
  detener(ev: any) {
    ev.preventDefault();
  }

}
