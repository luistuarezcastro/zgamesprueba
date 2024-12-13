// src/app/services/bet.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Hace disponible este servicio en toda la aplicación
})
export class BetService {
  private apiUrl = 'http://localhost:3000/api/guardar-apuesta';  // Cambia esta URL según la configuración de tu backend

  constructor(private http: HttpClient) {}

  // Método para guardar la apuesta
  guardarApuesta(apuesta: any): Observable<any> {
    return this.http.post(this.apiUrl, apuesta);
  }
}
