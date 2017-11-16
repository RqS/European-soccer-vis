import React from 'react';
import { Jumbotron, Button } from 'reactstrap';

var Waypoint = require('react-waypoint');
var PredictChartFlag = false;

export default class PredictChart extends React.Component {

  render() {
    return (
    <div>
      <Jumbotron id="predictcharttitle">
        <h1 className="display-3">Market Value Prediction</h1>
        <Waypoint onEnter={()=>{
          if (!PredictChartFlag) {
            PredictChartFlag = true;
            showPredictChart();
          }
        }}/>
        <p className="lead">Predict player market value with respect to age and position</p>
        <hr className="my-2" />
        <div id="age_price" className = "predictchart"></div>
      </Jumbotron>
    </div>
    );
  }
}