import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {useSelector} from 'react-redux';
import {Layout} from 'antd';
import Locale from './locales';
// styles
import 'antd/dist/antd.css';
import './index.css';
// components
import MainPage from "./components/pages/home";
import Login from './components/pages/login';
import Register from './components/pages/register';
import Bootcamps from "./components/pages/bootcamps";
import SingleBootcamp from "./components/pages/bootcamps/single-bootcamp";
import ReviewsSingleBootcamp from "./components/pages/bootcamps/reviews-single-bootcamp";
import Contacts from "./components/pages/contacts";
import Nav from "./components/nav";
import Protected from './components/protected';
import PageNotFound from './components/pages/404';

const {Content, Footer} = Layout;

function App() {
    const bootcampPageStorage = window.localStorage.getItem('bootcampPage');
    const bootcampPageRedux = useSelector(state => state.Users.bootcampPage);
    const bootcampPage = bootcampPageStorage ? bootcampPageStorage : bootcampPageRedux;

    const lang = useSelector(state => state.Users.lang);
    const locale = Object.keys(Locale.Locales).map(l => l === lang ? l : null).filter(f => f !== null);

    return (
        <Router>
            <Layout>
                <Nav locale={Locale.Locales[locale]} bootcampPage={bootcampPage}/>
                <Content style={{marginTop: 50}}>
                    <div className="content-container">
                        <Switch>
                            <Route exact path="/" component={() => <MainPage locale={Locale.Locales[locale]}/>}/>
                            <Route exact path="/bootcamps" component={Bootcamps}/>
                            <Route exact path="/bootcamps/:slug" component={SingleBootcamp}/>
                            <Route exact path="/bootcamps/:slug/reviews" component={ReviewsSingleBootcamp}/>
                            <Route path="/contacts" component={Contacts}/>
                            <Route path="/login" component={Login}/>
                            <Route path="/register" component={Register}/>

                            <Protected exact path="/dashboard"/>
                            <Route component={PageNotFound}/>
                        </Switch>
                    </div>
                </Content>
                <Footer>{Locale.Locales[locale].footer_created} &copy; {Locale.Locales[locale].footer_dev}</Footer>
            </Layout>
        </Router>
    );
}

export default App;
