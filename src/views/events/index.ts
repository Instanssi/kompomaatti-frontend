import EventView from './EventView';
import EventsView from './EventsView';
import EventOverview from './EventOverview';
import EventCompoView from './EventCompoView';

// Routes for the event views.
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
