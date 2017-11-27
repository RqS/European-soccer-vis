import React from 'react';
import { Jumbotron, Button } from 'reactstrap';

export default class CountryPieBar extends React.Component {

  componentDidMount() {
    showCountryPie("England", false);
    // showSunburst("England", "Arsenal FC");
  }


  render() {

    return (
    <div>
      <Jumbotron id="CountryPieBartitle">
        <h1 className="display-3">Detailed Market Value</h1>
        <p className="lead">Show total market value for every club in selected league and more detailed value about players for a selected club</p>
        <hr className="my-2" />
        <div className = "twochart">
        <div id="CountryPieBar" className = "CountryPieBar">
          <svg id = "donut" width="670" height="500"></svg>
        </div>
        <div id="Sunburstchart" className = "CountryPieBar">
        </div>
        </div>
      </Jumbotron>
    </div>
    );
  }
}