import { Injectable } from '@angular/core';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Injectable({
  providedIn: 'root'
})
export class BlockUIService {
  @BlockUI() private blockUI: NgBlockUI;

  constructor() { }
  bloquearUI(mensaje: string = 'Cargando') {
    console.log('')
    this.blockUI.start(mensaje); // Start blocking
  }
  desbloquearUI() {
    if ( this.blockUI.isActive ) {
      this.blockUI.stop();
    }
  }

}
