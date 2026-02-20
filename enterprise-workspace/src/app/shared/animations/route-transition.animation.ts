import { animate, query, style, transition, trigger } from '@angular/animations';

export const routeTransitionAnimation = trigger('routeTransition', [
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
          '180ms ease-out',
          style({
            opacity: 0,
            transform: 'translateY(10px)'
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
          transform: 'translateY(10px)'
        }),
        animate(
          '260ms cubic-bezier(0.2, 0, 0, 1)',
          style({
            opacity: 1,
            transform: 'translateY(0)'
          })
        )
      ],
      { optional: true }
    )
  ])
]);
