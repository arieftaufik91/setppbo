import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

export const Transition = [trigger('transition', [
    state(
        'inactive',
        style({
            transform: 'translate3d(0,0,0)',
            left: '-10px',
            opacity: 0,
            display: 'none',
        })
    ),
    state(
        'active',
        style({
            transform: 'translate3d(10px,0,0)',
            opacity: 1,
            display: 'block',
        })
    ),
    transition('inactive => active', animate('400ms ease-in')),
    transition('active => inactive', animate('400ms ease-out'))
])];

export const Rotation = [trigger('rotation', [
    state(
        'inactive',
        style({
            transform: 'rotate(0deg)'
        })
    ),
    state(
        'active',
        style({
            transform: 'rotate(360deg)'
        })
    ),
    transition('inactive => active', animate('600ms ease-in')),
    transition('active => inactive', animate('600ms ease-out'))
])];
