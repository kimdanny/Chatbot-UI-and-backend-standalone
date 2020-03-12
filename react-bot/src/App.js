// react-bot/src/App.js

import React, { Component } from 'react';
import Pusher from 'pusher-js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userMessage: '',
      conversation: [],
    };
  }

  componentDidMount() {
    const pusher = new Pusher('82e12817b5d79798febe', {
      cluster: 'eu',
      encrypted: true,
    });

    const channel = pusher.subscribe('bot');
    channel.bind('bot-response', data => {
      const msg = {
        text: data.message,
        user: 'ai',
      };
      this.setState({
        conversation: [...this.state.conversation, msg],
      });
    });
  }

  handleChange = event => {
    this.setState({ userMessage: event.target.value });
  };

  handleSubmit = event => {
    // preventing a default browser reloading
    event.preventDefault();
    if (!this.state.userMessage.trim()) return;

    const msg = {
      text: this.state.userMessage,
      user: 'human',
    };

    this.setState({
      conversation: [...this.state.conversation, msg],
    });

    fetch('http://localhost:8080/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: this.state.userMessage,
      }),
    });

    this.setState({ userMessage: '' });
  };

  render() {
    const ChatBubble = (text, i, className) => {
      return (
        // key for react's internal id's
        <div key={`${className}-${i}`} className={`${className} chat-bubble`}>
          <span className="chat-content">{text}</span>
        </div>
      );
    };

    const chat = this.state.conversation.map((e, index) =>
      ChatBubble(e.text, index, e.user)
    );

    // var buttonNames = []
    // const ButtonBubble = (text, i, buttonNames) => {
    //   return (
    //          TODO: loop through buttonNames and get buttonName
    //     <div key={`${className}-${i}`} className={`${buttonName} button-bubble`}>
    //       <span className="button-content">{text}</span>
    //     </div>
    //   );
    // }

    // const buttons = buttonNames.forEach(
    //    // how do i loop js so weird
    // )

    return (
      <div>
        <h1>Compliance Expert, your friendly assistant</h1>
        <div className="chat-window">
          <div className="conversation-view">{chat}</div>
          <div className="message-box">
            <form onSubmit={this.handleSubmit}>
              <input
                value={this.state.userMessage}
                onInput={this.handleChange}
                className="text-input"
                type="text"
                autoFocus
                placeholder="Type your message and hit Enter to send"
              />
              <button type="button" className="send-button" onClick={this.handleSubmit}>Send</button>
            </form>
          </div>
        </div>
        <br></br>
      </div>
    );
  }
}

export default App;