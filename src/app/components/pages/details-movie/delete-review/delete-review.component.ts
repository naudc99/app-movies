import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Review } from '../../../../interfaces/review';

@Component({
  selector: 'app-delete-review',
  standalone: true,
  imports: [],
  templateUrl: './delete-review.component.html',
  styleUrl: './delete-review.component.scss'
})
export class DeleteReviewComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { review: Review }
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    this.dialogRef.close(true); 
  }
}
