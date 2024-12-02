import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Actor } from '../../../../../interfaces/actor';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent {
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { actor: Actor }
  ) { 
    // Establecer la vista previa inicial si está disponible
    if (data.actor.profile_photo) {
      this.previewImage = `data:image/jpeg;base64,${data.actor.profile_photo}`;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data.actor);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;  // Actualizar vista previa
        this.data.actor.profile_photo = e.target.result.split(',')[1];  // Guardar en Base64
      };
      reader.readAsDataURL(file);
    }
  }
}
