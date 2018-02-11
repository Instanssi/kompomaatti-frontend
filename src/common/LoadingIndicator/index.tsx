import React from 'react';

import L from '../L';


export default () => (
    <span className="loading-indicator">
        <span className="fa fa-fw fa-spin" />&ensp;
        <L text="common.loading" />
    </span>
);
