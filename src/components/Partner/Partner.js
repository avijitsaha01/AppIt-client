import React, { useEffect, useState } from 'react';
import SinglePartner from '../SinglePartner/SinglePartner';

const Partner = () => {
  const [partners, SetPartner] = useState([]);

  useEffect(() => {
    fetch('https://creative-agency-backend.herokuapp.com/getPartner')
      .then(res => res.json())
      .then(getPartner => {
        SetPartner(getPartner);
      });
  }, []);

  return (
    <section className='partner'>
    <h3
          className='text-center'
          style={{ fontWeight: "700", fontSize: "36px", marginBottom: "3rem" }}>
          Our Happy <span style={{ color: "#7AB259" }}>Client</span>{" "}
        </h3>
      <div className='container d-flex justify-content-around align-items-center my-5'>
        {partners.map(partner => (
          <SinglePartner key={partner._id} partner={partner} />
        ))}
      </div>
    </section>
  );
};

export default Partner;
