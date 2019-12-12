import React from 'react';
import {Redirect} from 'react-router-dom';
// component
import Dashboard from "../pages/dashboard";

export default function Protected({locale}) {
    const isLoggin = window.localStorage.getItem('bootcampAuthToken');

    return isLoggin !== null ? <Dashboard locale={locale}/> : <Redirect to="/login"/>
}
