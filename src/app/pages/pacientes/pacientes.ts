import { Component, inject, OnInit, signal, DestroyRef, computed
  , effect, untracked
} from '@angular/core';
import { ListaPacientes } from '../../components/lista-pacientes/lista-pacientes';
import { Paciente } from '../../models/paciente';
import { FichaPaciente } from '../../components/ficha-paciente/ficha-paciente';
import { PacienteService } from '../../services/paciente';
import { finalize, Subject, map, debounceTime, distinctUntilChanged,
   of, switchMap, delay, Observable } from 'rxjs';
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
  pacientesVisibles = signal<Paciente[]>([]);


  /*Metodos de ciclo de vida*/
   ngOnInit(): void {
     this.cargarPacientes();
     this.configurarBuscador();
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
        this.pacientesVisibles.set(pacientesCombinados)
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

  /*Practicando computed() y effect() */
  totalPacientes = computed(() => 
    this.listaPacientes().length
  );

  totalVacunado = computed(() => 
    this.listaPacientes()
      .filter(paciente => paciente.vacunado === true)
      .length
    );

    /* Practicando untracked() 
    Esta herramienta a diferencia de effect no convierte un signal en una dependencia*/
    nombre = signal('Compi');
    edad = signal(7);

    actualizarPacienteUntracked(){
      this.edad.set(5);
      this.nombre.set('Rabanito');
      this.edad.set(40);
    }

    constructor() {
      effect(() => {
        console.log('Total de pacientes actualizado: ', this.totalPacientes())
        console.log('Nombre: ', this.nombre());
        /*
        console.log('Edad:', untracked(() => this.edad())) */
        console.log('Edad:', this.edad())
      });
    }

    /* Practicando Subject */
    busquedas$ = new Subject<string>();

    
    buscarPacientePorNombre(nombre : string): void {
      this.busquedas$.next(nombre);
      console.log('Nombre original:', `"${nombre}"`);
    }

    configurarBuscador(): void {
      this.busquedas$
      .pipe(
        map( nombre => 
          nombre.trim()
        ),
        debounceTime(500),
        distinctUntilChanged(), 
        switchMap( nombre => {
          if(nombre === ''){
            return of(this.listaPacientes())
          }

          return this.filtrarPacientes(nombre)
        })
      )
      .subscribe({
        next: (pacientes) => {
          console.log('Pacientes encontrados:', pacientes)
          this.pacientesVisibles.set(pacientes)
        }
      })
    }

    filtrarPacientes(nombre: string): Observable<Paciente[]> {
      console.log('Iniciando busqueda: ', nombre)
       const pacientesEncontrados = this.listaPacientes().filter( 
        paciente => paciente.nombre.toLowerCase()
        .includes(nombre.toLowerCase())
      );
      /* Devolver el observable con un retraso de 2000 ms */
      return of(pacientesEncontrados).pipe(
        delay(2000)
      )
    }

    

    




}