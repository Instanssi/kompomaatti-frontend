// views/index.js
// This file configures the application's main routes/views.

// Import all the individual view components and export a vue-router configuration.
// Routing to a loader function is perfectly fine in Vue 2.
import frontpage from './frontpage';
import compos from './compos';
import events from './events';

const routerViews = [
    ...frontpage,
    ...compos,
    ...events,
];

export default routerViews;