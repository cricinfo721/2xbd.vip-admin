import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Table, Button ,Modal} from "react-bootstrap";
import { apiGet,apiPost } from "../utils/apiFetch";
import obj from "../utils/constants";
import apiPath from "../utils/apiPath";
import moment from "moment";
import ReactPaginate from "react-paginate";
import { useLocation,useParams } from "react-router-dom";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
import { toast } from "wc-toast";
import {startCase} from "lodash";


const ViewBetsResult = () => {
  const params = useParams();
  const [isLoader, setLoader] = useState(false);
  const [matchData, setMatchData] = useState([]);
  let { user } = useContext(AuthContext);
  const [getType, setType] = useState("4");
  const [getBetType, setBetType] = useState("fancy");
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);
  const [data, setData] = useState([]);

  const [fancy, setFancy] = useState(false);
  const [getFancyType, setFancyType] = useState("");
  const [selectionId, setSelectionId] = useState("");
  const [fancyStatus, setFancyStatus] = useState("");
  const [eventId, setEventId] = useState("");
  const [marketId, setMarketId] = useState("");
  const [betId, setbetId] = useState("");
  

  const [filter, setFilter] = useState({
    betType: "betfair",
    eventId:params.eventId,
    selectionId:params.selectionId,
    marketId:params.marketId,
    page: 1,
    limit: 100,
  });


  useEffect(() => {
    setFilter({
      betType: "betfair",
      eventId:params.eventId,
      selectionId:params.selectionId,
      marketId:params.marketId,
      page: 1,
      limit: 100,
    });
  }, [params]);
 
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.eventFancyBets+`?eventId=${filter.eventId}&selectionId=${filter.selectionId}`
    );
    if (status === 200) {
      if (response_users.success) {
        setData(response_users.results);
        setBetType(filter.fancyType?"sportbook":"fancy");
        setType(filter.type);
      }
    }
  };

  const handlePageClick = (event) => {
    setFilter((prevState) => {
      return {
        ...prevState,
        page: event.selected + 1,
      };
    });
    setViewPage(event.selected);
  };

  useEffect(() => {
    setPageCount(data?.totalPages || []);
  }, [data]);
  const fancyToggle = (selectionId, eventId, id, fancyType, fancyStatus,betId) => {
    setSelectionId(selectionId);
    setMarketId(id);
    setEventId(eventId);
    setFancy(!fancy);
    setFancyType(fancyType);
    setFancyStatus(fancyStatus);
    setbetId(betId);
  };
  const updateMatchStatus = async () => {
    setLoader(true);
    if (eventId && selectionId) {
      try {
          let api =
          getFancyType == "premium"
            ? apiPath.updatePremiumFancyStatus
            : apiPath.updateFancyStatus;
          const { status, data: response_users } = await apiPost(api, {
            status: "deleted",
            eventId: eventId,
            selectionId: selectionId,
            marketId: marketId,
            betId:betId,
            betType:getFancyType == "premium"?"premium":""
          });
          if (status === 200) {
            if (response_users.success) {
              setLoader(false);
              setFancy();
              getData();
              toast.success(response_users.message);
            } else {
              setLoader(false);
              toast.error(response_users.message);
            }
          }
      } catch (err) {
        setLoader(false);
        toast.error(err.response.data.message);
      }
    }
  };
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
          <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">PL ID</th>
                        <th scope="col"> Bet ID</th>
                        <th scope="col">Bet placed</th>
                        <th scope="col">IP Address </th>
                        <th scope="col">Market</th>
                        <th scope="col">Status</th>
                        <th scope="col">Selection</th>
                        <th scope="col">Type</th>
                        <th scope="col">Odds req.</th>
                        <th scope="col">Stake </th>
                        <th scope="col">Liability</th>
                        <th scope="col"> Profit/Loss</th>
                        <th scope="col"> Action</th>
                      </tr>
                    </thead>
                    {data && data?.length > 0 ? (
                      data?.map((item) => {
                        return (
                          <tr>
                            <td>{item?.clientName || "-"}</td>
                            <td>
                              {" "}
                              {item?.sessionBetId || "-"}
                            </td>
                            <td>
                              {" "}
                              {helpers.dateFormat(
                                item?.timeInserted,
                                user.timeZone
                              )}
                              {/* {item?.timeInserted || "-"} */}
                            </td>
                            <td> {(item?.ipAddress) && item?.ipAddress.replace("::ffff:","") || "-"}</td>
                            <td className="text-start">
                              {obj.betCheckObj[getType]}
                              <span className="angle_unicode">▸</span>
                              <strong>
                                {getType === "3"
                                  ? item?.casinoName
                                  : item?.matchName}
                              </strong>
                              <span className="angle_unicode">▸</span>
                              {getBetType === "betfair" && "Match Odds"}{" "}
                              {getBetType === "Bookmaker" && "Book Maker"}
                              {getBetType === "sportBook" && item?.fancyName}
                              {getBetType === "fancy" && item?.fancyName}{" "}
                              {getBetType === "casino" && item?.casinoType}{" "}
                            </td>
                            <td>{item?.status}</td>
                            <td>
                              {getBetType === "fancy" ? item?.betRun + "/" + item?.bhav : (getBetType === "sportBook") ? item?.runnerName : (getBetType === "casino") ? item?.platformTxId : item?.teamName}

                              {/* {item?.fancyName || item?.teamName || item?.platformTxId} */}
                            </td>

                            <td> {item?.betType || item?.type || item?.gameCode} </td>
                            {
                              <td> {getType === "3" ? 0 : item?.bhav || "-"} </td>}

                            <td> { item?.amount } </td>
                            {
                              <td> {item?.loseAmount || "-"} </td>}

                            {/* <td> */}
                           
                                <td className="text-end" >
                                  {getBetType === "sportBook" ? (
                                    <>

                                      {item?.teamSelectionWin && item?.teamSelectionWin.split(',').includes(item?.fancySelectionId) ? (
                                        <span className="text-success">
                                          {item?.profitAmount}
                                        </span>
                                      ) : (
                                        <span className="text-danger">
                                          -({item?.loseAmount})
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {item?.type == "No" ? (
                                        item?.decisionRun < item?.betRun ? (
                                          <span className="text-success">
                                            {item?.profitAmount}
                                          </span>
                                        ) : (
                                          <span className="text-danger">
                                            -({item?.loseAmount})
                                          </span>
                                        )
                                      ) : item?.decisionRun >= item?.betRun ? (
                                        <span className="text-success">
                                          {item?.profitAmount}
                                        </span>
                                      ) : (
                                        <span className="text-danger">
                                          -({item?.loseAmount})
                                        </span>
                                      )}
                                    </>
                                  )}
                                </td>
                                <td>
                                <Button
                                  onClick={(e) => {
                                    fancyToggle(
                                      item?.selectionId,
                                      item?.eventId,
                                      item?.marketId,
                                      item?.fancyType,
                                      "deleted"
                                    );
                                  }}
                                  className="bg-danger text-white border-danger"
                                >
                                  Delete
                                </Button>
                              </td>
                                
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={12}>
                          <span>You have no bets in this time period.</span>
                        </td>
                      </tr>
                    )}
                  </Table>
                </div>
                <div className="bottom-pagination">
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel=" >"
                    forcePage={viewpage}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={10}
                    pageCount={pageCount}
                    previousLabel="< "
                    renderOnZeroPageCount={null}
                    activeClassName="p-1"
                    activeLinkClassName="pagintion-li"
                  />
                </div>
              </div>
        </div>
      </section>
      <Modal show={fancy} onHide={fancyToggle} className="block-modal">
        <Modal.Header className="border-0">
          <Modal.Title className="modal-title-status">
          {startCase(fancyStatus)}-({eventId})
            
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <div className="block-modal-content">
            <h3>Are you sure you want to  {startCase(fancyStatus)} ({eventId}) ?</h3>
            <div className="text-center">
              <Button
                type="submit"
                className="green-btn me-3"
                onClick={() => updateMatchStatus()}
              >
                {isLoader ? "Loading..." : "Confirm"}
              </Button>
              <Button className="green-btn" onClick={fancyToggle}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default ViewBetsResult;
