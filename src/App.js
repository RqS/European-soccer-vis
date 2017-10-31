import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation.js';
import Landing from './components/Landing.js';
import Team from './components/Team.js';
import Member from './components/Member.js';


class App extends Component {
  render() {
    return (
      <div className="App">
       <Navigation/>
       <Landing/>
       <Team/>
       <Member/>
      </div>
    );
  }
}

export default App;
