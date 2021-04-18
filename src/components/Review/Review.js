import React, { useEffect, useState } from "react";
import SingleReview from "../SingleReview/SingleReview";
const Review = () => {
  const [reviews, SetReviews] = useState([]);

  useEffect(() => {
    fetch("https://creative-agency-backend.herokuapp.com/getReviews")
      .then(res => res.json())
      .then(getReviews => {
        SetReviews(getReviews.slice(0, 6));
      });
  }, []);

  return (
    <section className='review' style={{ margin: "6rem 0" }}>
      <div className='container'>
        <h3
          className='text-center'
          style={{
            fontWeight: "700",
            fontSize: "36px",
            marginBottom: "3rem",
            color: "#171B4E",
          }}>
          Client <span style={{ color: "#7AB259" }}>Feedback</span>{" "}
        </h3>

        <div className='row justify-content-around'>
          {reviews.map(review => (
            <SingleReview key={review._id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Review;
