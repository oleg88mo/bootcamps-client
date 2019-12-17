import React from 'react';
// component
import SearchForm from './searchForm'

function MainPage(p) {
    return (
        <div className="home-page">
            <div className="bg"/>
            <SearchForm {...p}/>
        </div>
    )
}

export default MainPage;
