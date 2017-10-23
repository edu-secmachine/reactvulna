import React, {Component} from 'react';
import Constants from './Constants';
import PubSub from 'pubsub-js';

class Login extends Component {

  constructor(props) {
    super(props);
    this.formSubmitted = this.formSubmitted.bind(this);
    this.postLogin = this.postLogin.bind(this);
  }

  formSubmitted(event) {
    event.preventDefault();
    this.postLogin();

  }

  postLogin(event) {
    console.log('postLogin startedd');
    const form = new FormData(document.getElementById('login-form'));

    let formBody = [];
    for (var pair of form.entries()) {
      var encodedKey = encodeURIComponent(pair[0]);
      var encodedValue = encodeURIComponent(pair[1]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    fetch(Constants.backendUrlBase + 'login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    }).then(function(response) {
      if (response.status === 200) {
        return response.json();
      } else {
        throw 42;
      }
    }).then(function(loginResponse) {
      console.log("login succesfull");
      window.localStorage.setItem('loggedIn', true);
      window.localStorage.setItem('loggedInUser', JSON.stringify(loginResponse));
      PubSub.publish( 'LOGIN_TOPIC', loginResponse);
      this.props.router.push('/')
    }.bind(this)).catch(function(reason) {
      alert("Try again!");
    });
  }

  render() {
    return (
      <form action="" id="login-form" onSubmit={this.formSubmitted}>
        <div className="form-group">
          <label htmlFor="username">User name:</label>
          <input type="text" className="form-control" id="email" placeholder="Enter user name" name="username"/>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" className="form-control" id="pwd" placeholder="Enter password" name="password"/>
        </div>
        <button type="submit" className="btn btn-default">Submit</button>
      </form>

    );
  }
}

export default Login;
