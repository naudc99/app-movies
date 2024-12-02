import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Genre } from '../../../../../interfaces/genre';
import { GenreService } from '../../../../../services/genre/genre.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-genre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-genre.component.html',
  styleUrl: './list-genre.component.scss'
})
export class ListGenreComponent implements OnInit{
  genres: Genre[] = [];
  totalElements: number = 0;
  page: number = 0;
  size: number = 5;
  sortBy: string = 'name';
  totalPages: number = 0; 
  searchTerm: string = '';

  constructor(
    private genreService: GenreService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getGenres();
  }

  getGenres(searchTerm: string = ''): void {
    this.genreService.getAllGenresPaginated(this.page, this.size, this.sortBy, searchTerm).subscribe(data => {
      this.genres = data.content;
      this.totalElements = data.totalElements;
      this.totalPages = data.totalPages;
    });
  }

  onSearch(): void {
    this.page = 0; 
    this.getGenres(this.searchTerm); 
  }
  

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.getGenres(this.searchTerm); 
    }
  }

  addGenre(): void {
    this.router.navigate(['/admin/newGenre']); 
  }

  openEditDialog(genre: Genre): void {
    const genreCopy = { ...genre };
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '400px',
      data: { genre: genreCopy }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.genreService.updateGenre(genre.genreId, result).subscribe(
          () => {
            this.getGenres();
          },
          (error) => {
            console.error('Error updating genre:', error);
          }
        );
      }
    });
  }

  openDeleteDialog(genre: Genre): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '300px',
      data: { genre: genre }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.genreService.deleteGenre(genre.genreId).subscribe(
          () => {
            this.getGenres();
          },
          (error) => {
            console.error('Error deleting movie:', error);
          }
        );
      }
    });
  }
}
