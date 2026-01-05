import { useEffect, useState } from "react";
import styles from "./feadbackForm.module.css";
import { FaStar } from "react-icons/fa";
import { useFetchCurrentUserQuery } from "../../../appState/apis/userApiSlice";
import { useSendFeedbackMutation } from "../../../appState/apis/systemApiSlice";
import { Button } from "@mui/material";
import BtnLoader from "../../general/btnLoader/btnLoader.component";

const FeadbackForm = () => {
  const [rating, setRating] = useState(1);
  const [hoverRating, setHoverRating] = useState(1);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // RTK Query mutation hook
  const [sendFeedback, { isLoading, isSuccess, isError, error }] =
    useSendFeedbackMutation();

  const { data: userData } = useFetchCurrentUserQuery();

  useEffect(() => {
    if (userData?.appRatingNumber) {
      setRating(userData?.appRatingNumber);
      setHoverRating(0);
      setComment("");
      setSubmitted(false);
    }
  }, []);

  const handleMouseOver = (starIndex) => {
    setHoverRating(starIndex);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (starIndex) => {
    setRating(starIndex);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send feedback to the API
      await sendFeedback({
        rating,
        comment,
      });

      // Show thank you message
      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setComment("");
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
      console.error("Failed to submit feedback:", err);
    }
  };

  if (submitted && isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.thankYouMessage}>
          Thank you for your feedback!
        </div>
      </div>
    );
  }
  if (submitted && isError) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          Failed to submit feedback. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>RATE OUR PORTAL</h3>

      <div className={styles.starsContainer}>
        <div className={styles.stars} onMouseLeave={handleMouseLeave}>
          {[1, 2, 3, 4, 5].map((starIndex) => (
            <FaStar
              key={starIndex}
              className={`${styles.star} ${
                (hoverRating || rating) >= starIndex ? styles.active : ""
              }`}
              onMouseOver={() => handleMouseOver(starIndex)}
              onClick={() => handleClick(starIndex)}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className={styles.commentInput}
          placeholder="Type your comment here..."
          value={comment}
          onChange={handleCommentChange}
          disabled={isLoading}
        />

        <div className={styles.buttonContainer}>
          <Button type="submit" disabled={isLoading} variant="contained">
            {isLoading ? <BtnLoader /> : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeadbackForm;
