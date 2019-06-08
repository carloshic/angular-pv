import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Meta, Title, MetaDefinition } from '@angular/platform-browser';
import 'rxjs/add/operator/filter';
import { SharedService } from '../../services/service.index';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {
  fechaActual = new Date();
  paginaActual = '';
  carpeta = '';

  constructor(
    private router: Router,
    public title: Title,
    public meta: Meta,
    public sharedService: SharedService,
   ) {

    this.getDataRoute()
      .subscribe( data => {

        this.paginaActual = data.titulo;
        this.carpeta = data.carpeta;
        this.title.setTitle( this.paginaActual );

        const metaTag: MetaDefinition = {
          name: 'description',
          content: this.paginaActual
        };

        this.meta.updateTag(metaTag);

      });

  }

  getDataRoute() {

    return this.router.events
        .filter( evento => evento instanceof ActivationEnd  )
        .filter( (evento: ActivationEnd) => evento.snapshot.firstChild === null )
        .map( (evento: ActivationEnd) => evento.snapshot.data );

  }


  ngOnInit() {
  }

}
