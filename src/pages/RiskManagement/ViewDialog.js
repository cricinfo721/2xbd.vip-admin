import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import constants from "../../utils/constants";
import { useEffect } from "react";
import obj from "../../utils/constants";
import { isEmpty } from "lodash";
const ViewDialog = () => {
  const params = useParams();
  const [isLoader, setLoader] = useState(false);
  const [matchData, setMatchData] = useState([]);
  const [detailsData, setDetailsData] = useState({});
  const [search_params, setSearchParams] = useState({
    userId: params.userId,
    userType: params.userType,
    eventId: params.id,
    betType: params.type == "Book Maker" ? "bookmaker" : "betFair",
  });

  const getMatchData = async () => {
    setLoader(true);

    const { status, data: response_users } = await apiGet(
      apiPath.downlineDataRisk,
      search_params
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
      userId: params.userId,
      userType: params.userType,
      eventId: params.id,
      betType: params.type == "Book Maker" ? "bookmaker" : "betFair",
    });
  }, [params]);

  useEffect(() => {
    getMatchData();
    getDetails();
  }, [search_params?.userId,search_params?.eventId,search_params?.betType]);
  

  const getDetails = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.riskManagementDetails + `?eventId=${search_params.eventId}`
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
  return (
    <section className="main-inner-outer py-4">
      <section className="account-table">
        <div className="container-fluid">
          <div className="db-sec d-flex justify-content-between align-items-center mb-2">
            <h2 className="common-heading">
              {detailsData?.eventName} ( {params?.type} )
            </h2>
            <Button className="green-btn" onClick={() => window.close()}>
              Close
            </Button>
          </div>
          {matchData?.length > 0 &&
            <div className="responsive">
              <Table>
                <thead>
                  <tr>
                    <th scope="col" >
                      Downline
                    </th>
                    <th scope="col" width="20%">
                      {" "}
                      {detailsData?.jsonData
                        ? detailsData?.jsonData[0]?.RunnerName
                        : ""}
                    </th>
                    {detailsData?.jsonData?.length > 2 && (
                      <th scope="col" width="10%">
                        The Draw
                      </th>
                    )}
                    <th scope="col" width="20%">
                      {detailsData?.jsonData
                        ? detailsData?.jsonData[1]?.RunnerName
                        : ""}
                    </th>
                  </tr>
                </thead>
                {!isLoader ? (
                  <tbody>
                    {matchData &&
                      matchData?.length > 0 &&
                      matchData?.map((res) => {
                       
                        // console.log('res?.position[2]?.position',res?.position[0]?.position, res?.position[1]?.position, res?.position[2]?.position)
                        
                        // console.log('-----------------',res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[0]?.SelectionId)?.position)

                        // console.log('-----------------',res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[1]?.SelectionId)?.position)
                        
                        if(Object.keys(detailsData).length !== 0){
                          // console.log("eeeeeeeeeeeeeeee",detailsData);
                          first +=
                          res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[0]?.SelectionId)?.position != 0
                              ? res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[0]?.SelectionId)?.position
                              : 0;
                          third +=
                          res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[2]?.SelectionId)?.position != 0
                              ? res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[2]?.SelectionId)?.position
                              : 0;
                          second +=
                          res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[1]?.SelectionId)?.position != 0
                              ? res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[1]?.SelectionId)?.position
                              : 0;
                        }
                        

                        return (first == 0 &&
                          second == 0 &&
                          third == 0)?(""):(
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
                                            res?.userType || ""
                                            ]
                                          }
                                        </span>
                                      </a>
                                      {res?.username || null}
                                    </>
                                  ) : (
                                    <Link
                                      to={`/DownlinePnl/${res._id}/${res?.userType}/${search_params.eventId}/${params?.type}`}
                                    >
                                      <a href={"#"} className="text-primary">
                                      <span>
                                        {constants?.user_status[res?.userType || ""]}
                                      </span>
                                    </a>
                                      {res?.username || null}
                                    </Link>
                                  )}
                                </td>
                                <td>
                                  {Math.sign(res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[0]?.SelectionId)?.position?.toFixed(2)) ===
                                    -1 ? (
                                      search_params?.userType == "agent"?
                                    <span className="text-danger">
                                      {res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[0]?.SelectionId)?.position?.toFixed(2)}
                                    </span>
                                    :<span className="text-success">
                                    {Math.abs(res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[0]?.SelectionId)?.position?.toFixed(2))}
                                  </span>
                                  ) : (
                                    search_params?.userType == "agent"?
                                    <span className="text-success">
                                    {res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[0]?.SelectionId)?.position?.toFixed(2)}
                                    </span>
                                    :<span className="text-danger">
                                    {-res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[0]?.SelectionId)?.position?.toFixed(2)}
                                    </span>
                                  )}

                                </td>
                                {detailsData?.jsonData?.length > 2 && (
                                  <td>
                                    {Math.sign(res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[2]?.SelectionId)?.position?.toFixed(2)) ===
                                      -1 ? (
                                        search_params?.userType == "agent"?
                                      <span className="text-danger">
                                        {res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[2]?.SelectionId)?.position?.toFixed(2)}
                                      </span>
                                      :<span className="text-success">
                                      {Math.abs(res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[2]?.SelectionId)?.position?.toFixed(2))}
                                    </span>
                                    ) : (
                                      search_params?.userType == "agent"?
                                      <span className="text-success">
                                      {res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[2]?.SelectionId)?.position?.toFixed(2)}                                      
                                      </span>
                                      :
                                      <span className="text-danger">
                                      {-res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[2]?.SelectionId)?.position?.toFixed(2)}                                      
                                      </span>
                                    )}

                                  </td>
                                )}
                                <td>
                                  {Math.sign(res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[1]?.SelectionId)?.position?.toFixed(2)) ===
                                    -1 ? (
                                      search_params?.userType == "agent"?
                                    <span className="text-danger">
                                      {res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[1]?.SelectionId)?.position?.toFixed(2)}
                                    </span>
                                    : <span className="text-success">
                                    {Math.abs(res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[1]?.SelectionId)?.position?.toFixed(2))}
                                  </span>
                                  ) : (
                                    search_params?.userType == "agent"?
                                    <span className="text-success">
                                    {res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[1]?.SelectionId)?.position?.toFixed(2)}
                                    </span>
                                    : <span className="text-danger">
                                    {-res?.position?.find((res) => res?.selectionId == detailsData?.jsonData[1]?.SelectionId)?.position?.toFixed(2)}
                                    </span>
                                  )}

                                </td>
                              </tr>
                            </>
                          
                        );
                      })}
                    {matchData?.length > 0 && (
                      <tr style={{ fontWeight: "600" }}>
                        <td
                          className="text-start"
                        // style={{ display: "flex", width: "100%" }}
                        >
                          Total
                        </td>
                        <td>
                          {Math.sign(first?.toFixed(2)) ===
                            -1 ? (
                              search_params?.userType == "agent"?
                            <span className="text-danger">
                              {first?.toFixed(2)}
                            </span>
                            : <span className="text-success">
                            {Math.abs(first?.toFixed(2))}
                          </span>
                          ) : (
                            search_params?.userType == "agent"?
                            <span className="text-success">{first?.toFixed(2)}</span>
                            : <span className="text-danger">{-first?.toFixed(2)}</span>
                          )}

                        </td>
                        {detailsData?.jsonData?.length > 2 && <td>
                          {Math.sign(third?.toFixed(2)) ===
                            -1 ? (
                              search_params?.userType == "agent"?
                            <span className="text-danger"> {third?.toFixed(2)}</span>
                            :<span className="text-success"> {Math.abs(third?.toFixed(2))}</span>
                          ) : (search_params?.userType == "agent"?
                          <span className="text-success">{third?.toFixed(2)}</span>
                          :<span className="text-danger">{-third?.toFixed(2)}</span>
                            
                          )}
                        </td>}

                        <td>{Math.sign(second?.toFixed(2)) ===
                          -1 ? (  search_params?.userType == "agent"?
                          <span className="text-danger">
                            {second?.toFixed(2)}
                          </span>
                          :<span className="text-success">
                          {Math.abs(second?.toFixed(2))}
                        </span>
                        ) : (search_params?.userType == "agent"?
                        <span className="text-success">{second?.toFixed(2)}</span>
                        : <span className="text-danger">{-second?.toFixed(2)}</span>
                          
                        )}</td>
                      </tr>
                    )}

                    {isEmpty(matchData) ? (
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

export default ViewDialog;
