import { animate, style, transition, trigger } from '@angular/animations';

export const drawerBackdropAnimation = trigger('drawerBackdropAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('180ms ease-out', style({ opacity: 1 }))
  ]),
  transition(':leave', [animate('160ms ease-in', style({ opacity: 0 }))])
]);

export const drawerSlideAnimation = trigger('drawerSlideAnimation', [
  transition(':enter', [
    style({ transform: 'translateX(42px)', opacity: 0 }),
    animate(
      '300ms cubic-bezier(0.2, 0.9, 0.2, 1)',
      style({ transform: 'translateX(0)', opacity: 1 })
    )
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ transform: 'translateX(30px)', opacity: 0 }))
  ])
]);

export const dropPulseAnimation = trigger('dropPulseAnimation', [
  transition(':enter', [
    style({ opacity: 0.26 }),
    animate('420ms ease-out', style({ opacity: 0 }))
  ])
]);
