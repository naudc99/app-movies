import { Component, OnInit } from '@angular/core';
import { Movie } from '../../../../../interfaces/movie';
import { Director } from '../../../../../interfaces/director';
import { Actor } from '../../../../../interfaces/actor';
import { Genre } from '../../../../../interfaces/genre';
import { MovieService } from '../../../../../services/movie/movie.service';
import { DirectorService } from '../../../../../services/director/director.service';
import { ActorService } from '../../../../../services/actor/actor.service';
import { GenreService } from '../../../../../services/genre/genre.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PaginatedResponse } from '../../../../../interfaces/paginated-response';

@Component({
  selector: 'app-new-movie',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './new-movie.component.html',
  styleUrls: ['./new-movie.component.scss']
})
export class NewMovieComponent implements OnInit {
 
  movieForm: FormGroup;
  directors: Director[] = [];
  actors: Actor[] = [];
  genres: Genre[] = [];
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private directorService: DirectorService,
    private actorService: ActorService,
    private genreService: GenreService,
    private movieService: MovieService,
    private router: Router
  ) {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      synopsis: ['', Validators.required],
      year: [new Date().getFullYear(), Validators.required],
      duration: [0, Validators.required],
      trailer: ['', Validators.required],
      directorId: [null, Validators.required],
      actors: [[]],  // Inicializa como un array vacío
      genres: [[]],   // Inicializa como un array vacío
    });
  }

  ngOnInit(): void {
    this.loadDirectors();
    this.loadActors();
    this.loadGenres();
  }

  loadDirectors(): void {
    this.directorService.getAllDirectorsPaginated(0, 100, 'name')  // Página 0, tamaño 100
      .subscribe(
        (response: PaginatedResponse<Director>) => {
          this.directors = response.content;  // Acceder al array de directores
        },
        (error) => {
          console.error('Error al cargar directores paginados', error);
        }
      );
  }
  

  loadActors(): void {
    this.actorService.getAllActorsPaginated(0, 100, 'name')  // Página 0, tamaño 100, ordenar por 'name'
      .subscribe(
        (response: PaginatedResponse<Actor>) => {
          this.actors = response.content;  // Acceder al array de actores en 'content'
        },
        (error) => {
          console.error('Error al cargar actores paginados', error);
        }
      );
  }
  

  loadGenres(): void {
    this.genreService.getAllGenresPaginated(0, 100, 'name')
      .subscribe(
        (response: PaginatedResponse<Genre>) => {
          this.genres = response.content;  // Acceder al array de géneros
        },
        (error) => {
          console.error('Error al cargar géneros paginados', error);
        }
      );
  }
  

  onPosterSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.previewImage = reader.result;
        // Puedes almacenar la imagen de otra manera si lo necesitas
      };

      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.movieForm.valid) {
        // Crear el objeto que se enviará a la API
        const movieData: any = {
            title: this.movieForm.value.title,
            synopsis: this.movieForm.value.synopsis,
            year: this.movieForm.value.year,
            duration: this.movieForm.value.duration,
            poster: this.previewImage ? this.previewImage.toString().split(',')[1] : null, // Solo la parte base64
            trailer: this.movieForm.value.trailer,
            directorId: this.movieForm.value.directorId,
            actorIds: this.movieForm.value.actors,  // IDs de los actores
            genreIds: this.movieForm.value.genres    // IDs de los géneros
        };

        console.log('Datos de la película a enviar:', movieData);
        
        this.movieService.createMovie(movieData).subscribe(
            (response) => {
                console.log('Película creada:', response);
                this.router.navigate(['/admin/listMovie']);
            },
            (error) => {
                console.error('Error al crear la película:', error.error);
            }
        );
    } else {
        console.error('Por favor, complete todos los campos obligatorios.');
    }
}





  cancel(): void {
    this.router.navigate(['/admin/listMovie']);
  }
}
