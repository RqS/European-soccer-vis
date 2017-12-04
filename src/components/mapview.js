import React from 'react';
import { Jumbotron, Button } from 'reactstrap';

var Waypoint = require('react-waypoint');
var MapViewFlag = false;
export default class MapView extends React.Component {

  render() {
    return (
    <div>
      <Jumbotron id="mapviewtitle">
        <h1 className="display-3">Transfer Map</h1>
        <Waypoint onEnter={()=>{
          if (!MapViewFlag) {
            MapViewFlag = true;
            showMapView();
          }
        }}/>
        <p className="lead">The map shows transfer records based on transfer fee</p>
        <hr className="my-2" />
        <p className="lead">This section provides an overview of transfer market between 8 countries in selected year</p>
        <p className="lead">You can view total transfer fees between countries, compare the amount of money spent and earned based on color scale</p>
        <p className="lead">Follow the instruction to explore more</p>
        <div id="map" className = "mapview"></div>
      </Jumbotron>
    </div>
    );
  }
}