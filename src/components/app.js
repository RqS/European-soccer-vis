import React, { Component } from 'react';
import Navigation from './Navigation';
import Landing from './Landing'
import Team from './Team';
import Member from './Member';
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

