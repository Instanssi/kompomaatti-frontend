import EventView from './event';
import EventsView from './events';


export default [
    {
        path: '/events/:id',
        component: EventView,
    },
    {
        path: '/events',
        component: EventsView
    },
];
