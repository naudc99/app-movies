import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Actor } from '../../interfaces/actor';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../interfaces/paginated-response';

@Injectable({
  providedIn: 'root'
})
export class ActorService {
  private apiUrl = `${environment.apiUrl}actors`;

  constructor(private http: HttpClient) { }

  // Obtener todos los actores
  getAllActors(): Observable<Actor[]> {
    return this.http.get<Actor[]>(this.apiUrl);
  }

  // Obtener un Actor por ID
  getActorById(id: number): Observable<Actor> {
    return this.http.get<Actor>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo Actor
  createActor(director: Actor): Observable<Actor> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Actor>(this.apiUrl, director, { headers });
  }

  // Actualizar un Actor existente
  updateActor(id: number, director: Actor): Observable<Actor> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Actor>(`${this.apiUrl}/${id}`, director, { headers });
  }

  // Eliminar un Actor
  deleteActor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllActorsPaginated(page: number, size: number, sortBy: string, searchTerm: string = ''): Observable<PaginatedResponse<Actor>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    if (searchTerm) {
      params = params.set('name', searchTerm); // Agregar el término de búsqueda si está presente
    }
  
    return this.http.get<PaginatedResponse<Actor>>(this.apiUrl, { params });
  }
  
}
