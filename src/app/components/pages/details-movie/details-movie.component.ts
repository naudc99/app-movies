import { Component, OnInit } from '@angular/core';
import { Movie } from '../../../interfaces/movie';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../../services/movie/movie.service';
import { UserService } from '../../../services/user/user.service'; // Importa UserServic// Importa LoginService
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../../services/auth/login.service';
import { CreateReviewComponent } from './create-review/create-review.component';
import { MatDialog } from '@angular/material/dialog';
import { ReviewService } from '../../../services/review/review.service';
import { Review } from '../../../interfaces/review';
import { DeleteReviewComponent } from './delete-review/delete-review.component';
import { EditReviewComponent } from './edit-review/edit-review.component';

@Component({
  selector: 'app-details-movie',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './details-movie.component.html',
  styleUrls: ['./details-movie.component.scss']
})
export class DetailsMovieComponent implements OnInit {
  movie: Movie | null = null;
  reviews: Review[] = []; // Arreglo para almacenar las reseñas
  userNames: { [key: number]: string } = {};
  userProfile: { [key: number]: string } = {};
  totalElements: number = 0; // Total de reseñas
  page: number = 0; // Página actual
  size: number = 5; // Tamaño de página
  totalPages: number = 0; // Total de páginas
  safeTrailerUrl: SafeResourceUrl | null = null;
  genresString: string = '';
  isFavorite: boolean = false;
  isWatched: boolean = false;
  hasReviewed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private userService: UserService,
    public loginService: LoginService,
    private reviewService: ReviewService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      this.loadMovie(+movieId); // Cargar reseñas al inicializar
      this.loadReviews(+movieId);
    }
  }

  loadMovie(id: number): void {
    this.movieService.getMovieById(id).subscribe(
      (movie) => {
        this.movie = movie;
        // Verifica si la película está en favoritos y otras acciones
        this.checkIfFavorite(movie.movieId);
        this.checkIfWatched(movie.movieId);
        this.checkIfReviewed(movie.movieId);
        // Formatear la cadena de géneros
        if (movie.genres) {
          this.genresString = movie.genres.map(genre => genre.name).join(', ');
        }
        // Sanitizar y formatear la URL del tráiler
        if (movie.trailer) {
          const videoId = this.extractVideoId(movie.trailer);
          this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
        }
      },
      (error) => {
        console.error('Error loading movie', error);
      }
    );
  }

  loadReviews(movieId: number): void {
    this.reviewService.getReviewsPaginated(movieId, this.page, this.size).subscribe(
        (response) => {
          console.log(response)
            this.reviews = response.content;
            this.getUserNamesWithProfile();
            this.totalElements = response.totalElements;
            this.totalPages = response.totalPages;
        },
        (error) => {
            console.error('Error loading reviews', error);
            // En caso de error, puedes establecer reseñas como un array vacío para evitar problemas de visualización.
            this.reviews = [];
        }
    );
}


  getUserNamesWithProfile(): void {
    const userIds = [...new Set(this.reviews.map(review => review.userId))]; // Obtener IDs únicos

    userIds.forEach(userId => {
      this.userService.getUser(userId).subscribe(
        (user) => {
          this.userNames[userId] = user.name; 
          this.userProfile[userId]=user.image;
        },
        (error) => {
          console.error('Error loading user', error);
        }
      );
    });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page; // Actualiza la página actual
      if (this.movie) {
        this.loadReviews(this.movie.movieId); // Cargar reseñas de la película
      }
    }
  }

  // Método para verificar si la película está en favoritos
  checkIfFavorite(movieId: number): void {
    const userId = this.loginService.userId; // Obtener el ID del usuario del LoginService

    // Aquí puedes hacer una llamada al servicio que verifica si la película está en favoritos
    this.userService.getFavoriteMovies(userId).subscribe(
      (favorites) => {
        this.isFavorite = favorites.some(movie => movie.movieId === movieId);
      },
      (error) => {
        console.error('Error loading favorites', error);
      }
    );
  }

  // Método para añadir o eliminar de favoritos
  // Método para añadir o eliminar de favoritos
  toggleFavorite(): void {
    const userId = this.loginService.userId; // Obtener el ID del usuario del LoginService
    if (this.movie) { // Verificar si movie no es null
      if (this.isFavorite) {
        // Si ya es favorito, eliminar de favoritos
        this.userService.removeMovieFromFavorites(userId, this.movie.movieId).subscribe(
          () => {
            this.isFavorite = false; // Cambia el estado
            console.log('Película eliminada de favoritos');
          },
          (error) => {
            console.error('Error al eliminar de favoritos', error);
          }
        );
      } else {
        // Si no es favorito, añadir a favoritos
        this.userService.addMovieToFavorites(userId, this.movie.movieId).subscribe(
          () => {
            this.isFavorite = true; // Cambia el estado
            console.log('Película añadida a favoritos');
          },
          (error) => {
            console.error('Error al añadir a favoritos', error);
          }
        );
      }
    } else {
      console.error('No se pudo encontrar la película para modificar favoritos.');
    }
  }

  checkIfWatched(movieId: number): void {
    const userId = this.loginService.userId; // Obtener el ID del usuario del LoginService
  
    // Aquí puedes hacer una llamada al servicio que verifica si la película ha sido vista
    this.userService.getWatchedMovies(userId).subscribe(
      (watched) => {
        this.isWatched = watched.some(movie => movie.movieId === movieId);
      },
      (error) => {
        console.error('Error loading watched movies', error);
      }
    );
  }
  
  // Método para añadir o eliminar de vistas
  toggleWatched(): void {
    const userId = this.loginService.userId; // Obtener el ID del usuario del LoginService
    if (this.movie) { // Verificar si movie no es null
      if (this.isWatched) {
        // Si ya ha sido vista, eliminar de vistas
        this.userService.removeMovieFromWatched(userId, this.movie.movieId).subscribe(
          () => {
            this.isWatched = false; // Cambia el estado
            console.log('Película eliminada de vistas');
          },
          (error) => {
            console.error('Error al eliminar de vistas', error);
          }
        );
      } else {
        // Si no ha sido vista, añadir a vistas
        this.userService.addMovieToWatched(userId, this.movie.movieId).subscribe(
          () => {
            this.isWatched = true; // Cambia el estado
            console.log('Película añadida a vistas');
          },
          (error) => {
            console.error('Error al añadir a vistas', error);
          }
        );
      }
    } else {
      console.error('No se pudo encontrar la película para modificar vistas.');
    }
  }

  checkIfReviewed(movieId: number): void {
    const userId = this.loginService.userId; // Obtener ID del usuario

    if (!this.movie) {
        console.error('La película es nula, no se puede verificar si se ha reseñado.'); // Manejo del caso nulo
        return;
    }
  
    // Llamar al servicio que verifica si ha dejado reseñas
    this.reviewService.getUserReviews(userId).subscribe(
        (reviews) => {
            this.hasReviewed = reviews.some(review => review.movieId === movieId); // Comprobar si ha reseñado
        },
        (error) => {
            console.error('Error loading user reviews', error); // Manejo de errores al cargar reseñas
        }
    );
  }

  openReviewDialog(): void {
    const dialogRef = this.dialog.open(CreateReviewComponent, {
      width: '300px',
      data: { movieTitle: this.movie?.title }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submitReview(result.comment, result.score);
      }
    });
  }


  submitReview(comment: string, score: number): void {
    const userId = this.loginService.userId; // Obtener ID del usuario

    // Verificar si movie no es nula antes de continuar
    if (this.movie) { // Si la película existe
        const currentMovie = this.movie; // Asignar a una variable temporal
        const review = {
            reviewId: 0,
            comment: comment,
            score: score,
            movieId: currentMovie.movieId,  // Acceder a movieId de forma segura
            userId: userId
        };

        this.reviewService.createReview(review).subscribe(
            (newReview) => {
                console.log('Reseña creada exitosamente', newReview);
                this.loadMovie(currentMovie.movieId);
                this.loadReviews(currentMovie.movieId); 
            },
            (error) => {
                console.error('Error creando reseña', error); // Manejo de errores al crear reseña
            }
        );
    } else {
        console.error('No se puede enviar la reseña porque la película es nula.'); // Manejo del caso nulo
    }
}
  extractVideoId(url: string): string {
    const regExp = /^.*(youtu\.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }

  backToMovies(){
    this.router.navigate(['/index']); 
  }

  openEditDialog(review: Review): void {
    // Clonar el director para trabajar con una copia
    const reviewCopy = { ...review };

    const dialogRef = this.dialog.open(EditReviewComponent, {
      width: '400px',
      data: { review: reviewCopy }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizar el director original solo si se confirmaron los cambios
        this.reviewService.editReview(review.reviewId, result).subscribe(
          () => {
            if (this.movie) {
              this.loadReviews(this.movie.movieId);
              this.loadMovie(this.movie.movieId);
            }
          },
          (error) => {
            console.error('Error updating review:', error);
          }
        );
      }
    });
  }

  openDeleteDialog(review: Review): void {
    const dialogRef = this.dialog.open(DeleteReviewComponent, {
      width: '300px',
      data: { review: review }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reviewService.deleteReview(review.reviewId).subscribe(
          () => {
            console.log('Reseña eliminada exitosamente');
            if (this.movie) {
              this.loadReviews(this.movie.movieId); 
              this.loadMovie(this.movie.movieId);
            }
          },
          (error) => {
            console.error('Error al eliminar la reseña:', error);
          }
        );
      }
    });
  }
  
}
