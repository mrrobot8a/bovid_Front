import { style } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alert-filter',
  standalone: true,

  imports: [
    CommonModule,
  ],
  templateUrl: './AlertFilter.component.html',
  styleUrl : './AlertFilter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertFilterComponent implements OnInit {

  ngOnInit(): void {
    console.log('AlertFilterComponent');
    this.restartAnimations();
  }

  restartAnimations() {
    setTimeout(() => {
      (document.querySelectorAll('.loading-animation, .analyzing-animation, .searching-animation') as NodeListOf<HTMLElement>).forEach((element: HTMLElement) => {
        element.style.animation = 'none';
        element.offsetHeight; /* Trigger reflow */
        element.style.animation = '';
      });
      this.restartAnimations();
    }, 10500);
  }
}
