import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Review } from '../../../../interfaces/review';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-review',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatIcon, CommonModule],
  templateUrl: './edit-review.component.html',
  styleUrl: './edit-review.component.scss'
})
export class EditReviewComponent {
  reviewForm: FormGroup;
  ratings: number[] = Array.from({ length: 10 }, (_, i) => i + 1); // Crear un array del 1 al 10
  selectedRating: number = 0; // Puntuación seleccionada inicial

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { review: { comment: string; score: number } } // Ajusta según tu modelo de datos
  ) {
    // Inicializa el formulario con los valores de la reseña existente
    this.reviewForm = this.fb.group({
      comment: [data.review.comment, Validators.required], // Rellena con el comentario existente
      score: [data.review.score, [Validators.required, Validators.min(1), Validators.max(10)]] // Rellena con la puntuación existente
    });
    this.selectedRating = data.review.score; // Establece la puntuación seleccionada inicial
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      this.dialogRef.close(this.reviewForm.value); // Devuelve el valor del formulario
    }
  }

  setRating(rating: number): void {
    this.selectedRating = rating; // Establece la puntuación seleccionada
    this.reviewForm.patchValue({ score: rating }); // Actualiza el score en el formulario
  }

  isSelected(rating: number): boolean {
    return this.selectedRating >= rating; // Comprueba si la puntuación es mayor o igual a la estrella
  }
}
