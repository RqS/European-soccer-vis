import React, { Component } from 'react';
import Navigation from './navigation';
import Landing from './landing'
import Team from './team';
import Member from './member';
import MapView from './mapview'
import PredictChart from './PredictChart'
import CountryPieBar from './countrypiebar'
import Inandout from './drawinout'

class App extends Component {

  render() {
    return (
      <div className="App">
       <Navigation/>
       <Landing/>
       <MapView/>
       <Inandout/>
       <CountryPieBar/>
       <PredictChart/>
       <Team/>
       <Member/>
      </div>
    );
  }
}

export default App;

