import React from "react";
import { Link } from "react-router-dom";

const NoMatch = () => {
  return (
    <div id="error-fof">
      <div className="fof">
        <h1>Error 404</h1> <br />
        <Link to={"/"}>Go to Home</Link>
      </div>
    </div>
  );
};

export default NoMatch;
