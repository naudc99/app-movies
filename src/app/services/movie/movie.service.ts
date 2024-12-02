import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Movie } from '../../interfaces/movie';
import { Observable, catchError, throwError } from 'rxjs';
import { PaginatedResponse } from '../../interfaces/paginated-response';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  // Usamos el environment para definir la URL base
  private apiUrl = `${environment.apiUrl}movies`;

  constructor(private http: HttpClient) { }

  // Obtener todas las películas
  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching movies:', error);
        return throwError(() => new Error('Error fetching movies'));
      })
    );
  }


  // Obtener una película por ID
  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva película
  createMovie(movie: Movie): Observable<Movie> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Movie>(this.apiUrl, movie, { headers });
  }

  // Actualizar una película existente
  updateMovie(id: number, movie: Movie): Observable<Movie> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Movie>(`${this.apiUrl}/${id}`, movie, { headers });
  }

  // Eliminar una película
  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllMoviesPaginated(page: number, size: number, sortBy: string, searchTerm: string = ''): Observable<PaginatedResponse<Movie>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    if (searchTerm) {
      params = params.set('tittle', searchTerm); // Agregar el término de búsqueda si está presente
    }
  
    return this.http.get<PaginatedResponse<Movie>>(this.apiUrl, { params });
  }
}
