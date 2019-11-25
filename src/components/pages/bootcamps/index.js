import React from 'react';
// components
import Filter from './filter';
import List from './list';

function Bootcamps() {
    return (
        <div className="bootcamp-page">
            <Filter/>
            <List/>
        </div>
    );
}

export default Bootcamps;