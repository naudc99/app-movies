import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Review } from '../../interfaces/review';
import { PaginatedResponse } from '../../interfaces/paginated-response';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}reviews`;

  constructor(private http: HttpClient) { }

  // Crear una nueva review
  createReview(review: Review): Observable<Review> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Review>(this.apiUrl, review, { headers }).pipe(
      catchError((error) => {
        console.error('Error creating review:', error);
        return throwError(() => new Error('Error creating review'));
      })
    );
  }

  // Eliminar una review por ID
  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting review:', error);
        return throwError(() => new Error('Error deleting review'));
      })
    );
  }

  getUserReviews(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError((error) => {
        console.error('Error fetching user reviews:', error);
        return throwError(() => new Error('Error fetching user reviews'));
      })
    );
  }

  getReviewsPaginated(movieId: number, page: number = 0, size: number = 5, sortBy: string = 'reviewId'): Observable<PaginatedResponse<Review>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<PaginatedResponse<Review>>(`${this.apiUrl}/movie/${movieId}`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching paginated reviews:', error);
        return throwError(() => new Error('Error fetching paginated reviews'));
      })
    );
  }

  editReview(id: number, review: Review): Observable<Review> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Review>(`${this.apiUrl}/${id}`, review, { headers }).pipe(
      catchError((error) => {
        console.error('Error updating review:', error);
        return throwError(() => new Error('Error updating review'));
      })
    );
  }
}
