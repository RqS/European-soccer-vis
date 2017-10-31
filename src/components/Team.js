import React from 'react';
import { Jumbotron } from 'reactstrap';

const Team = (props) => {
  return (
    <div>
      <Jumbotron style = {{"marginBottom":"0px"}}>
        <h1 className="display-3">Meet the team!</h1>
        <p className="lead">We are a team of professionals</p>
      </Jumbotron>
    </div>
  );
};

export default Team;