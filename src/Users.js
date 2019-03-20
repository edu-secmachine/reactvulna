import React, {Component} from 'react';
import './App.css';
import $ from 'jquery'
import Constants from './Constants';
import Stomp from 'webstomp-client'
import SockJS from 'sockjs-client';
import SkyLight from 'react-skylight';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      text: "?",
      fade: false,
      showChatWindow: false,
      currentuserToChatWith: {}

    };
    this.messages = []
    this.getUsers = this.getUsers.bind(this);
    this.showContactDetails = this.showContactDetails.bind(this);
    this.chatTextEntered = this.chatTextEntered.bind(this);
    this.websocketMessageArrived = this.websocketMessageArrived.bind(this);
    this.scrollChatWindowDown = this.scrollChatWindowDown.bind(this);
    this.showProfile = this.showProfile.bind(this);
    this.getUsers();
  }
  componentDidMount() {
    console.log('componentDidMount started');
    var destination = '/user/queue/notifications';
    var socket = SockJS(Constants.backendUrlBase + 'stompwebsocket');
    var client = Stomp.over(socket);
    client.connect('asdf', 'were', function(frame) {
      console.log('Connected');
      client.subscribe(destination, this.websocketMessageArrived);
    }.bind(this));
  }
  componentWillUnmount() {
    console.log('componentWillUnmount started');
  }
  componentDidUpdate() {
    this.scrollChatWindowDown();
  }
  scrollChatWindowDown() {
    document.getElementById('chatPanel').scrollTop = document.getElementById('chatPanel').scrollHeight;
  }
  websocketMessageArrived(incoming) {
    var chatMessage = JSON.parse(incoming.body);
    console.log('Received: ', chatMessage);
    if (!this.state.showChatWindow || this.state.currentuserToChatWith.id !== chatMessage.author.id) {
      this.chatWith(chatMessage.author);
    } else {
      const p = document.createElement('p');
      p.setAttribute('class', 'chatPanelParagraph');
      p.innerHTML = '<span><i>' + chatMessage.author.name + '</i></span><span>:&nbsp;</span><span>' + chatMessage.message + '</span>'
      document.getElementById('chatPanel').appendChild(p);
      this.scrollChatWindowDown();
    }

  }
  showProfile(user) {
    const profileRendered = this.renderUserProfile(user);
    this.setState({userProfile: profileRendered});
    this.simpleDialog.show();
  }
  renderUserProfile(user) {
    return (
      <div className="container popupDiv">
        <table className="table">
          <tbody>
            <tr>
              <td><h3><span class="label label-default">Id</span></h3></td>
              <td><h3>{user.id}</h3></td>
            </tr>
            <tr>
              <td><h3><span class="label label-default">Name</span></h3></td>
              <td><h3>{user.name}</h3></td>
            </tr>
            <tr>
              <td><h3><span class="label label-default">E-mail</span></h3></td>
              <td><h3>{user.emailAddress}</h3></td>
            </tr>
            <tr>
              <td><h3><span class="label label-default">Motto</span></h3></td>
              <td><h3>{user.motto}</h3></td>
            </tr>
            <tr>
              <td><h3><span class="label label-default">Web-page</span></h3></td>
              <td><h3><a href={user.webPageUrl} target="_blank">Go to {user.name}s web page</a></h3></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  showContactDetails(user) {
    console.log(user.id);
    const buttonClicked = $('#' + user.id + 'showContact');
    buttonClicked.replaceWith(user.emailAddress);
  }
  chatWith(user) {
    console.log('wanna chat with:' + user.id);
    this.loadChatWindow(user);
    this.setState({showChatWindow: true, currentuserToChatWith: user});
  }
  loadChatWindow(user) {
    $('#chatPanel').children().empty();
    fetch(Constants.backendRESTUrlBase + 'messages/chat?otherUser=' + user.name, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache': 'no-cache'
      }
    }).then(function(response) {
      return response.json();
    }).then(function(messageList) {
      console.log(messageList);
      this.messages = messageList;
      const listItems = this.renderChatWindow();
      this.setState({messageListItems: listItems});
    }.bind(this));
  }
  chatTextEntered(event) {
    if (event.keyCode === 13) {
      console.log('Enter pressed');
      const textEntered = event.target.value;
      const loggedInUser = JSON.parse(window.localStorage.getItem('loggedInUser'));
      this.messages.push({
        message: textEntered,
        author: {
          name: loggedInUser.name
        }
      });
      const listItems = this.renderChatWindow();
      this.setState({messageListItems: listItems});
      $('input').val('');
      this.sendChatToBackend(textEntered, this.state.currentuserToChatWith.name);
    }
  }
  sendChatToBackend(text, addressee) {
    fetch(Constants.backendRESTUrlBase + 'messages/chat', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache': 'no-cache'
      },
      body: JSON.stringify({text: text, toUser: addressee})
    });
  }
  getUsers(event) {
    console.log('makeAjax startedd');
    fetch(Constants.backendRESTUrlBase + 'user', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache': 'no-cache'
      }
    }).then(function(response) {
      return response.json();
    }).then(function(userList) {
      console.log(userList);
      this.userList = userList;
      const listItems = this.showUsers();
      this.setState({listItems: listItems})
    }.bind(this));
  }
  showUsers() {
    return this.userList.map((user) => <tr key={user.id}>
      <td key={user.id + 1}>{user.name}</td>
      <td key={user.id + 2}>{user.sex}</td>
      <td key={user.id + 3}>
        <button id={user.id + 'chatWith'} onClick={() => this.chatWith(user)}>Chat with {user.name}</button>
      </td>
      <td key={user.id + 4}>
        <button id={user.id + 'showContact'} onClick={() => this.showContactDetails(user)}>Click to show contact</button>
      </td>
      <td key={user.id + 5}>
        <button id={user.id + 'showProfile'} onClick={() => this.showProfile(user)}>Click to show profile</button>
      </td>
    </tr>);
  }
  renderChatWindow() {
    return this.messages.map((message, index) => <p key={index + '_p'} className="chatPanelParagraph">
      <span key={index + '_user'}>
        <i>{message.author.name}</i>
      </span>
      <span>:&nbsp;</span>
      <span key={index + '_text'}>{message.message}</span>
    </p>);
  }
  render() {
    return (
      <div className="App">
        <h1>Users of the movie database</h1>
        <div className={this.state.showChatWindow
          ? 'col-sm-8'
          : 'col-sm-12'}>

          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <td>Name</td>
                <td>Sex</td>
                <td>Chat</td>
                <td>Other contacts</td>
                <td>Profile</td>
              </tr>

            </thead>
            <tbody>
              {this.state.listItems}
            </tbody>

          </table>
        </div>
        <div className={this.state.showChatWindow
          ? 'col-sm-4'
          : 'invisible'} id="chatWindow">
          <div className="form-group">

            <div className="panel panel-default chatPanel" id="chatPanel">
              {this.state.messageListItems}
            </div>
            <input onKeyUp={this.chatTextEntered} className="form-control" type="text"></input>
            <h3>{'Chat with: ' + this.state.currentuserToChatWith.name}</h3>
          </div>
        </div>
        <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title="User profile">
          {this.state.userProfile}
        </SkyLight>
      </div>
    );
  }
}

export default Users;
