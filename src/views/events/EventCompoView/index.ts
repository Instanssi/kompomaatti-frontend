import EventCompo from './EventCompo';
import CompoOverview from './CompoOverview';
import CompoEntry from './CompoEntry';

export default [
    {
        path: 'compos/:cid',
        component: EventCompo,
        meta: { routeName: 'compoOverview' },
        children: [
            {
                path: '',
                component: CompoOverview,
                name: 'compoOverview'
            },
            {
                path: 'entries/:eid',
                component: CompoEntry,
                name: 'compoEntry'
            },
        ]
    },
];
