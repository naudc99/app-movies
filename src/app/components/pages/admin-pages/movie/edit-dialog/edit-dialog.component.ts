import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Movie } from '../../../../../interfaces/movie';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent {
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { movie: Movie}
  ) {
    // Establecer la vista previa inicial si está disponible
    if (data.movie.poster) {
      this.previewImage = `data:image/jpeg;base64,${data.movie.poster}`;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data.movie);
  }

  onPosterSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;  // Actualizar vista previa
        this.data.movie.poster = e.target.result.split(',')[1];  // Guardar en Base64
      };
      reader.readAsDataURL(file);
    }
  }
}
