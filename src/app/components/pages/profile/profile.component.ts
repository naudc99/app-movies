import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Movie } from '../../../interfaces/movie';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/user/user.service';
import { LoginService } from '../../../services/auth/login.service';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  userData!: User;
  favoriteMovies: Movie[]=[];
  watchedMovies: Movie[]=[];
  isLoading: boolean = false;

  constructor(private userService: UserService, private loginSrv: LoginService, private router: Router, private dialog: MatDialog){}

  ngOnInit(): void {
    this.loginSrv.user.subscribe(user => {
      this.userData = user;
      if (user.userId) {
        this.isLoading = true;
        this.getFavoriteMovies(user.userId);
        this.getWatchedMovies(user.userId);
      }
    });
  }

  // Obtener películas favoritas
  getFavoriteMovies(userId: number): void {
    this.userService.getFavoriteMovies(userId).subscribe({
      next: (movies: Movie[]) => {
        this.checkLoadingCompletion();
        this.favoriteMovies = movies;
      },
      error: (error) => {
        console.error('Error al obtener las películas favoritas:', error);
        this.checkLoadingCompletion();
      }
    });
  }

  // Obtener películas vistas
  getWatchedMovies(userId: number): void {
    this.userService.getWatchedMovies(userId).subscribe({
      next: (movies: Movie[]) => {
        this.checkLoadingCompletion();
        this.watchedMovies = movies;
      },
      error: (error) => {
        console.error('Error al obtener las películas vistas:', error);
        this.checkLoadingCompletion();
      }
    });
  }
  private checkLoadingCompletion(): void {
    // Verifica si ambas listas de películas están cargadas para finalizar la carga
    if (this.favoriteMovies.length !== 0 || this.watchedMovies.length !== 0) {
      this.isLoading = false;
    }
  }

  // Puedes obtener el ID del usuario desde tu lógica de autenticación o almacenamiento local
  getUserId(): number {
    // Suponiendo que el ID está almacenado en el localStorage
    return parseInt(localStorage.getItem('userId') || '0', 10);
  }

  removeMovieFromFavorites(movieId: number): void {
    const userId = this.userData.userId; // Obtener el ID del usuario desde userData
    this.userService.removeMovieFromFavorites(userId, movieId).subscribe({
      next: () => {
        // Filtrar la película eliminada de la lista de películas favoritas
        this.favoriteMovies = this.favoriteMovies.filter(movie => movie.movieId !== movieId);
        console.log('Película eliminada de favoritos.');
      },
      error: (error) => {
        console.error('Error al eliminar la película de favoritos:', error);
      }
    });
  }

  removeMovieFromWatched(movieId: number): void {
    const userId = this.userData.userId; // Obtener el ID del usuario desde userData
    this.userService.removeMovieFromWatched(userId, movieId).subscribe({
      next: () => {
        // Filtrar la película eliminada de la lista de películas vistas
        this.watchedMovies = this.watchedMovies.filter(movie => movie.movieId !== movieId);
        console.log('Película eliminada de vistas.');
      },
      error: (error) => {
        console.error('Error al eliminar la película de vistas:', error);
      }
    });
  }
  
  goToMovieDetails(movieId: number): void {
    this.router.navigate(['/movie', movieId]); // Cambia esta ruta según tu configuración de rutas
  }

  openEditDialog(): void {
    // Clonar el usuario para trabajar con una copia
    const userCopy = { ...this.userData };

    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '400px',
      data: { user: userCopy }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí puedes guardar los cambios, actualizar el usuario en el servicio
        this.updateUser(result);
      }
    });
  }

  updateUser(updatedUser: User): void {
    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        this.userData = updatedUser; // Actualiza la información del usuario en el componente
        console.log('Usuario actualizado con éxito');
      },
      error: (error) => {
        console.error('Error al actualizar el usuario:', error);
      }
    });
  }
  

}
