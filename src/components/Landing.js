import React, { Component } from 'react';
import { Button } from 'reactstrap';


import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';

var scrollToElement = require('scroll-to-element');

const items = [
  {
    src: '../../img/landing.jpg',
    altText: 'European Soccer Transfer Market Visulization and Analysis',
    caption: 'Powered by Team LS -Z'
  },
  {
    src: '../../img/landing1.jpg',
    altText: 'SOME FUN FACTS',
    caption: '______________❤______________'
  }
];

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;

    const slides = items.map((item, index) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.src}
          src={item.src}
          altText={item.altText}
        >
          <CarouselCaption captionText={item.caption} captionHeader={item.altText}/>
          {index===1?<img className = "inforimg" src = '../../img/infor.png' alt = ""/>:""}
          {index===1?<Button className = "start_button" color="primary" size="lg" onClick={()=>{
            scrollToElement('#mapviewtitle', {offset: 50, duration: 800});
          }}>Get Start</Button>:""}
        </CarouselItem>
      );
    });
 
    return (
      <div className = "carouselWrapper">
      <Carousel
        activeIndex={activeIndex}
        next={this.next}
        previous={this.previous}
      >
        <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
        {slides}
        <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
        <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
      </Carousel>
      </div>
    );
  }
}

export default Landing;
