import { animate, query, style, transition, trigger } from '@angular/animations';

import { MOTION_DISTANCE, MOTION_DURATION, motion } from './motion.config';

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
          motion(MOTION_DURATION.base),
          style({
            opacity: 0,
            transform: `translateY(${MOTION_DISTANCE.page}px)`
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
          transform: `translateY(${MOTION_DISTANCE.page}px)`
        }),
        animate(
          motion(MOTION_DURATION.base),
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
