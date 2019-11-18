import React, {Component} from 'react';
// component
import SearchForm from './searchForm'

class MainPage extends Component {
    render() {
        return (
            <div className="home-page">
                <div className="bg" />
                <SearchForm/>
            </div>
        )
    }
}

export default MainPage;