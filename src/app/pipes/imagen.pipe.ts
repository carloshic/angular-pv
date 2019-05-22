import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform( img: string, tipo: string = 'usuario'): any {

    let url = URL_SERVICIOS + '/imagenes';

    if ( !img ) {
      return url + '/imagenes/xxx';
    }

    if ( img.indexOf('https') >= 0 ) {
      return img;
    }

    switch ( tipo ) {

      case 'usuario':
        url += '/usuario/' + img;
      break;

      case 'empresa':
        url += '/empresa/' + img;
      break;

      case 'producto':
        url += '/producto/' + img;
      break;

      default:
        console.log('tipo de imagen no existe, usuario, empresa');
        url += '/usurios/xxx';
    }

    return url;
  }

}
