import React, { Component } from 'react';
import './App.css';

class SendButton extends Component{
  render(){
    return (<div className="send_message" onClick={this.props.handleClick}>
      <div className="text">send</div>
    </div>);
  }
}

class SetUsername extends Component{
  render(){
    return(
      <div className="message_input_wrapper">
        <input id="username_input" className="username_input message_input" placeholder="Please enter a username (15 characters max)" maxLength="15" value={this.props.username} onChange={this.props.onChange} onKeyPress={this.props._handleKeyPress}/>
      </div>
    );
  }
}

class MessageTextBoxContainer extends Component{
  render(){
    return(
      <div className="message_input_wrapper">
        <input id="msg_input" className="message_input" placeholder="Type your messages here..." value={this.props.message} onChange={this.props.onChange} onKeyPress={this.props._handleKeyPress}/>
      </div>
    );
  }
}

class Avatar extends Component {
  render(){
    return(
      <div className="avatar"><p className="username">{this.props.username}</p></div>
    );
  }
}

class BotMessageBox extends Component{
  constructor(props) {
    super(props);
  }
  render(){
    return(
      <li className="message left appeared">
        <Avatar></Avatar>
        <div className="text_wrapper">
            <div className="text">{this.props.message}</div>
        </div>
      </li>
    );
  }
}

class UserMessageBox extends Component{
  constructor(props) {
    super(props);

  }
  render(){
    return(
      <li className={`message ${this.props.appearance} appeared`}>
        <Avatar></Avatar>
        <div className="text_wrapper">
            <div className="text">{this.props.message}</div>
        </div>
      </li>
    );
  }
}

class MessagesContainer extends Component{
  constructor(props) {
    super(props);
    this.createBotMessages = this.createBotMessages.bind(this);
  }

  scrollToBottom = () => {
    var el = this.refs.scroll;
    el.scrollTop = el.scrollHeight;
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  createBotMessages(){
    console.log(this.props.messages);
    return this.props.messages.map((message, index) =>
       <UserMessageBox key={index} message={message["message"]} appearance={message["isbotmessage"] ? "left": "right"}/>
    );
  }

  render(){

    return(
      <ul className="messages" ref="scroll">
        {this.createBotMessages()}
      </ul>
    );
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {"messages": [], "current_message":"", "username":"", "usernames": []};
    this.handleClick = this.handleClick.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeUser = this.onChangeUser.bind(this);
    this.addMessageBox = this.addMessageBox.bind(this);
  }

  addMessageBox(enter=true){
    let messages = this.state.messages;
    let usernames = this.state.usernames;
    let username = this.state.username;
    let current_message = this.state.current_message;
    console.log(this.state);
    if(current_message && enter){
      messages = [...messages, {"message":current_message}];
      fetch("http://localhost:3000?message=" + current_message + "&username=" + username)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          this.setState({
            messages: [...messages, {"message":result["message"], "username":result["username"], "isbotmessage":true}]
          });
        },
        (error) => {
          //do nothing for now
        }
      );
      current_message = ""
    }  
    this.setState({
      current_message: current_message,
      username: username,
      messages,
      usernames
    });

  }

  handleClick(){
    this.addMessageBox();
  }

  onChange(e) {
    this.setState({
      current_message: e.target.value
    });  
  }

  onChangeUser(e) {
    this.setState({
      username: e.target.value
    });  
  }

    _handleKeyPress(e) {
    let enter_pressed = false;
    if(e.key === "Enter"){
      enter_pressed = true;
    }
    this.addMessageBox(enter_pressed)
  }

  render() {
    return (
      <div className="chat_window">
        <MessagesContainer messages={this.state.messages} username={this.state.username}></MessagesContainer>
        <div className="bottom_wrapper clearfix">

          {(!this.state.username) ? <SetUsername _handleKeyPress={this._handleKeyPress} onChange={this.onChangeUser} username={this.state.username}></SetUsername> : <MessageTextBoxContainer _handleKeyPress={this._handleKeyPress} onChange={this.onChange} message={this.state.current_message}></MessageTextBoxContainer>}
          
          <SendButton handleClick={this.handleClick}></SendButton>
        </div>
        <p>Username: {this.state.username}</p>
      </div>
    );
  }
}

export default App;
