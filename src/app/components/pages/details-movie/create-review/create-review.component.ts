import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-review',
  standalone: true,
  imports: [MatFormFieldModule, MatIconModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-review.component.html',
  styleUrl: './create-review.component.scss'
})
export class CreateReviewComponent {
  reviewForm: FormGroup;
  ratings: number[] = Array.from({ length: 10 }, (_, i) => i + 1); // Crear un array del 1 al 10
  selectedRating: number = 0;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.reviewForm = this.fb.group({
      comment: ['', Validators.required],
      score: [null, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      // Establecer el puntaje seleccionado en el formulario
      this.reviewForm.patchValue({ score: this.selectedRating });
      this.dialogRef.close(this.reviewForm.value);
    }
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ score: rating }); // Actualizar el score en el formulario
  }

  isSelected(rating: number): boolean {
    return this.selectedRating >= rating;
  }
}
