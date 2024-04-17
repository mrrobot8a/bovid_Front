import { Component } from '@angular/core';
import { loadingIndicatorAnimations } from './loading-indicator.animations';

@Component({
  selector: 'app-loading-indicator',
  templateUrl: './isLoading.component.html',
  styleUrls: ['./isLoading.component.css'],
  animations: [loadingIndicatorAnimations]
})
export class LoadingIndicatorComponent {
  isLoading = true; // Variable para controlar la visibilidad del indicador de carga
}
