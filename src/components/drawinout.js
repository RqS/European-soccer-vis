import React from 'react';
import { Jumbotron, Button } from 'reactstrap';

export default class Inandout extends React.Component {

  componentDidMount() {
    showTotalTransferInAndOutValue("total");
  }


  render() {

    return (
    <div>
      <Jumbotron id="inandouttitle">
        <h1 className="display-3">Transfer Fee Changes</h1>
        <p className="lead">This section provides information about total transfer fee changes, provides features for comparing among countries and within country</p>
        <hr className="my-2" />
        <p className="lead">Show transfer fee from 09/10 to 17/18 season</p>
        <p className="lead">Click Legend or bar to see details, click again to return</p>
        <div id = "scaleButtons"></div>
        <div id = "inandoutdiv">
        </div>
        
      </Jumbotron>
    </div>
    );
  }
}