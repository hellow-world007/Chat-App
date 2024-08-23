/* eslint-disable react/prop-types */
import "./LoadingSpinner.css";

const LoadingSpinner = (props) => {
  return (
    <div className={`${props.asOverlay && "loading-spinner__overlay"}`}>
      <span className="loading loading-bars loading-lg"></span>
    </div>
  );
};

export default LoadingSpinner;
