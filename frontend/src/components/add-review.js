import React, { useState } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const AddReview = (props) => {
  let initialReviewState = "";

  let editing = false;

  //check if current review is part of the state
  if (props.location.state && props.location.state.currentReview) {
    //if true - set editing to true
    editing = true;
    //set initial review state to props at location state that current review text so that the text of the review being edited
    initialReviewState = props.location.state.currentReview.text;
  }
  //create variables with initial state
  const [review, setReview] = useState(initialReviewState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (event) => {
    setReview(event.target.value);
  };

  const saveReview = () => {
    var data = {
      text: review,
      name: props.user.name,
      user_id: props.user.id,
      restaurant_id: props.match.params.id,
    };

    if (editing) {
      data.review_id = props.location.state.currentReview._id;
      RestaurantDataService.updateReview(data)
        .then((response) => {
          setSubmitted(true);
        })
        .catch((e) => {
          e.status.json("Error" + e);
        });
    } else {
      RestaurantDataService.createReview(data)
        .then((response) => {
          setSubmitted(true);
        })
        .catch((e) => {
          e.status.json("Error" + e);
        });
    }
  };

  return (
    <div id="add-review">
      {props.user ? (
        <div className="submit-form">
          {submitted ? (
            <div className="successful-submission">
              <h4>You submitted successfully!</h4>
              <Link
                to={"/restaurants/" + props.match.params.id}
                className="btn btn-success my-1"
              >
                Back to Restaurant
              </Link>
            </div>
          ) : (
            <div id="login-form">
              <div className="form-group">
                <label htmlFor="description" className="text-state">
                  {editing ? "Edit" : "Create"} Review
                </label>
                <input
                  type="text"
                  className="form-control rev-input my-3"
                  id="text"
                  required
                  value={review}
                  onChange={handleInputChange}
                  name="text"
                />
              </div>
              <button
                onClick={saveReview}
                className="btn btn-success btn-state"
              >
                Submit
              </button>
              <Link to={"/Restaurants"}>
                <button className="btn btn-danger btn-state">Cancel</button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="card-login">Please log in.</div>
      )}
    </div>
  );
};

export default AddReview;
