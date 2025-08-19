import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import constants from "../../utils/constants";
import { useEffect } from "react";
import obj from "../../utils/constants";
import { isEmpty } from "lodash";
const ViewSportPremium = () => {
  const params = useParams();
  const [isLoader, setLoader] = useState(false);
  const [matchData, setMatchData] = useState([]);
  const [detailsData, setDetailsData] = useState({});
  const [search_params, setSearchParams] = useState({
    eventId:params.eventId,
    selectionId:params.selectionId,
    marketId:params.marketId,
    userId: params.userId,
    userType: params.userType,
    betType: params.type == "Book Maker" ? "bookmaker" : "betFair",
  });

  const getMatchData = async () => {
    setLoader(true);

    const { status, data: response_users } = await apiGet(
      apiPath.riskManagementSPortPremiumDetails + `?eventId=${search_params.eventId}&selectionId=${search_params.selectionId}&marketId=${search_params.marketId}&userType=${search_params.userType}&userId=${search_params.userId}`
,      search_params
    );
    if (status === 200) {
      if (response_users.success) {
        if (response_users.results) {
          setLoader(false);
          setMatchData(response_users.results);
        }
      }
    }
  };
  useEffect(() => {
    setSearchParams({
      eventId:params.eventId,
      selectionId:params.selectionId,
      marketId:params.marketId,
      userId: params.userId,
      userType: params.userType,
      betType: params.type == "Book Maker" ? "bookmaker" : "betFair",
    });
  }, [params]);
  // useEffect(() => {
  //   getMatchData();
  // }, [search_params]);
  useEffect(() => {
    getDetails();
  }, [search_params]);

  const getDetails = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.riskManagementSPortPremiumDetails + `?eventId=${search_params.eventId}&selectionId=${search_params.selectionId}&marketId=${search_params.marketId}&userType=${search_params.userType}&userId=${search_params.userId}`
    );
    if (status === 200) {
      if (response_users.success) {
        if (response_users.results) {
          setDetailsData(response_users.results);
        }
      }
    }
  };

  var first = 0;
  var third = 0;
  var second = 0;
  // console.log("detailsData",detailsData);
  return (
    <section className="main-inner-outer py-4">
      <section className="account-table">
        <div className="container-fluid">
          <div className="db-sec d-flex justify-content-between align-items-center mb-2">
            <h2 className="common-heading">
              {/* {detailsData?.eventName} ( {params?.type} ) */}
            </h2>
            <Button className="green-btn" onClick={() => window.close()}>
              Close
            </Button>
          </div>
         
          {detailsData?.length > 0 &&
            <div className="responsive">
              <Table>
              <tbody>
                <tr>
                  <td rowspan="2">
                    <strong> Downline</strong></td>
                     <td class="text-center border-l bg-light-yellow" colspan="3"><strong>Player P/L</strong></td>
                    </tr>
                    </tbody>
                {!isLoader ? (
                  <tbody className="new-match-tbody">
                    {detailsData &&
                      detailsData?.length > 0 &&
                      detailsData?.map((res) => {
                        first +=
                          res?.positionProfitAmount != 0
                            ? res?.positionProfitAmount
                            : 0;
                        
                        second +=
                          res?.positionLoseAmount != 0
                            ? res?.positionLoseAmount
                            : 0;
                        return (
                         
                            <>
                              <tr>
                                <td
                                  className="text-start"
                                // style={{ display: "flex", width: "100%" }}
                                >
                                  {search_params?.userType == "agent" ? (
                                    <>
                                      <a href={"#"} className="text-primary">
                                        <span>
                                          {
                                            constants?.user_status[
                                            res?.profileData?.userType || ""
                                            ]
                                          }
                                        </span>
                                      </a>
                                      {res?.profileData?.username || null}
                                    </>
                                  ) : (
                                    <Link
                                    to={`/DownlinePnl-sport-premium/${res?.eventId}/${res?.selectionId}/${res?.marketId}/${res?.profileData?.userType}/${res?.profileData?._id}`}
                                    >
                                      <span>
                                        {
                                          constants?.user_status[
                                          res?.profileData?.userType || ""
                                          ]
                                        }
                                      </span>
                                      {res?.profileData?.username  || null}
                                    </Link>
                                  )}
                                </td>
                                
                                <td class="border-0 bg-yellow" ><p class="text-success"> {res?.positionLoseAmount?.toFixed(2)}</p></td>
                                <td class="border-0 bg-yellow"><p class="text-danger">(-{res?.positionProfitAmount?.toFixed(2)})</p></td>
                               
                              </tr>
                            </>
                          // )
                        );
                      })}
                    {detailsData?.length > 0 && (
                      <tr style={{ fontWeight: "600" }}>
                        <td
                          className="text-start"
                        // style={{ display: "flex", width: "100%" }}
                        >
                          Total
                        </td>
                       
                                <td class="border-0 bg-yellow"><p class="text-success"> {second?.toFixed(2)}</p></td>
                                <td class="border-0 bg-yellow"><p class="text-danger">(-{first?.toFixed(2)})</p></td>
                               
                       
                      </tr>
                    )}

                    {isEmpty(detailsData) ? (
                      <tr>
                        <td colSpan={9}>No records found</td>
                      </tr>
                    ) : null}
                  </tbody>
                ) : (
                  <div
                    id="loader"
                    className="spinner"
                    style={{ display: `block` }}
                  ></div>
                )}
              </Table>
            </div>}
        </div>
      </section>
    </section>
  );
};

export default ViewSportPremium;
