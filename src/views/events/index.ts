import EventsListView from './EventsListView';
import EventView from './EventView';
import EventOverview from './EventOverview';

import eventCompoRoutes from './EventCompoView';


// Routes for the event views.
export default [
    {
        path: '/events/:id',
        component: EventView,
        meta: { routeName: 'eventOverview' },
        children: [
            {
                path: '',
                component: EventOverview,
                name: 'eventOverview',
            },
            ...eventCompoRoutes,
        ]
    },
    {
        path: '/events',
        component: EventsListView,
        name: 'eventsListView',
    },
];
