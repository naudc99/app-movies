import { Component, HostListener, OnInit } from '@angular/core';
import { Movie } from '../../../interfaces/movie';
import { MovieService } from '../../../services/movie/movie.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  movies: Movie[] = [];
  moviesWithGenres: { movie: Movie, genresString: string }[] = []; // Nueva estructura
  page: number = 0; // Para controlar la paginación
  size: number = 20; // Número de películas por página
  isLoading: boolean = false; // Controlar el estado de carga
  searchTerm: string = '';
  

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(searchTerm: string = ''): void {
    if (this.isLoading) return; // Evitar múltiples cargas
    this.isLoading = true;

    this.movieService.getAllMoviesPaginated(this.page, this.size, 'title', searchTerm)
      .subscribe(data => {
        const newMoviesWithGenres = data.content.map(movie => ({
          movie: movie,
          genresString: movie.genres.map(genre => genre.name).join(', ')
        }));

        // Concatenar las nuevas películas a las existentes
        this.moviesWithGenres = [...this.moviesWithGenres, ...newMoviesWithGenres];
        this.page++; // Incrementar la página para la próxima carga
        this.isLoading = false; // Cambiar el estado de carga
      }, error => {
        console.error('Error loading movies:', error);
        this.isLoading = false; // Asegúrate de que el estado de carga se restablezca
      });
  }

  onSearch(): void {
    this.page = 0;
    this.moviesWithGenres = [];  // Reiniciar las películas mostradas
    this.getMovies(this.searchTerm);
  }

  // Método para manejar el scroll
  @HostListener('window:scroll', [])
  onScroll(): void {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.pageYOffset + windowHeight;

    // Verifica si estamos cerca del final de la página (con margen de 100px)
    if (scrollPosition >= documentHeight - 100 && !this.isLoading) {
      this.getMovies(this.searchTerm); // Cargar más películas
    }
  }

  navigateToDetailMovie(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }
}
