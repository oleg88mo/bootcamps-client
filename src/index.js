import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, withRouter} from 'react-router-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
// rootReducer
import reducers from "./redux/reducers";
// rootComponent
import App from './App'

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));
const RootWithAuth = withRouter(App);

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootWithAuth/>
        </Router>
    </Provider>, document.getElementById('root')
);

if(module.hot) {
    module.hot.accept();
}
