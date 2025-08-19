import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { apiGet } from "../utils/apiFetch";
import obj from "../utils/constants";
import apiPath from "../utils/apiPath";
import moment from "moment";
import ReactPaginate from "react-paginate";
import { useLocation } from "react-router-dom";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
const BetList = () => {
  let { user } = useContext(AuthContext);

  var previousDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  var currentDate = moment().format("YYYY-MM-DD");
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);
  const [data, setData] = useState([]);
  const [getBetType, setBetType] = useState("betfair");
  const [getType, setType] = useState("4");
  const location = useLocation();
  const [filter, setFilter] = useState({
    type: "4",
    betType: "betfair",
    status: "completed",
    fromPeriod: previousDate,
    toPeriod: currentDate,
    filterByDay: "",
    page: 1,
    limit: 100,
  });

  const getData = async (type = "search") => {
    if (filter.filterByDay != "") {
      if (filter.filterByDay == "today") {
        filter.fromPeriod = currentDate;
        filter.toPeriod = currentDate;
      }
      if (filter.filterByDay == "yesterday") {
        filter.fromPeriod = previousDate;
        filter.toPeriod = currentDate;
      }
    }
    const { status, data: response_users } = await apiGet(
      apiPath.getBets,
      type == "search" ? filter : type
    );
    if (status === 200) {
      if (response_users.success) {
        setData(response_users.results);
        setBetType(filter.betType);
        setType(filter.type);
      }
    }
  };

  useEffect(() => {
    if (filter.filterByDay != "") {
      getData();
    }
  }, [filter.filterByDay]);

  const handleSearch = (type) => {
    setFilter((prevState) => {
      return {
        ...prevState,
        page: 1,
      };
    });
    getData(type);
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

  useEffect(() => {
    getData();
    setViewPage(filter.page ? filter.page - 1 : 0);
  }, [filter?.type,filter?.betType,filter?.status,filter?.type,filter?.page,]);

 


  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Bet List</h2>
          </div>
          <div className="inner-wrapper">
            <div className="common-container">
              <Form className="">
                <div className="d-lg-flex">
                  <div key={`inline-radio`} className="mb-1">
                    <ul className="list-unstyled mb-0 d-flex">
                      {obj.betCheckData.map((type) => {
                        return (
                          <li>
                            <Form.Check
                              inline
                              label={type.value}
                              name={type.label}
                              type="radio"
                              checked={
                                type.label === filter.type ? true : false
                              }
                              onChange={(e) =>
                                setFilter({
                                  ...filter,
                                  type: e.target.name,
                                  betType:
                                    type?.value == "Casino"
                                      ? "casino"
                                      : "betfair",
                                })
                              }
                              id={`inline-radio-1`}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {filter.type != 3 && (
                    <div key={`inline-radio`} className="mb-2">
                      <ul className="list-unstyled mb-0 d-flex">
                        {obj.betCheckDataInner.map((type) => {
                          return (
                            <li>
                              <Form.Check
                                inline
                                label={type.value}
                                name={type.label}
                                type="radio"
                                checked={
                                  type.label === filter.betType ? true : false
                                }
                                onChange={(e) =>
                                  setFilter({
                                    ...filter,
                                    betType: e.target.name,
                                  })
                                }
                                id={`inline-radio-1`}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="bet_status mb-0">
                  <Row>
                    <Col xxl={12} lg={12} md={12}>
                      <Row>
                        <Col lg={2} sm={3} className="mb-lg-0 mb-3">
                          <div className="bet-sec">
                            <Form.Label className="mt-2 me-2">
                              Bet Status:
                            </Form.Label>
                            <Form.Select
                              className="small_select"
                              onChange={(e) =>
                                setFilter({ ...filter, status: e.target.value })
                              }
                              value={filter.status}
                              aria-label="Default select example"
                            >
                              {filter.betType == "betfair" &&
                                (filter.type == 4 ||
                                  filter.type == 2 ||
                                  filter.type == 1) && (
                                  <>
                                    {" "}
                                    <option value="unmatched">Unmatched</option>
                                    <option value="matched">Matched</option>
                                  </>
                                )}

                              <option value="completed">Settled</option>
                              <option value="suspend">Cancelled</option>
                              <option value="voided">Voided</option>
                            </Form.Select>
                          </div>
                        </Col>
                        <Col lg={2} sm={3} className="mb-lg-0 mb-3">
                          <div className="bet-sec">
                          <Form.Label>Last</Form.Label>
                          <Form.Select
                            className="small_select"
                            onChange={(e) =>
                              setFilter({ ...filter, limit: e.target.value })
                            }
                            value={filter.limit}
                            aria-label="Default select example"
                          >
                            <option value={100}>100 Txn</option>
                            <option value={200}>200 Txn</option>
                            <option value={500}>500 Txn</option>
                            <option value={1000}>1000 Txn</option>
                            <option value={5000}>5000 Txn</option>
                            <option value={10000}>10000 Txn</option>
                            <option value={""}>All</option>
                          </Form.Select>
                          </div>
                        </Col>
                        <Col lg={2} sm={3} className="mb-lg-0 mb-3">
                          <div className="bet-sec bet-period">
                            <Form.Label className="mt-2 me-2">From</Form.Label>
                            <Form.Group className="form-group">
                              <Form.Control
                                onChange={(e) =>
                                  setFilter({
                                    ...filter,
                                    fromPeriod: e.target.value,
                                    filterByDay: "",
                                  })
                                }
                                max={new Date().toISOString().split("T")[0]}
                                value={filter.fromPeriod}
                                type="date"
                              />
                              <Form.Control
                                className="small_form_control"
                                type="text"
                                placeholder="00:00"
                                disabled
                              />
                            </Form.Group>
                          </div>
                        </Col>
                        <Col lg={2} sm={3} className="mb-lg-0 mb-3">
                          <div className="bet-sec bet-period">
                            <Form.Label className="mt-2 me-2">To</Form.Label>
                            <Form.Group className="form-group">
                              <Form.Control
                                onChange={(e) =>
                                  setFilter({
                                    ...filter,
                                    toPeriod: e.target.value,
                                    filterByDay: "",
                                  })
                                }
                                min={
                                  filter?.fromPeriod
                                    ? new Date(filter?.fromPeriod)
                                      .toISOString()
                                      .split("T")[0]
                                    : new Date()
                                }
                                disabled={filter.fromPeriod ? false : true}
                                max={new Date().toISOString().split("T")[0]}
                                value={filter.toPeriod}
                                type="date"
                              />
                              <Form.Control
                                className="small_form_control"
                                type="text"
                                placeholder="23:59"
                                disabled
                              />
                            </Form.Group>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <div className="history-btn mt-3">
                    <ul className="list-unstyled mb-0">
                      <li>
                        <Button
                          className={
                            // filter.filterByDay === "today"
                            //   ? "me-0 theme_dark_btn"
                            //   :
                            "me-0 theme_light_btn"
                          }
                          onClick={(e) =>
                            setFilter({
                              ...filter,
                              filterByDay: "today",
                            })
                          }
                        >
                          Just For Today
                        </Button>
                      </li>
                      <li>
                        <Button
                          className={
                            // filter.filterByDay === "yesterday"
                            //   ? "me-0 theme_dark_btn"
                            //   :
                            "me-0 theme_light_btn"
                          }
                          onClick={(e) =>
                            setFilter({
                              ...filter,
                              filterByDay: "yesterday",
                            })
                          }
                        >
                          From Yesterday
                        </Button>
                      </li>
                      <li>
                        <Button
                          className="theme_light_btn theme_dark_btn"
                          onClick={() => handleSearch("search")}
                        >
                          Search
                        </Button>
                      </li>
                      <li>
                        <Button
                          className="theme_light_btn"
                          onClick={() => {
                            setFilter({
                              type: "4",
                              betType: "betfair",
                              status: "completed",
                              fromPeriod: "",
                              toPeriod: "",
                              filterByDay: "",
                              page: 1,
                              limit: 100,
                            });
                            getData({
                              type: "4",
                              betType: "betfair",
                              status: "completed",
                              fromPeriod: "",
                              toPeriod: "",
                              filterByDay: "",
                              page: 1,
                              limit: 100,
                            });
                          }}
                        >
                          Reset
                        </Button>
                      </li>
                    </ul>
                  </div>
                  {/* <div className="find-member-sec mt-3">
                  <Form className="mb-4">
                    <Form.Group
                      className="position-relative mb-2 "
                      style={{ marginRight: "10px" }}
                    >
                      <Form.Control
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => {
                          filterData(e.target.value);
                        }}
                      />
                      <i className="fas fa-search"></i>
                    </Form.Group>
                </Form>
              </div> */}
                </div>
              </Form>

              <div className="batting-content">
                <p>
                  Betting History enables you to review the bets you have
                  placed. Specify the time period during which your bets were
                  placed, the type of markets on which the bets were placed, and
                  the sport.
                  <br />
                  Betting History is available online for the past 30 days.
                </p>
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
                        <th scope="col">Selection</th>
                        <th scope="col">Type</th>
                        {
                          filter?.betType != "casino" && <th scope="col">Odds req.</th>
                        }
                        <th scope="col">Stake </th>
                        {
                          filter?.betType != "casino" && <th scope="col">Liability</th>
                        }
                        <th scope="col"> Profit/Loss</th>
                      </tr>
                    </thead>
                    {data?.data && data?.data?.length > 0 ? (
                      data?.data?.map((item) => {
                        return (
                          <tr>
                            <td>{item?.clientName || "-"}</td>
                            <td>
                              {" "}
                              {getType === "3"
                                ? item?.casinoBetId
                                : item?.matchBetId || "-"}
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
                            <td>
                              {getBetType === "fancy" ? item?.betRun + "/" + item?.bhav : (getBetType === "sportBook") ? item?.runnerName : (getBetType === "casino") ? item?.platformTxId : item?.teamName}

                              {/* {item?.fancyName || item?.teamName || item?.platformTxId} */}
                            </td>

                            <td> {item?.betType || item?.type || item?.gameCode} </td>
                            {
                              filter?.betType != "casino" && <td> {getType === "3" ? 0 : item?.bhav || "-"} </td>}

                            <td> {filter?.betType != "casino" ? item?.amount : item?.betAmount} </td>
                            {
                              filter?.betType != "casino" && <td> {item?.loseAmount || "-"} </td>}

                            {/* <td> */}
                            {item?.status!=="voided" ?
                              filter?.betType != "casino" ?
                                <td className="text-end" >
                                  {getBetType == "betfair" ||
                                    getBetType === "Bookmaker" ||  getBetType === "toss" || getBetType === "tie" ? (
                                    <>
                                      {(item?.teamSelectionWin == item?.selectionId &&
                                        item?.betType == "back") ||
                                        (item?.teamSelectionWin != item?.selectionId &&
                                          item?.betType == "lay") ? (
                                        <span className="text-success">
                                          {item?.profitAmount}
                                        </span>
                                      ) : (
                                        <span className="text-danger">
                                          -({item?.loseAmount})
                                        </span>
                                      )}
                                    </>

                                  ) : getBetType === "sportBook" ? (
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
                                :
                                < td className="text-end" >
                                  {getBetType == "betfair" ||
                                    getBetType === "Bookmaker" ? (
                                    <>
                                      {(item?.teamSelectionWin == item?.selectionId &&
                                        item?.betType == "back") ||
                                        (item?.teamSelectionWin != item?.selectionId &&
                                          item?.betType == "lay") ? (
                                        <span className="text-success">
                                          {item?.profitAmount}
                                        </span>
                                      ) : (
                                        <span className="text-danger">
                                          -({item?.loseAmount})
                                        </span>
                                      )}
                                    </>

                                  ) : getBetType === "sportBook" ? (
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


                                      {Math.sign(item?.realCutAmount) === -1 ? (
                                        <span className="text-danger">
                                          ({helpers.currencyFormat(item?.realCutAmount)})
                                        </span>
                                      ) : (
                                        <span className="text-success">
                                          (
                                          {helpers.currencyFormat(
                                            Math.abs(item?.realCutAmount)
                                          )}
                                          )
                                        </span>
                                      )}

                                    </>
                                  )}
                                </td>
                                : <td>0.00</td>
                            }
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
          </div>
        </Container >
      </section >
    </div >
  );
};

export default BetList;
