import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Genre } from '../../interfaces/genre';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../interfaces/paginated-response';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private apiUrl = `${environment.apiUrl}genres`;

  constructor(private http: HttpClient) { }

  // Obtener todos los géneros
  getAllGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.apiUrl);
  }

  // Obtener un género por ID
  getGenreById(id: number): Observable<Genre> {
    return this.http.get<Genre>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo género
  createGenre(genre: Genre): Observable<Genre> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Genre>(this.apiUrl, genre, { headers });
  }

  // Actualizar un género existente
  updateGenre(id: number, genre: Genre): Observable<Genre> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Genre>(`${this.apiUrl}/${id}`, genre, { headers });
  }

  // Eliminar un género
  deleteGenre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllGenresPaginated(page: number, size: number, sortBy: string, searchTerm: string = ''): Observable<PaginatedResponse<Genre>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);
  
    if (searchTerm) {
      params = params.set('name', searchTerm); // Agregar el término de búsqueda si está presente
    }
  
    return this.http.get<PaginatedResponse<Genre>>(this.apiUrl, { params });
  }
  
}
