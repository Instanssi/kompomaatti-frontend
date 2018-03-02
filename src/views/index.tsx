// views/index.js
// This file configures the application's main routes/views.

// Import all the individual view components and export a vue-router configuration.
// Routing to a loader function is perfectly fine in Vue 2.

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import FrontPage from './FrontPage';
import EventsList from './EventsList';
import Event from './Event';


export default class Views extends React.Component<any> {
    render() {
        return (
            <Switch>
                <Route exact path="/events"><EventsList /></Route>
                <Route path="/:eventId"><Event /></Route>
                <Route><FrontPage /></Route>
            </Switch>
        );
    }
}
