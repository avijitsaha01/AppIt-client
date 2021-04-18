import React from "react";
import "./SingleService.css";
const SingleService = ({ service, handleRoute }) => {
  return (
    <div
      className='col-md-12 service d-flex flex-column justify-content-center align-items-center'
      onClick={() => handleRoute(service)}>
      <img
        src={service.img || `data:image/png;base64,${service.image.img}`}
        alt=''
      />
      <h5>{service.name} </h5>
      <p className='text-center'>{service.details} </p>
    </div>
  );
};

export default SingleService;
