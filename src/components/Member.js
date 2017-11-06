import React from 'react';
import { Card, Button, CardImg, CardTitle, CardText, CardGroup, CardSubtitle, CardBody } from 'reactstrap';

const Member = (props) => {
  return (
    <CardGroup style = {{"marginTop":"-40px"}}>
      <Card>
        <CardImg top width="100%" src='../../img/jfl.jpg' alt="Card image cap" />
        <CardBody>
          <CardTitle>Jianfa <span style = {{"fontWeight": "800", "fontSize": "xx-large", "color": "initial"}}>L</span>in</CardTitle>
          <CardSubtitle>Soccer Expert</CardSubtitle>
          <CardText>Play left wing with both feet</CardText>
          <Button href="#">Button</Button>
        </CardBody>
      </Card>
      <Card>
        <CardImg top width="100%" src='../../img/rqs.png' alt="rqs" />
        <CardBody>
          <CardTitle>Runqi <span style = {{"fontWeight": "800", "fontSize": "xx-large", "color": "initial"}}>S</span>hao</CardTitle>
          <CardSubtitle>Soccer Fan</CardSubtitle>
          <CardText>Kevin De Bruyne is top 3 attacking midfielder in the world</CardText>
          <Button href="#">Button</Button>
        </CardBody>
      </Card>
      <Card>
        <CardImg top width="100%" src='../../img/zhz.jpg' alt="Card image cap" />
        <CardBody>
          <CardTitle>Zihao <span style = {{"fontWeight": "800", "fontSize": "xx-large", "color": "initial"}}>Z</span>hai</CardTitle>
          <CardSubtitle>Soccer Game Expert</CardSubtitle>
          <CardText>I do not talk to any Real Madrid</CardText>
          <Button href="#">Button</Button>
        </CardBody>
      </Card>
    </CardGroup>
  );
};

export default Member;