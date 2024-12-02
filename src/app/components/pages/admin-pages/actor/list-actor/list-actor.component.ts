import { Component, OnInit } from '@angular/core';
import { Actor } from '../../../../../interfaces/actor';
import { ActorService } from '../../../../../services/actor/actor.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-actor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-actor.component.html',
  styleUrl: './list-actor.component.scss'
})
export class ListActorComponent implements OnInit{
  actors: Actor[] = [];
  totalElements: number = 0;
  page: number = 0;
  size: number = 6;
  sortBy: string = 'name';
  totalPages: number = 0; // Para mantener el número total de páginas
  searchTerm: string = '';

  constructor(
    private actorService: ActorService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getActors();
  }

  getActors(searchTerm: string = ''): void {
    this.actorService.getAllActorsPaginated(this.page, this.size, this.sortBy, searchTerm).subscribe(data => {
      console.log('Respuesta completa del servidor:', data);
      this.actors = data.content;
      this.totalElements = data.totalElements;
      this.totalPages = data.totalPages; // Obtener el total de páginas
    });
  }
  
  onSearch(): void {
    this.page = 0; 
    this.getActors(this.searchTerm); 
  }
  

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.getActors(this.searchTerm); 
    }
  }

  addActor(): void {
    this.router.navigate(['/admin/newActor']); 
  }

  openEditDialog(actor: Actor): void {
    // Clonar el director para trabajar con una copia
    const actorCopy = { ...actor };

    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '400px',
      data: { actor: actorCopy }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizar el director original solo si se confirmaron los cambios
        this.actorService.updateActor(actor.actorId, result).subscribe(
          () => {
            this.getActors();
          },
          (error) => {
            console.error('Error updating actor:', error);
          }
        );
      }
    });
  }

  openDeleteDialog(actor: Actor): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '300px',
      data: { actor: actor }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actorService.deleteActor(actor.actorId).subscribe(
          () => {
            this.getActors();
          },
          (error) => {
            console.error('Error deleting actor:', error);
          }
        );
      }
    });
  }
}
