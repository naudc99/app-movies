// list-movie.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Movie } from '../../../../../interfaces/movie';
import { MovieService } from '../../../../../services/movie/movie.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Genre } from '../../../../../interfaces/genre';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-movie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-movie.component.html',
  styleUrls: ['./list-movie.component.scss']
})
export class ListMovieComponent implements OnInit {
  movies: Movie[] = [];
  totalElements: number = 0;
  page: number = 0;
  size: number = 3;
  sortBy: string = 'title';
  totalPages: number = 0; // Para mantener el número total de páginas
  searchTerm: string = '';

  constructor(
    private movieService: MovieService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(searchTerm: string = ''): void {
    this.movieService.getAllMoviesPaginated(this.page, this.size, this.sortBy, searchTerm).subscribe(data => {
      console.log('Respuesta completa del servidor:', data); // Añadir esta línea
      this.movies = data.content;
      this.totalElements = data.totalElements;
      this.totalPages = data.totalPages; // Obtener el total de páginas
    }, (error) => {
      console.error('Error fetching movies:', error); // Manejar errores
    });
}

  
onSearch(): void {
  this.page = 0; 
  this.getMovies(this.searchTerm); 
}


onPageChange(page: number): void {
  if (page >= 0 && page < this.totalPages) {
    this.page = page;
    this.getMovies(this.searchTerm); 
  }
}

  addMovie(): void {
    this.router.navigate(['/admin/newMovie']); 
  }

  openEditDialog(movie: Movie): void {
    const movieCopy = { ...movie };
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '400px',
      data: { movie: movieCopy }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.movieService.updateMovie(movie.movieId, result).subscribe(
          () => {
            this.getMovies();
          },
          (error) => {
            console.error('Error updating movie:', error);
          }
        );
      }
    });
  }

  openDeleteDialog(movie: Movie): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '300px',
      data: { movie: movie }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.movieService.deleteMovie(movie.movieId).subscribe(
          () => {
            this.getMovies();
          },
          (error) => {
            console.error('Error deleting movie:', error);
          }
        );
      }
    });
  }

  getGenreNames(genres: Genre[]): string {
    return genres.map(genre => genre.name).join(', ');
}

}
