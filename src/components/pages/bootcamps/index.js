import React from 'react';
// components
import Filter from './filter';
import List from './list';

function Bootcamps(p) {
    return (
        <div className="bootcamp-page">
            <Filter {...p}/>
            <List {...p}/>
        </div>
    );
}

export default Bootcamps;