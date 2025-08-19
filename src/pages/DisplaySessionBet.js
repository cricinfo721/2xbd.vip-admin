import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { apiGet } from "../utils/apiFetch";
import obj from "../utils/constants";
import apiPath from "../utils/apiPath";
import ReactPaginate from "react-paginate";
import { Link, useParams } from "react-router-dom";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
const DisplaySessionBet = () => {
  let { user } = useContext(AuthContext);
  const [filter, setFilter] = useState({
    clientId: "",
    sessionId: "",
    matchId: "",
  });

  const [data, setData] = useState([]);
  const [clientDropData, setClientDropData] = useState([]);
  const [sessionDropData, setSessionDropData] = useState([]);

  const parmas = useParams();
  const getData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.eventSessionBets + "?eventId=" + parmas.eventId
    );
    if (status === 200) {
      if (response_users.success) {
        let clientDataAr = [];
        const clientListData = response_users.results.map((data) => {
          clientDataAr["userId"] = data.userId;
          clientDataAr["clientName"] = data.clientName;

          return clientDataAr;
        });
        setClientDropData(clientListData);

        let sessionDataAr = [];
        const sessionListData = response_users.results.map((data) => {
          sessionDataAr["fancyName"] = data.fancyName;

          return sessionDataAr;
        });
        setSessionDropData(sessionListData);

        if (filter.clientId || filter.sessionId || filter.matchId) {
          let fancyAfterfilter = response_users.results.filter(
            (el) =>
              el.userId == filter.clientId ||
              el.fancyName == filter.sessionId ||
              el.matchId == filter.matchId
          );

          setData(fancyAfterfilter);
        } else {
          setData(response_users.results);
        }
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Session Bet</h2>
          </div>
          <div className="inner-wrapper">
            <div className="common-container">
              <Form className="bet_status">
                <Row>
                  <Col lg={8}>
                    <Row>
                      <Col lg={3} sm={6} className="mb-lg-0 mb-3">
                        <div className="bet-sec">
                          <Form.Label>Select Client:</Form.Label>
                          <Form.Select
                            onChange={(e) =>
                              setFilter({
                                ...filter,
                                clientId: e.target.value,
                              })
                            }
                            value={filter.clientId}
                            aria-label="Default select example"
                          >
                            {" "}
                            <option value="">Select Client</option>
                            {clientDropData &&
                              clientDropData.length > 0 &&
                              clientDropData.map((item, index) => {
                                return (
                                  <option value={item.userId}>
                                    {item.clientName}
                                  </option>
                                );
                              })}
                          </Form.Select>
                        </div>
                      </Col>
                      <Col lg={3} sm={6} className="mb-lg-0 mb-3">
                        <div className="bet-sec">
                          <Form.Label>Select Session:</Form.Label>
                          <Form.Select
                            onChange={(e) =>
                              setFilter({
                                ...filter,
                                sessionId: e.target.value,
                              })
                            }
                            value={filter.sessionId}
                            aria-label="Default select example"
                          >
                            {" "}
                            <option value="">Select Session</option>
                            {sessionDropData &&
                              sessionDropData.length > 0 &&
                              sessionDropData.map((item, index) => {
                                return (
                                  <option value={item.fancyName}>
                                    {item.fancyName}
                                  </option>
                                );
                              })}
                          </Form.Select>
                        </div>
                      </Col>
                      <Col lg={3} sm={6} className="mb-lg-0 mb-3">
                        <div className="bet-sec">
                          <Form.Label>Enter Match Id:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Match Id..."
                            onChange={(e) => {
                              setFilter({
                                ...filter,
                                matchId: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </Col>
                      <Col lg={2} sm={6} className="mb-lg-0 mb-3">
                        <div className="history-btn mt-0">
                          <ul className="list-unstyled mb-0">
                            <li>
                              <Button
                                className="green-btn"
                                onClick={() => getData("search")}
                              >
                                Load
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Sr No.</th>
                        <th scope="col">Client</th>
                        <th scope="col">Session</th>
                        <th scope="col">Rate </th>
                        <th scope="col">Amount</th>
                        <th scope="col">Runs</th>
                        <th scope="col">Mode</th>
                        <th scope="col">No</th>
                        <th scope="col">Yes</th>
                        <th scope="col">Date & Time</th>
                      </tr>
                    </thead>
                    {data && data?.length > 0 ? (
                      data?.map((item, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td> {item?.clientName}</td>
                            <td> {item?.sessionBetId}</td>
                            <td> {item?.bhav}</td>
                            <td> {item?.amount}</td>
                            <td> {item?.betRun}</td>
                            <td> Fancy</td>
                            <td> {item?.type == "No" ? "No" : "N/A"}</td>
                            <td> {item?.type == "Yes" ? "Yes" : "N/A"}</td>
                            <td>
                              {" "}
                              {helpers.dateFormat(
                                item.timeInserted,
                                user.timeZone
                              )}
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
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default DisplaySessionBet;
