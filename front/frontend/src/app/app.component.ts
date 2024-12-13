import { Component, OnInit } from '@angular/core';
import { EventosDeportivosService } from './eventos-deportivos.service';
import { EventoDeportivo } from './evento-deportivo.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  eventos: EventoDeportivo[] = [];
  eventosFiltrados: EventoDeportivo[] = [];
  eventoSeleccionado: EventoDeportivo | null = null;
  resultadoSeleccionado: string = '';
  montoApuesta: number | null = null;
  cuponesApuestas: any[] = [];
  ganancias: number = 0;
  gananciasVisible: boolean = false;
  filtroActual: string = 'todos';
  seccionActual: string = 'eventos';
  searchQuery: string = '';
  detalleApuestaVisible: boolean = false;
  detalleApuesta: any = null;
  notificacionVisible: boolean = false;

  constructor(private eventosService: EventosDeportivosService, private http: HttpClient) {}

  ngOnInit(): void {
    this.eventosService.getEventos().subscribe(
      (data) => {
        this.eventos = data;
        this.aplicarFiltro();
      },
      (error) => {
        console.error('Error al cargar los eventos:', error);
      }
    );
  }

  aplicarFiltro(): void {
    let eventosFiltrados = this.eventos;
    if (this.filtroActual !== 'todos') {
      eventosFiltrados = eventosFiltrados.filter(
        (evento) => evento.sportId === this.filtroActual
      );
    }
    if (this.searchQuery) {
      eventosFiltrados = eventosFiltrados.filter(
        (evento) =>
          evento.equipo1.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          evento.equipo2.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.eventosFiltrados = eventosFiltrados;
  }

  seleccionarFiltro(filtro: string): void {
    this.filtroActual = filtro;
    this.aplicarFiltro();
  }

  seleccionarEvento(evento: EventoDeportivo): void {
    this.eventoSeleccionado = evento;
    this.resultadoSeleccionado = '';
    this.montoApuesta = null;
  }

  filtrarPorBusqueda(): void {
    this.aplicarFiltro();
  }

  agregarApuesta(): void {
    if (this.eventoSeleccionado && this.resultadoSeleccionado && this.montoApuesta) {
      const nuevoCupon = {
        evento: `${this.eventoSeleccionado.equipo1} vs ${this.eventoSeleccionado.equipo2}`,
        resultado: this.resultadoSeleccionado,
        monto: this.montoApuesta,
        cuota: this.obtenerCuotaSeleccionada()
      };

      this.cuponesApuestas.push(nuevoCupon);
      this.http.post('http://localhost:3000/api/guardar-apuesta', nuevoCupon).subscribe(
        (response) => {
          console.log('Apuesta guardada:', response);
          this.mostrarNotificacion();
        },
        (error) => {
          console.error('Error al guardar la apuesta:', error);
        }
      );

      this.cerrarModal();
    } else {
      alert('Por favor, complete todos los campos');
    }
  }

  // Mostrar la notificación de cupo generado
  mostrarNotificacion() {
    this.notificacionVisible = true;
    setTimeout(() => {
      this.notificacionVisible = false; // Desaparece después de 3 segundos
    }, 3000);
  }

  obtenerCuotaSeleccionada(): string {
    if (!this.eventoSeleccionado) {
      return '';
    }
    switch (this.resultadoSeleccionado) {
      case '1':
        return this.eventoSeleccionado.cuotaEquipo1 ? this.eventoSeleccionado.cuotaEquipo1.toString() : '';
      case 'X':
        return this.eventoSeleccionado.cuotaEmpate ? this.eventoSeleccionado.cuotaEmpate.toString() : '';
      case '2':
        return this.eventoSeleccionado.cuotaEquipo2 ? this.eventoSeleccionado.cuotaEquipo2.toString() : '';
      default:
        return '';
    }
  }

  mostrarGanancias(): void {
    if (this.cuponesApuestas.length > 0) {
      const cupon = this.cuponesApuestas[this.cuponesApuestas.length - 1];
      this.ganancias = cupon.monto * cupon.cuota;
      this.gananciasVisible = true;
    }
  }

  cerrarModalGanancias(): void {
    this.gananciasVisible = false;
  }

  cerrarModal(): void {
    this.eventoSeleccionado = null;
    this.resultadoSeleccionado = '';
    this.montoApuesta = null;
    this.gananciasVisible = false;
  }

  limpiarApuesta(cupon: any): void {
    const index = this.cuponesApuestas.indexOf(cupon);
    if (index > -1) {
      this.cuponesApuestas.splice(index, 1);
    }
  }

  mostrarDetalles(cupon: any): void {
    this.detalleApuesta = cupon;
    this.detalleApuestaVisible = true;
  }

  cerrarDetalles(): void {
    this.detalleApuestaVisible = false;
  }

  eliminarApuesta(cupon: any): void {
    const index = this.cuponesApuestas.indexOf(cupon);
    if (index > -1) {
      this.cuponesApuestas.splice(index, 1);
    }
  }

  mostrarSeccion(seccion: string): void {
    this.seccionActual = seccion;
  }
}
