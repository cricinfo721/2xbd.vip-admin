import React from "react";
import { Container, Row, Col, Tabs, Tab, Form, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";

const BattingHistory = () => {
  return (
    <div>
      <section className="py-4 main-inner-outer">
        <Container fluid>
          <div className="agent-path mb-4">
            <ul className="m-0 list-unstyled">
              <li>
                <a href="#">
                  <span className="sua orange_bg">A</span>
                  <strong>admin</strong>
                </a>
              </li>
              <li>
                <a href="#">
                  <span className="sua lv_1">SUA</span>
                  <strong>test</strong>
                </a>
              </li>
            </ul>
          </div>
          <div className="accout_cols_outer">
            <div className="left_side">
              <Sidebar />
            </div>
            <div className="right_side">
              <div className="inner-wrapper">
                <h2 className="common-heading">Betting History</h2>
                <div className="common-tab">
                  <Tabs
                    id="controlled-tab-example"
                    defaultActiveKey="Exchange"
                    className=""
                  >
                    <Tab eventKey="Exchange" title="Exchange">
                      <div className="common-container">
                        <Form className="bet_status">
                          <Row>
                            <Col xl={11} md={12}>
                              <Row>
                                <Col lg={4} sm={6} className="mb-lg-0 mb-3">
                                  <div className="bet-sec">
                                    <Form.Label>Bet Status:</Form.Label>
                                    <Form.Select aria-label="Default select example">
                                      <option>Settled</option>
                                      <option value="1">Cancelled</option>
                                      <option value="2">Voided</option>
                                    </Form.Select>
                                  </div>
                                </Col>
                                <Col lg={4} sm={6} className="mb-lg-0 mb-3">
                                  <div className="bet-sec bet-period">
                                    <Form.Label className="me-2 mt-2">Period</Form.Label>
                                    <Form.Group className="form-group">
                                      <Form.Control type="date" />
                                      <Form.Control
                                        type="text"
                                        placeholder="09:00"
                                      />
                                    </Form.Group>
                                  </div>
                                </Col>
                                <Col lg={4} sm={6} className="mb-lg-0 mb-3">
                                  <div className="bet-sec bet-period">
                                    <Form.Label>Period</Form.Label>
                                    <Form.Group className="form-group">
                                      <Form.Control type="date" />
                                      <Form.Control
                                        type="text"
                                        placeholder="09:00"
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
                                <a href="#">Just For Today</a>
                              </li>
                              <li>
                                <a href="#">From Yesterday</a>
                              </li>
                              <li>
                                <a href="#" className="active">
                                  Get History
                                </a>
                              </li>
                            </ul>
                          </div>
                        </Form>

                        <div className="batting-content">
                          <p>
                            Betting History enables you to review the bets you
                            have placed. Specify the time period during which
                            your bets were placed, the type of markets on which
                            the bets were placed, and the sport.
                          </p>
                          <p>
                            Betting History is available online for the past 30
                            days.
                          </p>
                        </div>
                        <div className="account-table batting-table">
                          <div className="responsive">
                            <Table>
                              <thead>
                                <tr>
                                  <th scope="col" width="10%">
                                    Bet ID
                                  </th>
                                  <th scope="col">PL ID </th>
                                  <th scope="col">Market</th>
                                  <th scope="col">Selection </th>
                                  <th scope="col">Type</th>
                                  <th scope="col">Bet placed</th>
                                  <th scope="col">Odds req.</th>
                                  <th scope="col">Stake</th>
                                  <th scope="col">Avg. odds matched</th>
                                  <th scope="col">Profit/Loss</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td
                                    colSpan="10"
                                    className="text-md-center text-start
                                  "
                                  >
                                    You have no bets in this time period
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab eventKey="FancyBet" title="FancyBet">
                      2nd
                    </Tab>
                    <Tab eventKey="Fancy1Bet" title="Fancy1Bet">
                      3rd
                    </Tab>

                    <Tab eventKey="Toss" title="Toss">
                      4
                    </Tab>

                    <Tab eventKey="Casino" title="Casino Be">
                      5
                    </Tab>

                    <Tab eventKey="Sportsbook" title="Sportsbook">
                      6
                    </Tab>

                    <Tab eventKey="BookMaker" title="BookMaker">
                      7
                    </Tab>
                    <Tab eventKey="Premium" title="Premium">
                      8
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
        </div>
        </Container>
      </section>
    </div>
  );
};

export default BattingHistory;
