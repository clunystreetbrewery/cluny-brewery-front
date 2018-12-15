import React, { Component } from 'react';
import GlobalStyle from './GlobalStyle';
// import axios from 'axios';

import TEMP from './data.js';

class App extends Component {
  state = {
    temperatures: {},
  };

  componentDidMount = () => {
    // const url =
    //   'https://cors-anywhere.herokuapp.com/http://benoitprost.synology.me:5031/temperatures';
    // axios.get(url).then(res => {
    //   const temperatures = res.data;
    //   this.setState({ temperatures });
    // });

    const temperatures = TEMP;
    this.setState({ temperatures });
  };

  render() {
    return (
      <div className="App">
        <GlobalStyle />
        <header className="App-header">
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
      </div>
    );
  }
}

export default App;
