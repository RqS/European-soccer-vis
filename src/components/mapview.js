import React from 'react';
import { Jumbotron, Button } from 'reactstrap';

export default class MapView extends React.Component {

  componentDidMount() {
    showMapView();
  }

  render() {
    return (
    <div>
      <Jumbotron id="mapviewtitle">
        <h1 className="display-3">Transfer Records Overview</h1>
        <p className="lead">View all transfers with your selected year</p>
        <hr className="my-2" />
        <div id="map" className = "mapview"></div>
      </Jumbotron>
    </div>
    );
  }
}