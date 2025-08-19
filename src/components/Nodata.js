import React from "react";
import nodata from "../assets/images/no-data.png";
const Nodata = () => {
  return (
    <div  class="no-result"><div  class="pic">
        <img  alt="no-data" src={nodata} loading="lazy"/></div>
        <div  class="text">No Data</div>
        </div>
  );
};

export default Nodata;
