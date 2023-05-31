import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './slider.css';

interface ImageData {
    id: string;
    link: string;
    withBtn: boolean;
}

interface SimpleSliderProps {
    imageURLs: ImageData[];
}

export default class SimpleSlider extends Component<SimpleSliderProps> {
    toggleModal = (imageSrc: ImageData) => {
        alert(imageSrc.link);
    }

    render() {
        const { imageURLs } = this.props;

        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: true
        };

        return (
            <div>
                <Slider className='slider' {...settings}>
                    {imageURLs.map((imageSrc: ImageData) => (
                        <div key={imageSrc.id} className="image">
                            <img src={imageSrc.link} alt="Slider Image" />
                            {imageSrc.withBtn &&
                                <div className="button-url">
                                    <button onClick={() => this.toggleModal(imageSrc)}>
                                        Get Url
                                    </button>
                                </div>
                            }
                        </div>
                    ))}
                </Slider>
            </div>
        );
    }
}
