import React from 'react';
import { Jumbotron } from 'reactstrap';

const Team = (props) => {
  return (
    <div id = "Team">
      <Jumbotron style = {{"marginBottom":"0px", "background-color": "black", "margin-top": "-40px"}}>
        <h1 className="display-3" style = {{"color": "white"}}>Meet the <span style = {{"font-weight": "800"}}>team!</span></h1>
        <p className="lead" style = {{"color": "white"}}>We are a team of professionals</p>
      </Jumbotron>
    </div>
  );
};

export default Team;