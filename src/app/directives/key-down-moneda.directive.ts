import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appKeyDownMoneda]'
})
export class KeyDownMonedaDirective {

  constructor() {
    alert("");
    console.log('Inicia', 'appKeyDownMoneda');
   }

  @HostListener('window:keyup', ['$event'])
  onkeydown( event: KeyboardEvent ) {
    alert("");
  }
}
