import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import './Works.css';
const Works = () => {
  const [Sliders, SetSlider] = useState([]);

  useEffect(() => {
    fetch('https://creative-agency-backend.herokuapp.com/getSliderData')
      .then(res => res.json())
      .then(getSlider => {
        SetSlider(getSlider);
      });
  }, []);

  var settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 3000,
    autoplaySpeed: 3000,
    cssEase: 'linear',
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className='works'>
      <h3
        className='text-center'
        style={{
          fontWeight: '500',
          fontSize: '36px',
          marginBottom: '3rem',
          color: 'white',
        }}>
        Here are some of <span style={{ color: '#7AB259' }}>our works</span>{' '}
      </h3>

      <div className='sliderDiv'>
        <Slider {...settings}>
          {Sliders.map(slider => (
            <div key={slider._id}>
              <img className='sliderImg' src={slider.img} alt='' />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Works;
