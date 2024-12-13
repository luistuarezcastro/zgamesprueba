import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { EventoDeportivo } from './evento-deportivo.model';
import { ApiResponse } from './api-response.model'; // Importa la interfaz de la respuesta

@Injectable({
  providedIn: 'root'
})
export class EventosDeportivosService {
  private api1Url = 'https://betapi.zgameslatam.com/v1/api/sport-events/prematch-highlights?sportId=sr:sport:1&statusSportEvent=NotStarted&marketId=1&limit=10';
  private api2Url = 'https://betapi.zgameslatam.com/v1/api/sport-events/prematch-highlights?sportId=sr:sport:2&statusSportEvent=NotStarted&marketId=1&limit=10';

  constructor(private http: HttpClient) {}

  getEventos(): Observable<EventoDeportivo[]> {
    // Realizamos dos llamadas API en paralelo
    const api1$ = this.http.get<ApiResponse>(this.api1Url).pipe(
      tap(response => {
        console.log('Datos de la API 1:', response);
      }),
      map(response => response.data.map(event => new EventoDeportivo(event))),
      catchError(error => {
        console.error('Error al cargar los eventos de la API 1:', error);
        return of([]); // Retorna un arreglo vacío en caso de error
      })
    );

    const api2$ = this.http.get<ApiResponse>(this.api2Url).pipe(
      tap(response => {
        console.log('Datos de la API 2:', response);
      }),
      map(response => response.data.map(event => new EventoDeportivo(event))),
      catchError(error => {
        console.error('Error al cargar los eventos de la API 2:', error);
        return of([]); // Retorna un arreglo vacío en caso de error
      })
    );

    // Combinamos los resultados de ambas APIs
    return forkJoin([api1$, api2$]).pipe(
      map(([api1Data, api2Data]) => [...api1Data, ...api2Data]) // Combina los datos
    );
  }
}
