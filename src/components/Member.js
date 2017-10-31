import React from 'react';
import { Card, Button, CardImg, CardTitle, CardText, CardGroup, CardSubtitle, CardBody } from 'reactstrap';
import rqs from '../img/rqs.png';

const Member = (props) => {
  return (
    <CardGroup style = {{"marginTop":"-50px"}}>
      <Card>
        <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=256%C3%97180&w=256&h=180" alt="Card image cap" />
        <CardBody>
          <CardTitle>Jianfa Lin</CardTitle>
          <CardSubtitle>Soccer Expert</CardSubtitle>
          <CardText>Play left wing with both feet</CardText>
          <Button href="#">Button</Button>
        </CardBody>
      </Card>
      <Card>
        <CardImg top width="100%" src={rqs} alt="rqs" />
        <CardBody>
          <CardTitle>Runqi Shao</CardTitle>
          <CardSubtitle>Soccer Fan</CardSubtitle>
          <CardText>Kevin De Bruyne is top 3 attacking midfielder in the world</CardText>
          <Button href="#">Button</Button>
        </CardBody>
      </Card>
      <Card>
        <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=256%C3%97180&w=256&h=180" alt="Card image cap" />
        <CardBody>
          <CardTitle>Zihao Zhai</CardTitle>
          <CardSubtitle>Soccer Game Expert</CardSubtitle>
          <CardText>I do not talk to any Real Madrid</CardText>
          <Button href="#">Button</Button>
        </CardBody>
      </Card>
    </CardGroup>
  );
};

export default Member;