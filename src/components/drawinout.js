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
        <h1 className="display-3">Transfer Information Bar chart</h1>
        <p className="lead">Show transfer fee for 8 countries with respect to time</p>
        <hr className="my-2" />
        <div id = "inandoutdiv">
        </div>
      </Jumbotron>
    </div>
    );
  }
}