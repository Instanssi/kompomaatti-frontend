// views/index.js
// This file configures the application's main routes/views.

// Import all the individual view components and export a vue-router configuration.
// Routing to a loader function is perfectly fine in Vue 2.
import login from './login';
import frontpage from './frontpage';
import compos from './compos';
import events from './events';
import admin from './admin';

const routerViews = [
    ...frontpage,
    ...login,
    ...compos,
    ...events,
    ...admin
];

export default routerViews;