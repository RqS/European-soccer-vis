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
        <p className="lead">Click radio to see detailed line chart of more specified position</p>
        <div id="age_price" className = "predictchart">
          <form>
            <label><input id="radio0" type="radio" name="position" value="general"/>General</label>
            <label><input id="radio1" type="radio" name="position" value="striker"/>Striker</label>
            <label><input id="radio2" type="radio" name="position" value="midfield"/>Midfield</label>
            <label><input id="radio3" type="radio" name="position" value="defence"/>Defence</label>
            <label><input id="radio4" type="radio" name="position" value="goalkeeper"/>Goalkeeper</label>
          </form>
        </div>
      </Jumbotron>
    </div>
    );
  }
}