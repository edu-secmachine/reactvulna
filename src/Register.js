import React, {Component} from 'react';
import Constants from './Constants';
import PubSub from 'pubsub-js';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      linkHref: '????'
    };
    this.formSubmitted = this.formSubmitted.bind(this);
  }

  formSubmitted(event) {
    event.preventDefault();
    const form = new FormData(document.getElementById('register-form'));

    let formBody = {};
    for (var pair of form.entries()) {
      var encodedKey = encodeURIComponent(pair[0]);
      var encodedValue = encodeURIComponent(pair[1]);
      formBody[encodedKey] = encodedValue;
    }
    fetch(Constants.backendRESTUrlBase + 'user', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formBody)
    }).then(function(response) {
      if (response.status === 200) {
        return response.json();
      } else {
        throw 42;
      }
    }).then(function(loginResponse) {
      console.log("creating the user was succesfull");
      this.props.router.push('/login')
    }.bind(this)).catch(function(reason) {
      alert("Try again!");
    });
  }

  render() {
    return (

      <div>
        <h1>Register</h1>
        <form action="" id="register-form" onSubmit={this.formSubmitted}>
          <div className="form-group">
            <label htmlFor="username">User name:</label>
            <input required="true" type="text" className="form-control" id="email" placeholder="Enter user name" name="name"/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input required="true" type="password" className="form-control" id="pwd" placeholder="Enter password" name="password"/>
          </div>
          <div className="form-group">
            <label htmlFor="emailAddress">Mail address:</label>
            <input type="text" className="form-control" id="emailAddress" placeholder="Enter mail address" name="emailAddress"/>
          </div>
          <div className="form-group">
            <label htmlFor="motto">Motto:</label>
            <input type="text" className="form-control" id="motto" placeholder="Enter your motto" name="motto"/>
          </div>
          <div className="form-group">
            <label htmlFor="webPageUrl">Your webpage:</label>
            <input type="text" className="form-control" id="webPageUrl" placeholder="Enter the address of your webpage" name="webPageUrl"/>
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
      </div>

    );
  }
}

export default Register;
