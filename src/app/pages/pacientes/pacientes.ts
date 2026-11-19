import { Component, inject, OnInit, signal, DestroyRef, computed} from '@angular/core';
import { ListaPacientes } from '../../components/lista-pacientes/lista-pacientes';
import { Paciente } from '../../models/paciente';
import { FichaPaciente } from '../../components/ficha-paciente/ficha-paciente';
import { PacienteService } from '../../services/paciente';
import { finalize, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Alerts } from '../../components/alerts/alerts';


@Component({
  imports: [ListaPacientes, FichaPaciente, Alerts],
  selector: 'app-pacientes',
  styleUrl: './pacientes.css',
  templateUrl: './pacientes.html',
})
export class Pacientes implements OnInit{

  /* Inyeccion de dependencias */
  private pacienteService = inject(PacienteService)
  private destroyRef = inject(DestroyRef)

  /*Propiedades y estado */
  listaPacientes =  signal<Paciente[]>([]);
  cargandoPacientes = signal<boolean>(false);
  errorPacientes = signal<string | null>(null);
  pacienteRecibido = signal<Paciente | null>(null);
  idBusqueda = signal<number>(0);
  errorBusqueda = signal<string | null>(null);
  cargandoBusqueda = signal<boolean>(false);


  /*Metodos de ciclo de vida*/
   ngOnInit(): void {
     this.cargarPacientes();
   }

  /*Metodos de la clase*/
  recibirPaciente(paciente: Paciente): void{
    this.errorBusqueda.set(null);
    this.pacienteRecibido.set(paciente);
    console.log(paciente)
  }

  cargarPacientes(): void {
    if(this.cargandoPacientes()){
      return;
    }
    this.pacienteRecibido.set(null);
    this.cargandoPacientes.set(true);
    this.errorPacientes.set(null);
    this.pacienteService.obtenerPacientes()
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        console.log('Peticion HTTP finalizada');
        this.cargandoPacientes.set(false);
      })
    )
    .subscribe({
      next: (pacientes) => {
        const pacientesLocales = this.pacienteService.obtenerPacientesRegistrados();
        const pacientesCombinados: Paciente[] = [ 
          ...pacientes,
          ...pacientesLocales
        ]
        this.listaPacientes.set(pacientesCombinados)
      },
      error: (error) => { 
        console.error('Error al cargar los pacientes', error)
        this.errorPacientes.set('No fue posible cargar los pacientes');
      }
    });
  }

  actualizarIdBusqueda(id: string): void {
    this.idBusqueda.set(Number(id))
  }

  idValido(): boolean { 
    const id = this.idBusqueda();
    return id > 0 && Number.isInteger(id);
  }

  buscarPaciente(): void {
    if(!this.idValido() || this.cargandoBusqueda()){
      return;
    }
    this.errorBusqueda.set(null);
    this.pacienteRecibido.set(null);
    this.cargandoBusqueda.set(true);
    const id = this.idBusqueda();
    this.pacienteService.obtenerPacientesPorId(id)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        console.log('Peticion HTTP finalizada')
        this.cargandoBusqueda.set(false);
      })
    )
    .subscribe({
      next: (paciente) => {
        console.log('Paciente encontrado: ', paciente)
        this.pacienteRecibido.set(paciente)
      }, 
      error: (error) => {
        console.error('No fue posible encontrar al paciente.', error);
        this.errorBusqueda.set('No fue posible encontrar al paciente')
      } 
    }
    )

  }

  cerrarErrorPacientes(): void {
    this.errorPacientes.set(null);
  }

  totalPacientes = computed(() => this.listaPacientes().length);

  totalVacunado = computed(() => 
    this.listaPacientes()
      .filter(paciente => paciente.vacunado === true)
      .length
    );




}