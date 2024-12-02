import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Director } from '../../interfaces/director';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../interfaces/paginated-response';

@Injectable({
  providedIn: 'root'
})
export class DirectorService {

  private apiUrl = `${environment.apiUrl}directors`;

  constructor(private http: HttpClient) { }

  // Obtener todos los directores
  getAllDirectors(): Observable<Director[]> {
    return this.http.get<Director[]>(this.apiUrl);
  }

  // Obtener un director por ID
  getDirectorById(id: number): Observable<Director> {
    return this.http.get<Director>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo director
  createDirector(director: Director): Observable<Director> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Director>(this.apiUrl, director, { headers });
  }

  // Actualizar un director existente
  updateDirector(id: number, director: Director): Observable<Director> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Director>(`${this.apiUrl}/${id}`, director, { headers });
  }

  // Eliminar un director
  deleteDirector(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllDirectorsPaginated(page: number, size: number, sortBy: string, searchTerm: string = ''): Observable<PaginatedResponse<Director>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);
    
    if (searchTerm) {
      params = params.set('name', searchTerm); // Agregar el término de búsqueda si está presente
    }
  
    return this.http.get<PaginatedResponse<Director>>(this.apiUrl, { params });
  }
}
