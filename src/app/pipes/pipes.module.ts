import { NgModule } from '@angular/core';
import { ImagenPipe } from './imagen.pipe';
import { FechaLocalPipe } from './fecha-local.pipe';



@NgModule({
  imports: [ ],
  declarations: [
    ImagenPipe,
    FechaLocalPipe
  ],
  exports: [
    ImagenPipe,
    FechaLocalPipe
  ]
})
export class PipesModule { }
