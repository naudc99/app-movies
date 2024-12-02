import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../interfaces/user';
import { environment } from '../../../environment/environment';
import { Movie } from '../../interfaces/movie';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}user/`;

  constructor(private http: HttpClient) { }

  // Obtener un usuario por su ID
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar usuario completo
  updateUser(userRequest: User): Observable<any> {
    return this.http.put(`${this.apiUrl}${userRequest.userId}`, userRequest).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar el nombre de usuario
  updateUserName(userId: number, nameNew: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}${userId}/name`, { nameNew }).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar el email del usuario
  updateUserEmail(userId: number, emailNew: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}${userId}/email`, { emailNew }).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un usuario
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Agregar una película a favoritos
  addMovieToFavorites(userId: number, movieId: number): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}${userId}/favorites/${movieId}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar una película de favoritos
  removeMovieFromFavorites(userId: number, movieId: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}${userId}/favorites/${movieId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Agregar una película a la lista de vistas
  addMovieToWatched(userId: number, movieId: number): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}${userId}/watched/${movieId}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar una película de la lista de vistas
  removeMovieFromWatched(userId: number, movieId: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}${userId}/watched/${movieId}`).pipe(
      catchError(this.handleError)
    );
  }

   // Obtener la lista de películas favoritas del usuario
   getFavoriteMovies(userId: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}${userId}/favorites`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener la lista de películas vistas del usuario
  getWatchedMovies(userId: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}${userId}/watched`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error('Se ha producido un error:', error.error);
    } else {
      console.error('Backend retornó el código de estado:', error.status, 'cuerpo:', error.error);
    }
    return throwError('Algo falló. Por favor intente nuevamente.');
  }
}
