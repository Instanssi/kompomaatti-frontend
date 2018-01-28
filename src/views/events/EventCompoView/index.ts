import EventCompo from './EventCompo';
import CompoOverview from './CompoOverview';
import CompoEntry from './CompoEntry';

export default [
    {
        path: 'compos/:cid',
        component: EventCompo,
        children: [
            {
                path: '',
                component: CompoOverview,
            },
            {
                path: 'entries/:eid',
                component: CompoEntry,
            },
        ]
    },
];
