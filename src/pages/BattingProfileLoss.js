import React from "react";
import { Container, Col, Row, Table, Tabs, Tab, Form } from "react-bootstrap";
import Sidebar from "../components/Sidebar";

const BattingProfileLoss = () => {
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
                <h2 className="common-heading">
                  Betting Profit & Loss : Main wallet
                </h2>
                <div className="user-test mb-2">
                  <i className="fas fa-user"></i> <strong>test</strong>
                </div>
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
                            <Col md={12}>
                              <Row>
                                <Col
                                  lg={4}
                                  sm={6}
                                  xs={12}
                                  className="mb-sm-0 mb-3"
                                >
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
                                <Col
                                  lg={4}
                                  sm={6}
                                  xs={12}
                                  className="mb-sm-0 mb-3"
                                >
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
                                  Get P & L
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
                        <div className="account-table">
                          <div className="d-flex justify-content-between align-items-center betting-profile-sec mb-3">
                            <h2 className="common-heading mb-md-0 mb-3">
                              Betting Profit & Loss : Main wallet
                            </h2>

                            <Form className="d-flex align-items-center">
                              <Form.Select aria-label="Default select example">
                                <option>All</option>
                                <option value="1">Soccer</option>
                                <option value="2">Tennis</option>
                                <option value="3">Cricket</option>
                              </Form.Select>

                              <h4>BDT (0.00)</h4>
                            </Form>
                          </div>
                          <div className="responsive">
                            <Table>
                              <thead>
                                <tr>
                                  <th
                                    scope="col"
                                    width="70%"
                                    className="text-start"
                                  >
                                    Market
                                  </th>
                                  <th scope="col">Settled date</th>
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
                            <span>
                              Profit and Loss is shown net of commission.
                            </span>
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

                    <Tab eventKey="Casino" title="Casino">
                      5
                    </Tab>

                    <Tab eventKey="Sportsbook" title="Sportsbook">
                      6
                    </Tab>

                    <Tab eventKey="BookMaker" title="BookMaker">
                      7
                    </Tab>
                    <Tab eventKey="BPoker" title="BPoker">
                      8
                    </Tab>
                    <Tab eventKey="Premium" title="Premium">
                      9
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

export default BattingProfileLoss;
