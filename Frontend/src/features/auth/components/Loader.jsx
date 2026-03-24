import React from "react";
import "./loader.scss";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="loaderWrapper">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
};

export default Loader;