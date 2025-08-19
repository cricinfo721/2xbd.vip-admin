import React, { useState,useContext } from "react";
import { Table, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import constants from "../utils/constants";
import { useEffect } from "react";
import obj from "../utils/constants";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
import { isEmpty } from "lodash";
const MarketBets = () => {
  let { user } = useContext(AuthContext);

  const params = useParams();
  const [isLoader, setLoader] = useState(false);
  const [betsData, setBetsData] = useState([]);
  const [search_params, setSearchParams] = useState({
    eventId: params.eventId,
    betFairType: params.betFairType,
 
    
  });

  useEffect(() => {
    getBetsData();
  }, [search_params.eventId]);

  const getBetsData = async () => {
    setLoader(true);
    const { status, data: response_users } = await apiGet(
      apiPath.reportMatchMarketBets + `?eventId=${search_params.eventId}&betFaireType=`+search_params?.betFairType
    );
    if (status === 200) {
      if (response_users.success) {
        if (response_users.results) {
          setLoader(false);
          setBetsData(response_users.results);
        }
      }
    }
  };
console.log("betsData",betsData)

  return (
    <section className="main-inner-outer py-4">
      <section className="account-table">
        <div className="container-fluid">
          <div className="db-sec d-flex justify-content-between align-items-center mb-2">
            <h2 className="common-heading">
              Show Bets
            </h2>
            <Button className="green-btn" onClick={() => window.close()}>
              Close
            </Button>
          </div>
          {betsData?.length > 0 &&
            <div className="responsive">
              <Table>
                <thead>
                  <tr>
                    <th scope="col"> Sports</th>
                    <th scope="col">Match Name</th>
                    <th scope="col">Client</th>
                    <th scope="col">Type</th>
                    <th scope="col">Selection</th>
                    {/* <th scope="col">Result</th> */}
                    <th scope="col">Odds</th>
                    <th scope="col">Stake</th>
                    <th scope="col">Place Time</th>
                    <th scope="col">IP</th>
                    <th scope="col">PnL</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                {!isLoader ? (
                  <tbody>
                    {betsData &&
                      betsData?.length > 0 &&
                      betsData?.map((res) => {
                        return (  
                        <tr>
                          <td className="text-start"> {res?.eventType=="4"?"cricket":res?.eventType=="1"?"Soccer":"Tenis"}</td>
                          <td>{res?.matchName}</td>
                          <td>{res?.clientName}</td>
                          <td>{res?.betType}</td>
                          <td> {params?.betFairType === "fancy" ? res?.betRun + "/" + res?.bhav : (params?.betFairType === "sportBook") ? res?.runnerName : (params?.betFairType === "casino") ? res?.platformTxId : res?.teamName}</td>
                          {/* <td>{res?.betType}</td> */}
                          <td>{res?.bhav}</td>
                          <td>{res?.amount}</td>
                          <td>{helpers.dateFormat(
                                res?.timeInserted,
                                user.timeZone
                              )}</td>
                          <td>{(res?.ipAddress) && res?.ipAddress.replace("::ffff:","") || "-"}</td>
                          <td className="text-end" >
                                  {params?.betFairType == "betfair" ? (
                                    <>
                                      {(res?.teamSelectionWin == res?.selectionId &&
                                        res?.betType == "back") ||
                                        (res?.teamSelectionWin != res?.selectionId &&
                                          res?.betType == "lay") ? (
                                        <span className="text-success">
                                          {res?.profitAmount}
                                        </span>
                                      ) : (
                                        <span className="text-danger">
                                          -({res?.loseAmount})
                                        </span>
                                      )}
                                    </>

                                  )  : (
                                    <>
                                      {res?.type == "No" ? (
                                        res?.decisionRun < res?.betRun ? (
                                          <span className="text-success">
                                            {res?.profitAmount}
                                          </span>
                                        ) : (
                                          <span className="text-danger">
                                            -({res?.loseAmount})
                                          </span>
                                        )
                                      ) : res?.decisionRun >= res?.betRun ? (
                                        <span className="text-success">
                                          {res?.profitAmount}
                                        </span>
                                      ) : (
                                        <span className="text-danger">
                                          -({res?.loseAmount})
                                        </span>
                                      )}
                                    </>
                                  )}
                                </td>
                          <td>{res?.betType}</td>
                      </tr>)
                      })}
                    {isEmpty(betsData) ? (
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

export default MarketBets;
