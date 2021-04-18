import React from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import HeaderMain from '../HeaderMain/HeaderMain';
import Partner from '../Partner/Partner';
import Review from '../Review/Review';
import Service from '../Service/Service';
import Works from '../Works/Works';

const Home = () => {
  return (
    <div>
      <Header />
      <HeaderMain />
      <Partner />
      <Service />
      <Works />
      <Review />
      <Footer />
    </div>
  );
};

export default Home;
