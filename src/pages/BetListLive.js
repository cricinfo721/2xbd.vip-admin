import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import obj from "../utils/constants";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
import { get, isEmpty } from "lodash";
const BetListLive = () => {
  let { user } = useContext(AuthContext);
  const [unmatched, setUnmatched] = useState("");
  const [getBetType, setBetType] = useState("betfair");
  const [getType, setType] = useState("4");
  const [filter, setFilter] = useState({
    type: "4",
    betType: "betfair",
    sortType: "amount",
    sortOrder: "asc",
    last: 25,
    refereshTime: 15,
    status: "active",
  });
  const [check, setCheck] = useState(true);
  const [data, setData] = useState([]);
  const getData = async (type = "search") => {
    const { status, data: response_users } = await apiGet(
      apiPath.getBetslive,
      type == "search" ? filter : type
    );
    if (status === 200) {
      if (response_users.success) {
        if (filter.betType == "betfair" && type == "search") {
          setCheck(true);
        } else if (type.betType == "betfair") {
          setCheck(true);
        } else {
          setCheck(false);
        }
        setBetType(filter.betType);
        setType(filter.type);
        let temp = response_users?.results?.filter((res) => !res.isMatched);
        setUnmatched(temp);
        setData(response_users?.results);
      }
    }
  };
  useEffect(() => {
    getData();
  }, []);
//   useEffect(() => {
    
//     if(filter?.refereshTime){
//       const intervalID = setInterval(() =>  {
//         getData();
//      }, filter?.refereshTime*1000);
 
//      return () => clearInterval(intervalID);
//     }
    
// }, [filter?.refereshTime]);
  
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Bet List Live</h2>
          </div>
          <div className="inner-wrapper">
            <div className="common-container">
              <Form className="bet_status bet-list-live">
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
                </div>

                <div className="bet_outer">
                  <div className="bet-sec">
                    <Form.Label>Order of display:</Form.Label>
                    <Form.Select
                      className="small_select"
                      onChange={(e) =>
                        setFilter({ ...filter, sortType: e.target.value })
                      }
                      value={filter.sortType}
                      aria-label="Default select example"
                    >
                      <option value="amount">Stake</option>
                      <option value="timeInserted">Time</option>
                    </Form.Select>
                  </div>

                  <div className="bet-sec bet-period">
                    <Form.Label>of</Form.Label>
                    <Form.Select
                      className="small_select"
                      onChange={(e) =>
                        setFilter({
                          ...filter,
                          sortOrder: e.target.value,
                        })
                      }
                      value={filter.sortOrder}
                      aria-label="Default select example"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Decending</option>
                    </Form.Select>
                  </div>

                  <div className="bet-sec bet-period">
                    <Form.Label>Last</Form.Label>
                    <Form.Select
                      className="small_select"
                      onChange={(e) =>
                        setFilter({ ...filter, last: e.target.value })
                      }
                      value={filter.last}
                      aria-label="Default select example"
                    >
                      <option value={25}>25 Txn</option>
                      <option value={50}>50 Txn</option>
                      <option value={100}>100 Txn</option>
                      <option value={200}>200 Txn</option>
                      <option value={""}>All</option>
                    </Form.Select>
                  </div>

                  <div className="bet-sec bet-period">
                    <Form.Label>Auto Refresh (Seconds) </Form.Label>
                    <Form.Select
                      className="small_select"
                      onChange={(e) =>
                        setFilter({ ...filter, refereshTime: e.target.value })
                      }
                      value={filter?.refereshTime}
                      aria-label="Default select example"
                    >
                      <option value="">Stop</option>
                      <option value={60} >60</option>
                      <option value={30}>30</option>
                      <option value={15}>15</option>
                      <option value={5}>5</option>
                      <option value={2}>2</option>
                    </Form.Select>
                  </div>

                  <div className="bet-sec">
                    <Form.Label>Bet Status:</Form.Label>
                    <Form.Select
                      className="small_select"
                      onChange={(e) =>
                        setFilter({ ...filter, status: e.target.value })
                      }
                      value={filter.status}
                      aria-label="Default select example"
                    >
                      <option value={"active"}>Active</option>
                      <option value={"suspend"}>Suspend</option>
                    </Form.Select>
                  </div>

                  <div style={{ display: "flex" }}>
                    <Button
                      className="theme_dark_btn"
                      style={{ marginRight: "10px" }}
                      onClick={() => getData("search")}
                    >
                      Search
                    </Button>
                    <Button
                      className="theme_light_btn"
                      onClick={() => {
                        setFilter({
                          type: "4",
                          betType: "betfair",
                          sortType: "amount",
                          sortOrder: "",
                          last: 25,
                          status: "active",
                        });
                        getData({
                          type: "4",
                          betType: "betfair",
                          sortType: "amount",
                          sortOrder: "",
                          last: 25,
                          status: "active",
                        });
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </Form>

              <div className="batting-content">
                <p>
                  Betting History enables you to review the bets you have
                  placed. Specify the time period during which your bets were
                  placed, the type of markets on which the bets were placed, and
                  the sport.
                </p>
                <p>Betting History is available online for the past 30 days.</p>
              </div>
              {check && data.some((res) => res.isMatched || !res.isMatched) ? (
                <div className="account-table">
                  <caption className="d-block text-start">UnMatched</caption>
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
                          <th scope="col">Odds req.</th>
                          <th scope="col">Stake </th>
                          <th scope="col">Liability</th>
                        </tr>
                      </thead>
                      {unmatched && unmatched?.length > 0 ? (
                        unmatched?.map((item) => {
                          if (!item.isMatched) {
                            return (
                              <tr>
                                <td>{item?.clientName || "-"}</td>
                                <td>
                                  {" "}
                                  {getType === "3"
                                    ? item?.casinoBetId
                                    : (getBetType === "fancy") ? item?.sessionBetId : item?.matchBetId || "-"}
                                </td>
                                <td className="text-start">
                                  {obj.betCheckObj[Number(getType)]}
                                  <span className="angle_unicode">▸</span>
                                  <strong>{item?.matchName}</strong>
                                  <span className="angle_unicode">▸</span>
                                  {getBetType === "betfair" &&
                                    "Match Odds"}{" "}
                                  {getBetType === "Bookmaker" && "Book Maker"}
                                  {getBetType === "sportBook" && "Sport Book"}
                                  {getBetType === "fancy" &&
                                    item?.fancyName}{" "}
                                </td>
                                {/* <td>{item?.eventId || "-"}</td> */}

                                <td>
                                  {" "}
                                  {helpers.dateFormat(
                                    item?.timeInserted,
                                    user.timeZone
                                  )}
                                </td>
                                <td> {(item?.ipAddress) && item?.ipAddress.replace("::ffff:","") || "-"}</td>
                                <td> <td> {(getBetType === "fancy") ? item?.selectionId : item?.teamName || "-"}</td></td>
                                <td> {item?.betType || item?.type} </td>
                                <td> {item?.bhav || "-"} </td>
                                <td> {item?.amount || "-"} </td>
                                <td> {item.betType == "back" ? item?.profitAmount : item?.loseAmount} </td>
                              </tr>
                            );
                          }
                        })
                      ) : (
                        <tr>
                          <td colSpan={10}>
                            <span>You have no bets in this time period.</span>
                          </td>
                        </tr>
                      )}
                    </Table>
                  </div>
                </div>
              ) : null}
              <div className="account-table batting-table">
                <caption className="d-block text-start">Matched</caption>
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
                          filter?.betType != "casino" && <><th scope="col">Liability</th><th scope="col"> Profit/Loss</th></>
                        }

                      </tr>
                    </thead>
                    {filter?.betType != "casino" && data && data?.length > 0 ? (
                      data?.map((item) => {
                        if (item.isMatched || !isEmpty(item?.fancyName)) {
                          return (
                            <tr>
                              <td>{item?.clientName || "-"}</td>
                              <td>
                                {" "}
                                {getType === "3"
                                  ? item?.casinoBetId
                                  : (getBetType === "fancy") ? item?.sessionBetId : item?.matchBetId || "-"}
                              </td>
                              <td>
                                {" "}
                                {helpers.dateFormat(
                                  item?.timeInserted,
                                  user.timeZone
                                )}
                              </td>
                              <td> {(item?.ipAddress) && item?.ipAddress.replace("::ffff:","") || "-"}</td>
                              <td className="text-start">
                                {obj.betCheckObj[Number(getType)]}
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

                                {/* {(getBetType === "fancy") ? item?.selectionId : item?.teamName || "-"} */}
                              </td>
                              <td> {item?.betType || item?.type} </td>
                              <td>
                                {" "}
                                {getType === "3" ? 0 : item?.bhav || "-"}{" "}
                              </td>
                              <td> {item?.amount || "-"} </td>
                              <td> {item?.loseAmount || "-"} </td>
                              <td>
                                {getType === "3" ? (
                                  Math.sign(item?.playerPL) === -1 ? (
                                    <span className="text-danger">
                                      ({helpers.currencyFormat(item?.playerPL)})
                                    </span>
                                  ) : (
                                    <span className="text-success">
                                      (
                                      {helpers.currencyFormat(
                                        Math.abs(item?.playerPL)
                                      )}
                                      )
                                    </span>
                                  )
                                ) : item?.betType == "back" || item?.type == "Yes" ? (
                                  <span className="text-success">
                                    {item?.profitAmount}
                                  </span>
                                ) : (
                                  <span className="text-danger">
                                    -({item?.loseAmount})
                                  </span>
                                )}
                              </td>
                            </tr>
                          )
                        }
                      })
                    ) : (
                      null
                    )}

                    {filter?.betType == "casino" && data && data?.length > 0 ? (
                      data?.map((item) => {

                        return (
                          <tr>
                            <td>{item?.clientName || "-"}</td>
                            <td>
                              {" "}
                              {item?.casinoBetId}
                            </td>
                            <td>
                              {" "}
                              {helpers.dateFormat(
                                item?.timeInserted,
                                user.timeZone
                              )}
                            </td>
                            <td> {(item?.ipAddress) && item?.ipAddress.replace("::ffff:","") || "-"}</td>
                            <td className="text-start">
                              {obj.betCheckObj[Number(getType)]}
                              <span className="angle_unicode">▸</span>
                              <strong>
                                {getType === "3"
                                  ? item?.casinoName
                                  : item?.matchName}
                              </strong>
                              <span className="angle_unicode">▸</span>
                              {getBetType === "betfair" && "Match Odds"}{" "}
                              {getBetType === "Bookmaker" && "Book Maker"}
                              {getBetType === "sportBook" && "Sport Book"}
                              {getBetType === "fancy" && item?.fancyName}{" "}
                              {getBetType === "casino" && item?.casinoType}{" "}
                            </td>
                            <td> {item?.platformTxId}</td>
                            <td> {item?.gameCode} </td>
                            <td> {item?.betAmount || "-"} </td>

                            {/* <td>
                              {getType === "3" ? (
                                Math.sign(item?.playerPL) === -1 ? (
                                  <span className="text-danger">
                                    ({helpers.currencyFormat(item?.playerPL)})
                                  </span>
                                ) : (
                                  <span className="text-success">
                                    (
                                    {helpers.currencyFormat(
                                      Math.abs(item?.playerPL)
                                    )}
                                    )
                                  </span>
                                )
                              ) : item?.betType == "back" || item?.type == "Yes" ? (
                                <span className="text-success">
                                  {item?.profitAmount}
                                </span>
                              ) : (
                                <span className="text-danger">
                                  -({item?.loseAmount})
                                </span>
                              )}
                            </td> */}
                          </tr>
                        )

                      })
                    ) : (
                      null
                    )}
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default BetListLive;
