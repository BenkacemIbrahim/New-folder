import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const authPageAnimation = trigger('authPageAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('420ms cubic-bezier(0.22, 0.61, 0.36, 1)', style({ opacity: 1, transform: 'none' }))
  ])
]);

export const staggerTextAnimation = trigger('staggerTextAnimation', [
  transition(':enter', [
    query(
      '.reveal-item',
      [
        style({ opacity: 0, transform: 'translateY(16px)', filter: 'blur(3px)' }),
        stagger(
          85,
          animate(
            '520ms cubic-bezier(0.16, 1, 0.3, 1)',
            style({ opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' })
          )
        )
      ],
      { optional: true }
    )
  ])
]);

export const fieldErrorAnimation = trigger('fieldErrorAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-4px)' }),
    animate('180ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [animate('140ms ease-in', style({ opacity: 0, transform: 'translateY(-4px)' }))])
]);

export const modalBackdropAnimation = trigger('modalBackdropAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('220ms ease', style({ opacity: 1 }))
  ]),
  transition(':leave', [animate('180ms ease', style({ opacity: 0 }))])
]);

export const modalPanelAnimation = trigger('modalPanelAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(18px) scale(0.96)' }),
    animate(
      '260ms cubic-bezier(0.16, 1, 0.3, 1)',
      style({ opacity: 1, transform: 'translateY(0) scale(1)' })
    )
  ]),
  transition(':leave', [
    animate('180ms ease-in', style({ opacity: 0, transform: 'translateY(12px) scale(0.98)' }))
  ])
]);
