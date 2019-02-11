import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { API_URL } from './constants';

class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
  };
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }
  login() {
    this.props.auth.login();
  }

  callApi = async () => {
    const response = await fetch(`${API_URL}/api/hello`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/api/world`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  };
  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <button
          id="qsLoginBtn"
          bsStyle="primary"
          className="btn-margin"
          onClick={this.login.bind(this)}
        >
          Log In
        </button>

        {
          !isAuthenticated() && (
            <p>
              <strong>Not auth</strong>
            </p>
            )
        }
        {
          isAuthenticated() && (
            <p>
              <strong>Is auth</strong>
            </p>
            )
        }

        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>
      </div>
    );
  }
}

export default App;
