import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { apiGet } from "../utils/apiFetch";
import obj from "../utils/constants";
import apiPath from "../utils/apiPath";
import ReactPaginate from "react-paginate";
import { Link, useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import helpers from "../utils/helpers";

const ShowBetsCR = () => {
  let { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const parmas = useParams();
  const getData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.userEventsBets +
        "?eventId=" +
        parmas.eventId +
        "&userId=" +
        parmas.userId
    );
    if (status === 200) {
      if (response_users.success) {
        setData(response_users.results);
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
            <h2 className="common-heading">Show Bet</h2>
          </div>
          <div className="inner-wrapper">
            <div className="common-container">
              <Form className="bet_status">
                <Row>
                  <Col lg={4}>
                    <Row>
                      <Col
                        sm={12}
                        className="mb-lg-0 mb-3 d-flex justify-content-end"
                      >
                        <Link
                          to={"/MatchProfitLoss/" + parmas.eventId}
                          className="green-btn me-2"
                        >
                          Back
                        </Link>
                        <Link to="/BetListLive" className="green-btn me-2">
                          Live Match Bet
                        </Link>
                        <Link to="/rejected-bets" className="green-btn">
                          Rejected Bets
                        </Link>
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
                        <th scope="col">Sports</th>
                        <th scope="col"> Match Name</th>
                        <th scope="col">Client</th>
                        <th scope="col">Type </th>
                        <th scope="col">Selection</th>
                        <th scope="col">Result</th>
                        <th scope="col">Odds</th>
                        <th scope="col">Stake</th>
                        <th scope="col">Place Time</th>
                        <th scope="col">IP</th>
                        <th scope="col">PnL</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    {data && data?.length > 0 ? (
                      data?.map((item, index) => {
                        return (
                          <tr>
                            <td>{item?.eventType}</td>
                            <td> {item?.matchName}</td>
                            <td> {item?.clientName}</td>
                            <td> {item?.betType}</td>
                            <td> {item?.selectionId}</td>
                            <td> {item?.isDeclared === true ? "Yes" : "No"}</td>
                            <td> {item?.bhav}</td>
                            <td> {item?.amount}</td>
                            <td>
                              {" "}
                              {helpers.dateFormat(
                                item.timeInserted,
                                user.timeZone
                              )}
                            </td>
                            <td> {(item?.ipAddress) && item?.ipAddress.replace("::ffff:","") || "-"}</td>
                            <td>
                              {" "}
                              {item?.isDeclared === true &&
                                item?.selectionId === item?.teamSelectionWin &&
                                item?.profitAmount}
                            </td>
                            <td> {item?.status}</td>
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

export default ShowBetsCR;
