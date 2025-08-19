import React from "react";

const DropDown = ({ showMatch, layData, backData, data, title }) => {
  const renderBackOdds = (selection) => {
    const the_odds = backData;
    let filter_odds=[];
    if(title=="Match Odds"){
       filter_odds = the_odds?.filter(
        (todd) => todd.ri === selection?.SelectionId
      );
    }else{
       filter_odds = the_odds?.filter(
        (todd) => todd.runnerName === selection?.runnerName
      );
    }
   console.log("filter_odds",filter_odds);
    
    return (
      <>
      {title=="Match Odds"?(
        <>
        
        <td className="back-3 p-0" style={{ cursor: "not-allowed" }}>
          <div className="light-blue rounded-0">
            <strong>{filter_odds[2]?.rt || "--"}</strong>
            <span className="d-block">{filter_odds[2]?.bv || "--"}</span>
          </div>
        </td>
        <td className="back-2 p-0" style={{ cursor: "not-allowed" }}>
          <div className="light-blue rounded-0">
            <strong>{filter_odds[1]?.rt || "--"}</strong>
            <span className="d-block">{filter_odds[1]?.bv || "--"}</span>
          </div>
        </td>
        </>
      ):(<>
      {/* {filter_odds[0]?.ms != 1  ? (
                      <dd id="suspend" class="suspend-fancy">
                        <p id="info">
                          {filter_odds[0]?.ms == 9 
                            ? "Ball Running"
                            : filter_odds[0]?.ms == 2 
                              ? "In Active"
                              : filter_odds[0]?.ms == 3
                                ? "Suspended"
                                : filter_odds[0]?.ms == 4 
                                  ? "Closed"
                                  : "Suspended"}
                        </p>
                      </dd>
                    ) : ""} */}
        <td className="back-3 p-0" style={{ cursor: "not-allowed" }}>
          <div className="light-blue rounded-0">
            <strong>{filter_odds[0]?.rt?filter_odds[0]?.rt-2 : "--"}</strong>
            <span className="d-block">{filter_odds[0]?.bv || "--"}</span>
          </div>
        </td>
        <td className="back-2 p-0" style={{ cursor: "not-allowed" }}>
          <div className="light-blue rounded-0">
            <strong>{filter_odds[0]?.rt?filter_odds[0]?.rt-1 : "--"}</strong>
            <span className="d-block">{filter_odds[0]?.bv || "--"}</span>
          </div>
        </td></>
      )}
        
        <td className="back-1s p-0" style={{ cursor: "not-allowed" }}>
          <div className="light-blue rounded-0">
            <strong>{filter_odds[0]?.rt || "--"}</strong>
            <span className="d-block">{filter_odds[0]?.bv || "--"}</span>
          </div>
        </td>
      </>
    );
  };
  const renderLayOdds = (selection) => {
    const the_odds = layData;
    let filter_odds=[];
    if(title=="Match Odds"){
       filter_odds = the_odds?.filter(
        (todd) => todd.ri === selection?.SelectionId
      );
    }else{
       filter_odds = the_odds?.filter(
        (todd) => todd.runnerName === selection?.runnerName
      );
    }

   
    return (
      <>
        <td className="lay-1 p-0" style={{ cursor: "not-allowed" }}>
          <div className="lay-all rounded-0">
            <strong>{filter_odds[0]?.rt || "--"}</strong>
            <span className="d-block">{filter_odds[0]?.bv || "--"}</span>
          </div>
        </td>
        <td className="lay-2 p-0" style={{ cursor: "not-allowed" }}>
          {title=="Match Odds" ?(
            <div className="dark-pink rounded-0">
            <strong>{filter_odds[1]?.rt || "--"}</strong>
            <span className="d-block">{filter_odds[1]?.bv || "--"}</span>
          </div>
          ):(<div className="dark-pink rounded-0">
            <strong>{filter_odds[0]?.rt?Math.abs(filter_odds[0]?.rt)-1:"--"}</strong>
            <span className="d-block">{filter_odds[0]?.bv || "--"}</span>
          </div>
          )}
          
        </td>
      </>
    );
  };
  
  return (
    showMatch && (
      <tr>
        <td></td>
        <td></td>
        <td colSpan="4" className="px-0 gray-inner_table">
          <table className="selection-table">
            <tbody className="">
              <tr>
                <td width="40%" className="text-start border-0 ">
                  {data?.length > 0 && data?.length} selections Selections
                </td>
                <td className="refer-bet border-0" colSpan="2" width="30%">
                  100.8%
                </td>
                <td className="border-0 p-0" width="15%">
                  <div className="back-blue back-all-size">
                    <span>Back all</span>
                  </div>
                </td>
                <td className="border-0 p-0" width="15%">
                  <div className="lay-all back-all-size">
                    <span>Lay all</span>
                  </div>
                </td>
                <td className="refer-book border-0" colSpan="2" id="layPercent">
                  99.5%
                </td>
              </tr>
              {data?.length > 0 &&
                data?.map((res, index) => {
                  return (
                    <tr key={index + 1}>
                      <td className="border-start-0">
                        <a>
                          {" "}
                          <i className="far fa-chart-bar pe-2"></i>
                          <strong>
                            {" "}
                            {title == "Book Maker"
                              ? res?.runnerName
                              : res?.RunnerName}
                          </strong>
                        </a>
                      </td>
                      {renderBackOdds(res)}
                      {renderLayOdds(res)}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </td>
        <td width="80" className="border-l"></td>
      </tr>
    )
  );
};

export default DropDown;
