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
        <h1 className="display-3">Current Market Value</h1>
        <p className="lead">This section indicates how much a team worth, spent on every position and every player now</p>
        <p className="lead">Donut chart provides information of total market value of each club</p>
        <p className="lead">Sunburst chart shows the current market value of each position and every player in the club</p>
        <hr className="my-2" />
        <p className="lead">Select interested country on dropdown list. Select and click your club on donut chart. Click sunburst for details</p>
        <div className = "twochart">
        <div id="CountryPieBar" className = "CountryPieBar">
          <svg id = "donut" width="600" height="500"></svg>
        </div>
        <div id="Sunburstchart" className = "CountryPieBar">
        </div>
        </div>
      </Jumbotron>
    </div>
    );
  }
}