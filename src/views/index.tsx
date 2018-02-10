// views/index.js
// This file configures the application's main routes/views.

// Import all the individual view components and export a vue-router configuration.
// Routing to a loader function is perfectly fine in Vue 2.

import Vue from 'vue';
import Component from 'vue-class-component';
import { MatchFirst, Route } from 'vue-component-router';

import FrontPage from './Frontpage';
import EventsList from './EventsList';
import Event from './Event';


@Component
export default class Views extends Vue {
    render(h) {
        return (
            <MatchFirst>
                <Route path="/kompomaatti/events/:eventId"><Event /></Route>
                <Route path="/kompomaatti/events"><EventsList /></Route>
                <Route path="/kompomaatti"><FrontPage /></Route>
            </MatchFirst>
        );
    }
}