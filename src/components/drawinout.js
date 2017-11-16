import React from 'react';
import { Jumbotron, Button } from 'reactstrap';

export default class Inandout extends React.Component {

  componentDidMount() {
    showTotalTransferInAndOutValue("17/18");
  }


  render() {

    return (
    <div>
      <Jumbotron id="inandouttitle">
        <h1 className="display-3">Detailed Market Value</h1>
        <p className="lead">Show total market value for every club in selected league</p>
        <hr className="my-2" />
        <p className="lead">Click club to see detailed players market values of the club</p>
        <div id = "inandoutdiv">
        </div>
      </Jumbotron>
    </div>
    );
  }
}