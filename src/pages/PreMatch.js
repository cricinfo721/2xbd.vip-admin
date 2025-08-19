import React, { useState, useEffect, useContext } from "react";
import { Container, Form, Table } from "react-bootstrap";
import { apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import "flatpickr/dist/themes/material_green.css";
import { Link } from "react-router-dom";
import helpers from "../utils/helpers";
import { startCase } from "lodash";
import AuthContext from "../context/AuthContext";
const PreMatch = () => {
  let { user } = useContext(AuthContext);

  const [matchData, setMatchData] = useState("");
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    gameType: "cricket",
  });

  const getMatchData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.resultsSetMarker,
      search_params
    );
    if (status === 200) {
      if (response_users.success) {
        setMatchData(response_users.results?.data);
      }
    }
  };

  useEffect(() => {
    getMatchData();
  }, [search_params]);

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Prematch P/L</h2>
          </div>

          <div className="inner-wrapper">
            <div className="common-container">
              <div className="bet_status mb-4">
                <div className="history-btn">
                  <ul className="list-unstyled mb-0">
                    <li>
                      <Link
                        href="#"
                        className={
                          search_params.gameType == "cricket" ? "active" : ""
                        }
                        onClick={(e) =>
                          setSearchParams({
                            ...search_params,
                            gameType: "cricket",
                          })
                        }
                      >
                        Cricket
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className={
                          search_params.gameType == "soccer" ? "active" : ""
                        }
                        onClick={(e) =>
                          setSearchParams({
                            ...search_params,
                            gameType: "soccer",
                          })
                        }
                      >
                        Soccer
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className={
                          search_params.gameType == "tennis" ? "active" : ""
                        }
                        onClick={(e) =>
                          setSearchParams({
                            ...search_params,
                            gameType: "tennis",
                          })
                        }
                      >
                        Tennis
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Sport</th>
                        <th scope="col">Event Id</th>
                        <th scope="col">Market ID</th>
                        <th scope="col">Match</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchData && matchData?.length > 0 ? (
                        matchData?.map((item, index) => {
                          return (
                            <tr>
                              <td>
                                {item?.gameType === "cricket" ? (
                                  <span className="text-success">
                                    {startCase(item?.gameType)}
                                  </span>
                                ) : item?.gameType === "soccer" ? (
                                  <span style={{ color: `#6f42c1` }}>
                                    {startCase(item?.gameType)}
                                  </span>
                                ) : (
                                  <span className="text-danger">
                                    {startCase(item?.gameType)}
                                  </span>
                                )}
                              </td>
                              <td>{item?.eventId}</td>
                              <td>{item?.marketId}</td>
                              <td>{item?.eventName}</td>
                              <td>
                                {helpers.dateFormat(
                                  item.eventDateTime,
                                  user.timeZone
                                )}
                              </td>
                              <td>{item?.status}</td>
                              <td>
                                <div className="d-flex flex-wrap align-items-center justify-content-center">
                                  <Form.Select
                                    aria-label="Default select example"
                                    className="w-25 me-3"
                                    value={search_params.gameType}
                                    onChange={(e) => {
                                      // setMatchOption({
                                      //   ...search_params,
                                      //   gameType: e.target.value,
                                      //   page: 1,
                                      // });
                                    }}
                                  >
                                    <option>Select Team</option>
                                    {item?.runners.length > 0 &&
                                      item?.runners.map((item1, index) => {
                                        return (
                                          <option value={item1?.SelectionId}>
                                            {" "}
                                            {item1?.RunnerName}{" "}
                                          </option>
                                        );
                                      })}
                                  </Form.Select>
                                  <div>
                                    <Link
                                      to={"/MatchProfitLoss/" + item?.eventId}
                                      className="green-btn"
                                    >
                                      View P/L
                                    </Link>
                                    <a href="#" className="green-btn">
                                      Master
                                    </a>
                                    <a href="#" className="green-btn">
                                      Cheat Ips
                                    </a>
                                    <Link
                                      to={"/DisplayMatchBet/" + item?.eventId}
                                      className="green-btn"
                                    >
                                      Match Bet
                                    </Link>
                                    <Link
                                      to={"/DisplaySessionBet/" + item?.eventId}
                                      className="green-btn"
                                    >
                                      Fancy Bet
                                    </Link>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={12}>
                            <span>No record found.</span>
                          </td>
                        </tr>
                      )}
                    </tbody>
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

export default PreMatch;
