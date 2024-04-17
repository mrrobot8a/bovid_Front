import { trigger, transition, style, animate } from '@angular/animations';

export const globalAnimation = trigger('globalAnimation', [
  transition('* <=> *', [
    style({ opacity: 0 }),
    animate('300ms ease', style({ opacity: 1 })),
  ]),
]);
