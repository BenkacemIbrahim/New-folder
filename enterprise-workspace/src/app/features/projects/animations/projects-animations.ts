import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

import { MOTION_DISTANCE, MOTION_DURATION, motion } from '../../../shared/animations/motion.config';

export const listFilterAnimation = trigger('listFilterAnimation', [
  transition('* => *', [
    query(
      ':leave',
      [
        stagger(
          24,
          animate(
            motion(MOTION_DURATION.fast),
            style({
              opacity: 0,
              transform: `translateY(-${MOTION_DISTANCE.page}px)`
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
          transform: `translateY(${MOTION_DISTANCE.reveal}px)`
        }),
        stagger(
          30,
          animate(
            motion(MOTION_DURATION.base),
            style({
              opacity: 1,
              transform: 'translateY(0)'
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
          motion(MOTION_DURATION.base),
          style({
            opacity: 0,
            transform: `translateY(-${MOTION_DISTANCE.page}px)`
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

export const modalBackdropAnimation = trigger('modalBackdropAnimation', [
  transition(':enter', [style({ opacity: 0 }), animate(motion(MOTION_DURATION.modal), style({ opacity: 1 }))]),
  transition(':leave', [animate(motion(MOTION_DURATION.modal), style({ opacity: 0 }))])
]);

export const modalPanelAnimation = trigger('modalPanelAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.98)' }),
    animate(
      motion(MOTION_DURATION.modal),
      style({ opacity: 1, transform: 'scale(1)' })
    )
  ]),
  transition(':leave', [
    animate(motion(MOTION_DURATION.modal), style({ opacity: 0, transform: 'scale(0.98)' }))
  ])
]);

export const formErrorAnimation = trigger('formErrorAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-6px)' }),
    animate(motion(MOTION_DURATION.fast), style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate(motion(MOTION_DURATION.fast), style({ opacity: 0, transform: 'translateY(-6px)' }))
  ])
]);
