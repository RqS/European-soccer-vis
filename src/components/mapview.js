import React from 'react';
import { Jumbotron, Button } from 'reactstrap';

var Waypoint = require('react-waypoint');
var MapViewFlag = false;
export default class MapView extends React.Component {

  render() {
    return (
    <div>
      <Jumbotron id="mapviewtitle">
        <h1 className="display-3">Transfer Map Overview</h1>
        <Waypoint onEnter={()=>{
          if (!MapViewFlag) {
            MapViewFlag = true;
            showMapView();
          }
        }}/>
        <p className="lead">View transfers between 8 countries with your selected year</p>
        <hr className="my-2" />
        <div id="map" className = "mapview"></div>
      </Jumbotron>
    </div>
    );
  }
}