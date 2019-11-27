import React from 'react';
import {Redirect} from 'react-router-dom';
import Dashboard from "../pages/dashboard";

export default function Protected() {
    const isLoggin = window.localStorage.getItem('bootcampAuthToken');

    return isLoggin !== null ? <Dashboard/> : <Redirect to="/login"/>
}
