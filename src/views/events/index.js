import EventView from './event';
import EventsView from './events';
import EventOverview from './event-overview';
import EventCompoView from './event-compo';

export default [
    {
        path: '/events/:id',
        component: EventView,
        children: [
            {
                path: '',
                component: EventOverview
            },
            {
                path: 'compos/:cid',
                component: EventCompoView,
            }
        ]
    },
    {
        path: '/events',
        component: EventsView
    },
];
