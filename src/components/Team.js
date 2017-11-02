import React from 'react';
import { Jumbotron } from 'reactstrap';

const Team = (props) => {
  return (
    <div id = "Team">
      <Jumbotron style = {{"marginBottom":"0px", "backgroundColor": "black", "marginTop": "-40px"}}>
        <h1 className="display-3" style = {{"color": "white"}}>Meet the <span style = {{"fontWeight": "800"}}>team LS -Z!</span></h1>
        <p className="lead" style = {{"color": "white"}}>We are a team of professionals</p>
      </Jumbotron>
    </div>
  );
};

export default Team;