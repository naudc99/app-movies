import { Component, OnInit } from '@angular/core';
import { Director } from '../../../../../interfaces/director';
import { DirectorService } from '../../../../../services/director/director.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-director',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './list-director.component.html',
  styleUrl: './list-director.component.scss'
})
export class ListDirectorComponent implements OnInit {
  directors: Director[] = [];
  totalElements: number = 0;
  page: number = 0;
  size: number = 6;
  sortBy: string = 'name';
  totalPages: number = 0; // Para mantener el número total de páginas
  searchTerm: string = '';

  constructor(
    private directorService: DirectorService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getDirectors();
  }

  getDirectors(searchTerm: string = ''): void {
    this.directorService.getAllDirectorsPaginated(this.page, this.size, this.sortBy, searchTerm).subscribe(data => {
      console.log('Respuesta completa del servidor:', data);
      this.directors = data.content;
      this.totalElements = data.totalElements;
      this.totalPages = data.totalPages; // Obtener el total de páginas
    });
  }
  

  onSearch(): void {
    this.page = 0; 
    this.getDirectors(this.searchTerm); 
  }
  

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.getDirectors(this.searchTerm); 
    }
  }

  addDirector(): void {
    this.router.navigate(['/admin/newDirector']); 
  }

  openEditDialog(director: Director): void {
    // Clonar el director para trabajar con una copia
    const directorCopy = { ...director };

    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '400px',
      data: { director: directorCopy }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizar el director original solo si se confirmaron los cambios
        this.directorService.updateDirector(director.directorId, result).subscribe(
          () => {
            this.getDirectors();
          },
          (error) => {
            console.error('Error updating director:', error);
          }
        );
      }
    });
  }

  openDeleteDialog(director: Director): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '300px',
      data: { director: director }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.directorService.deleteDirector(director.directorId).subscribe(
          () => {
            this.getDirectors();
          },
          (error) => {
            console.error('Error deleting director:', error);
          }
        );
      }
    });
  }
}
