import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation.js';
import Landing from './components/Landing.js';


class App extends Component {
  render() {
    return (
      <div className="App">
       <Navigation/>
       <Landing/>
      </div>
    );
  }
}

export default App;
