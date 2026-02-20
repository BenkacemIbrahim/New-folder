import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const listFilterAnimation = trigger('listFilterAnimation', [
  transition('* => *', [
    query(
      ':leave',
      [
        stagger(
          35,
          animate(
            '170ms ease-in',
            style({
              opacity: 0,
              transform: 'translateY(-10px) scale(0.98)'
            })
          )
        )
      ],
      { optional: true }
    ),
    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'translateY(12px) scale(0.985)'
        }),
        stagger(
          55,
          animate(
            '250ms cubic-bezier(0.2, 0.9, 0.2, 1)',
            style({
              opacity: 1,
              transform: 'translateY(0) scale(1)'
            })
          )
        )
      ],
      { optional: true }
    )
  ])
]);

export const tabSwitchAnimation = trigger('tabSwitchAnimation', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          inset: 0,
          width: '100%'
        })
      ],
      { optional: true }
    ),
    query(
      ':leave',
      [
        animate(
          '190ms ease',
          style({
            opacity: 0,
            transform: 'translateX(-16px)'
          })
        )
      ],
      { optional: true }
    ),
    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'translateX(16px)'
        }),
        animate(
          '280ms cubic-bezier(0.2, 0, 0, 1)',
          style({
            opacity: 1,
            transform: 'translateX(0)'
          })
        )
      ],
      { optional: true }
    )
  ])
]);

export const modalBackdropAnimation = trigger('modalBackdropAnimation', [
  transition(':enter', [style({ opacity: 0 }), animate('220ms ease', style({ opacity: 1 }))]),
  transition(':leave', [animate('170ms ease', style({ opacity: 0 }))])
]);

export const modalPanelAnimation = trigger('modalPanelAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(18px) scale(0.96)' }),
    animate(
      '260ms cubic-bezier(0.2, 0.9, 0.2, 1)',
      style({ opacity: 1, transform: 'translateY(0) scale(1)' })
    )
  ]),
  transition(':leave', [
    animate('180ms ease-in', style({ opacity: 0, transform: 'translateY(12px) scale(0.98)' }))
  ])
]);

export const formErrorAnimation = trigger('formErrorAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-5px)' }),
    animate('180ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('130ms ease-in', style({ opacity: 0, transform: 'translateY(-5px)' }))
  ])
]);
