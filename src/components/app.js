import React, { Component } from 'react';
import Navigation from './navigation';
import Landing from './landing'
import Team from './team';
import Member from './member';
import MapView from './mapview'



class App extends Component {

  render() {
    return (
      <div className="App">
       <Navigation/>
       <Landing/>
       <MapView/>
       <Team/>
       <Member/>
      </div>
    );
  }
}

export default App;

