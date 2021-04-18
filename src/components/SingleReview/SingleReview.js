import React from "react";
import { Card, Image } from "react-bootstrap";
import "./SingleReview.css";
const SingleReview = props => {
  const { name, img, designation, review } = props.review;
  return (
    <Card className='singlerReview col-md-4 m-3'>
      <Card.Body className='p-4'>
        <div className='person d-flex  align-items-center'>
          <Image className='personImg' variant='top' src={img} roundedCircle />
          <div className='personDetails'>
            <h5 className='m-0'>{name}</h5>
            <span>{designation}</span>
          </div>
        </div>
        <Card.Text style={{ color: "#707070" }}>{review}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default SingleReview;
