import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './slider.css'

export default class SimpleSlider extends Component {
  render() {
    const {imageURLs} = this.props;
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 2,
      centerMode: true,
      // centerPadding: "250px",
      swipe: true,
      swipeToSlide: true
    };
    return (
      <div>
      <Slider {...settings}>
        {imageURLs.map(imageSrc => 
          <div className="image">
            <img src={imageSrc}/>
          </div>
        )}
      </Slider>
    </div>
    );
  }
}