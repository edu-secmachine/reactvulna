import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Users from './Users';
import Movies from './Movies';
import Profile from './Profile';
import Messages from './Messages';
import Login from './Login';
import Register from './Register';
import registerServiceWorker from './registerServiceWorker';
import { Router, Route, browserHistory, IndexRoute  } from 'react-router';

ReactDOM.render((
   <Router history = {browserHistory}>
      <Route path = "/" component = {App}>
         <IndexRoute component = {Movies} />
         <Route path = "movies" component = {Movies} />
         <Route path = "users" component = {Users} />
         <Route path = "profile" component = {Profile} />
         <Route path = "messages" component = {Messages} />
         <Route path = "login" component = {Login} />
         <Route path = "register" component = {Register} />
      </Route>
   </Router>), document.getElementById('root'));
// ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
