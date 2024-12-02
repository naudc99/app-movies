import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Genre } from '../../../../../interfaces/genre';
import { GenreService } from '../../../../../services/genre/genre.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-genre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-genre.component.html',
  styleUrl: './new-genre.component.scss'
})
export class NewGenreComponent {
  genre: Genre = { genreId: 0, name: ''};

  constructor(private genreService: GenreService, private router: Router) {}

  onSubmit(): void {
      this.genreService.createGenre(this.genre).subscribe(() => {
        this.router.navigate(['/admin/listGenre']);  // Redirige al listado de directores después de crear uno nuevo
      });

  }

  cancel() {
    this.router.navigate(['/admin/listGenre']); // Reemplaza '/directores' con la ruta de tu lista
  }
}
