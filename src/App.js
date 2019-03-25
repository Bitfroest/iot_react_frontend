import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SensorList from './SensorList.js';
import SensorListMap from './SensorListMap.js';
import SensorTypeList from './SensorTypeList.js';
import Dashboard from './Dashboard.js';
import { Router, Route, NavLink, Redirect } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { ToastContainer } from 'react-toastify';

import 'bootstrap/dist/js/bootstrap.min.js';

import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabList: [
                { 'id': 1, 'component': <Dashboard></Dashboard>, 'name': 'Dashboard', 'url': '/dashboard', 'className' : 'active' },
                { 'id': 2, 'component': <SensorListMap></SensorListMap>, 'name': 'Map', 'url': '/map', 'className' : '' },
                { 'id': 3, 'component': <SensorList></SensorList>, 'name': 'Sensors', 'url': '/sensors', 'className' : '' },
                { 'id': 4, 'component': <SensorTypeList></SensorTypeList>, 'name': 'Type Definition', 'url': '/sensortypes', 'className' : '' },
            ],
            currentTab: 1,
            history: createBrowserHistory(),
        };
    }
    changeTab(tab){
        this.setState({ currentTab: tab.id });
    }
    render() {
        return (
        <Router history={this.state.history}>
            <div className="App">
                <ToastContainer />
                <Redirect from="/" to="dashboard" />
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                    <a className="navbar-brand" href="#">IOT</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                        <ul className="navbar-nav mr-auto">
                            {this.state.tabList.map(function(tab, index) {
                                return (
                                    <li className="nav-item" key={index}>
                                        <NavLink className="nav-link" activeClassName="active" to={tab.url} onClick={ (tab) => this.changeTab(tab) }>{tab.name}</NavLink>
                                    </li>
                                );
                            }.bind(this))}
                        </ul>
                    </div>
                </nav>

                {this.state.tabList.map(function(tab, index) {
                    return (
                        <Route key={index} path={tab.url} component={() => tab.component}/>
                    );
                }.bind(this))}
            </div>
        </Router>
        );
    }
}

export default App;
