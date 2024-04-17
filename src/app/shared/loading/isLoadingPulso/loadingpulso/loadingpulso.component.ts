import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loadingpulso',


  templateUrl: './loadingpulso.component.html',
  styleUrl: './loadingpulso.component.css',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingpulsoComponent { }
