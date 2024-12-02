import { Component } from '@angular/core';
import { Director } from '../../../../../interfaces/director';
import { DirectorService } from '../../../../../services/director/director.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-director',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-director.component.html',
  styleUrl: './new-director.component.scss'
})
export class NewDirectorComponent {
  director: Director = { directorId: 0, name: '', profile_photo: '' };
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;  // Para la vista previa de la imagen

  constructor(private directorService: DirectorService, private router: Router) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;  // Configurar la vista previa
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.director.profile_photo = (reader.result as string).split(',')[1];  // Convertir a Base64
        this.directorService.createDirector(this.director).subscribe(() => {
          this.router.navigate(['/admin/listDirector']);  // Redirige al listado de directores después de crear uno nuevo
        });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  cancel() {
    this.router.navigate(['/admin/listDirector']); // Reemplaza '/directores' con la ruta de tu lista
  }
}
