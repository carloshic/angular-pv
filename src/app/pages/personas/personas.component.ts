import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Persona } from '../../models/persona.model';
import { PersonaService } from '../../services/persona/persona.service';
import { NgForm } from '@angular/forms';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css']
})
export class PersonasComponent implements OnInit {
  private timeOutBusqueda = -1;
  public personas: Persona [];
  public persona: Persona;
  public esNuevo: boolean;
  public incluirInactivos: boolean;

  public tiposPersona = [
    { value: 'Cliente', text: 'Cliente' },
    { value: 'Proveedor', text: 'Proveedor' },
  ];

  @ViewChild('cerrarModal') cerrarModal: ElementRef;
  constructor(
    private personaService: PersonaService,
  ) {
    this.personas = [];
    this.persona = new Persona();
    this.esNuevo = false;
    this.cargarPersonas();
  }

  ngOnInit() {

  }

  cargarPersonas() {
    window.setTimeout(() => {
      this.personaService.consultarTodo(this.incluirInactivos).subscribe((personas: Persona []) => {
        this.personas = personas;
      });
    }, 100);
  }

  nuevaPersona() {
    this.persona = new Persona();
    this.esNuevo = true;
  }
  editarPersona(persona: Persona) {
    this.persona = persona;
    this.esNuevo = false;
  }
  guardar(form: NgForm) {

    this.cerrarModal.nativeElement.click();

    if ( this.esNuevo) {
      this.personaService.registrar(this.persona).subscribe(() => {
        this.cargarPersonas();
      });
    } else {
      this.personaService.actualizar(this.persona.id, this.persona).subscribe(() => {
        this.cargarPersonas();
      });
    }
  }

  buscarPersonas(termino: string) {
    if ( termino.length <= 0 ) {

      this.cargarPersonas();

    } else {
      if ( this.timeOutBusqueda !== -1) {
        window.clearTimeout(this.timeOutBusqueda);
      }

      this.timeOutBusqueda = window.setTimeout(() => {

        this.timeOutBusqueda = -1;

        this.personaService.buscar( termino, this.incluirInactivos ).subscribe( (personas: Persona[]) => {
          this.personas = personas;
        });
      }, 400);
    }
  }

}
