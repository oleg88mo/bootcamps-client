import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Layout} from 'antd';

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
  return (
      <Router>
        <Layout>
          <Nav/>
          <Content style={{marginTop: 50}}>
            <div className="content-container">
              <Switch>
                <Route exact path="/" component={MainPage}/>
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
          <Footer>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Router>
  );
}

export default App;
