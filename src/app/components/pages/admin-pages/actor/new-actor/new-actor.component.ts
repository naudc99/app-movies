import { Component } from '@angular/core';
import { Actor } from '../../../../../interfaces/actor';
import { ActorService } from '../../../../../services/actor/actor.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-actor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './new-actor.component.html',
  styleUrl: './new-actor.component.scss'
})
export class NewActorComponent {
  actor: Actor = { actorId: 0, name: '', profile_photo: '' };
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;  // Para la vista previa de la imagen

  constructor(private actorService: ActorService, private router: Router) {}

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
        this.actor.profile_photo = (reader.result as string).split(',')[1];  // Convertir a Base64
        this.actorService.createActor(this.actor).subscribe(() => {
          this.router.navigate(['/admin/listActor']); 
        });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  cancel() {
    this.router.navigate(['/admin/listActor']); 
  }
}