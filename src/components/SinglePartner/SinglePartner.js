import React from 'react';
import './SinglePartner.css';
const SinglePartner = ({ partner }) => {
  return (
    <>
      <img className='partnerImg' src={partner.img} alt='' />
    </>
  );
};

export default SinglePartner;
