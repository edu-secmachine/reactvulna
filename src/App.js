import React, {Component} from 'react';
import './App.css';
import {Link} from 'react-router';
import MyLink from './utils/MyLink'
import PubSub from 'pubsub-js';
import Constants from './Constants';

class App extends Component {

  constructor(props) {
    super(props);
    this.handleSuccesfullLogin = this.handleSuccesfullLogin.bind(this);
    this.logoutClicked = this.logoutClicked.bind(this);
    const logged = window.localStorage.getItem('loggedIn');
    let boolLogged = false;
    if(logged === 'true'){
      boolLogged = true;
    }
    console.log('isloggedIn: ' + boolLogged);
    this.state = {
      loggedIn: boolLogged,
      currentUser: window.localStorage.getItem('loggedInUser')
    };
  }

  componentDidMount(){
    console.log('componentDidMount');
    PubSub.subscribe('LOGIN_TOPIC', this.handleSuccesfullLogin);

  }

  handleSuccesfullLogin(msg, user){
      this.setState({loggedIn: true, currentUser: user});
  }

  logoutClicked(){
    this.setState({loggedIn: false, currentUser: null});
    window.localStorage.setItem('loggedIn', false);
    window.localStorage.setItem('loggedInUser', null);
    fetch(Constants.backendUrlBase + 'logout', {
      method: 'GET',
      credentials: 'include'
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <Link className="navbar-brand" to="/movies">SoCinema</Link>
            </div>
            <ul className="nav navbar-nav">
              <li>
                <MyLink to="/movies" >Movies</MyLink>
              </li>
              <li>
                <MyLink to="/register" rendered={!this.state.loggedIn}>Register</MyLink>
              </li>
              <li>
                <MyLink to="/users" rendered={this.state.loggedIn}>Users</MyLink>
              </li>
              <li>
                <MyLink to="/messages" rendered={this.state.loggedIn}>Messages</MyLink>
              </li>
               <li>
                <MyLink to="/profile" rendered={this.state.loggedIn}>My Profile</MyLink>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              {this.state.loggedIn && <li><span className="navbar-text">Hello  {this.state.currentUser.name}</span></li>}
              <li>
                <MyLink to="/login" rendered={!this.state.loggedIn}>Login</MyLink>
                <MyLink to="/login" onClick={this.logoutClicked} rendered={this.state.loggedIn}>Logout</MyLink>
              </li>
            </ul>
          </div>
        </nav>
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
