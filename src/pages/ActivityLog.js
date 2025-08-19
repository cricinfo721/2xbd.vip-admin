import React from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";

const ActivityLog = () => {
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
                  <strong className="">test</strong>
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
                <h2 className="common-heading">Activity Log</h2>

                <section className="account-table">
                  <div className="responsive transaction-history">
                    <Table>
                      <thead>
                        <tr>
                          <th scope="col">Login Date & Time</th>
                          <th scope="col">Login Status</th>
                          <th scope="col">IP Address</th>
                          <th scope="col">ISP</th>
                          <th scope="col">City/State/Country</th>
                          <th scope="col">User Agent Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>03-07-2022 19:31:10</td>
                          <td>
                            {" "}
                            <span className="text-success">Login - -</span>
                          </td>
                          <td>115.99.249.178</td>

                          <td>-</td>
                          <td>-, -</td>
                          <td>Browser</td>
                        </tr>
                        <tr>
                          <td>03-07-2022 19:31:10</td>
                          <td>
                            {" "}
                            <span className="text-success">Login - -</span>
                          </td>
                          <td>115.99.249.178</td>

                          <td>-</td>
                          <td>-, -</td>
                          <td>Browser</td>
                        </tr>

                        <tr>
                          <td>03-07-2022 19:31:10</td>
                          <td>
                            {" "}
                            <span className="text-success">Login - -</span>
                          </td>
                          <td>115.99.249.178</td>

                          <td>-</td>
                          <td>-, -</td>
                          <td>Browser</td>
                        </tr>

                        <tr>
                          <td>03-07-2022 19:31:10</td>
                          <td>
                            {" "}
                            <span className="text-success">Login - -</span>
                          </td>
                          <td>115.99.249.178</td>

                          <td>-</td>
                          <td>-, -</td>
                          <td>Browser</td>
                        </tr>

                        <tr>
                          <td>03-07-2022 19:31:10</td>
                          <td>
                            {" "}
                            <span className="text-success">Login - -</span>
                          </td>
                          <td>115.99.249.178</td>

                          <td>-</td>
                          <td>-, -</td>
                          <td>Browser</td>
                        </tr>

                        <tr>
                          <td>03-07-2022 19:31:10</td>
                          <td>
                            {" "}
                            <span className="text-success">Login - -</span>
                          </td>
                          <td>115.99.249.178</td>

                          <td>-</td>
                          <td>-, -</td>
                          <td>Browser</td>
                        </tr>

                        <tr>
                          <td>03-07-2022 19:31:10</td>
                          <td>
                            {" "}
                            <span className="text-success">Login - -</span>
                          </td>
                          <td>115.99.249.178</td>

                          <td>-</td>
                          <td>-, -</td>
                          <td>Browser</td>
                        </tr>

                        <tr>
                          <td>03-07-2022 19:31:10</td>
                          <td>
                            {" "}
                            <span className="text-success">Login - -</span>
                          </td>
                          <td>115.99.249.178</td>

                          <td>-</td>
                          <td>-, -</td>
                          <td>Browser</td>
                        </tr>

                        <tr>
                          <td>03-07-2022 19:31:10</td>
                          <td>
                            {" "}
                            <span className="text-success">Login - -</span>
                          </td>
                          <td>115.99.249.178</td>

                          <td>-</td>
                          <td>-, -</td>
                          <td>Browser</td>
                        </tr>

                        <tr>
                          <td>03-07-2022 19:31:10</td>
                          <td>
                            {" "}
                            <span className="text-success">Login - -</span>
                          </td>
                          <td>115.99.249.178</td>

                          <td>-</td>
                          <td>-, -</td>
                          <td>Browser</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </section>

                {/* profile */}

                <h2>profile</h2>

                <div className="account-table">
                  <div className="profile-tab">
                    <Row>
                      <Col md={7}>
                        <Table>
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                colSpan="4"
                                className="text-start"
                              >
                                About You
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="text-start" width="25%">
                                First Name
                              </td>
                              <td className="text-start" colSpan="3">
                                test
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start" width="25%">
                                Last Name
                              </td>
                              <td className="text-start" colSpan="3"></td>
                            </tr>

                            <tr>
                              <td className="text-start" width="25%">
                                Birthday
                              </td>
                              <td className="text-start" colSpan="3">
                                -----
                              </td>
                            </tr>

                            <tr>
                              <td className="text-start" width="25%">
                                Email
                              </td>
                              <td className="text-start" colSpan="3">
                                anurag.008bhrdawj@gmail.com
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start" width="25%">
                                Password
                              </td>
                              <td className="text-start">************</td>
                              <td>
                                <a href="#" className="text-decoration-none">
                                  Edit{" "}
                                  <i className="fas fa-pen text-white ps-1"></i>
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start" width="25%">
                                Time Zone
                              </td>
                              <td className="text-start" colSpan="3">
                                IST
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>

                      <Col md={5}>
                        <Table>
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                colSpan="4"
                                className="text-start"
                              >
                                Contact Details
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="text-start">Primary Number</td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </div>
                </div>

                {/* profile */}

                {/* acccount-statement */}

                <h2>Account statement Tab</h2>

                <h2 className="common-heading">Account Statement</h2>

                <section className="account-table">
                  <div className="responsive transaction-history">
                    <Table>
                      <thead>
                        <tr>
                          <th scope="col">Date/Time</th>
                          <th scope="col">Deposit From Upline </th>
                          <th scope="col">Deposit to Downline</th>
                          <th scope="col">WihtDraw By Upline</th>
                          <th scope="col">WithDraw From Downline</th>
                          <th scope="col">Balance</th>
                          <th scope="col">Remark</th>
                          <th scope="col">From/To</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>03-07-2022 19:31:10</td>
                          <td>
                            {" "}
                            <span className="text-success">Login - -</span>
                          </td>
                          <td>115.99.249.178</td>

                          <td>-</td>
                          <td>-, -</td>
                          <td>Browser</td>
                          <td>Browser</td>
                          <td>Browser</td>
                        </tr>
                        <tr>
                          <td>03-07-2022 19:31:10</td>
                          <td>
                            {" "}
                            <span className="text-success">Login - -</span>
                          </td>
                          <td>115.99.249.178</td>

                          <td>-</td>
                          <td>-, -</td>
                          <td>Browser</td>
                          <td>Browser</td>
                          <td>Browser</td>
                        </tr>

                        <tr>
                          <td>03-07-2022 19:31:10</td>
                          <td>
                            {" "}
                            <span className="text-success">Login - -</span>
                          </td>
                          <td>115.99.249.178</td>

                          <td>-</td>
                          <td>-, -</td>
                          <td>Browser</td>
                          <td>Browser</td>
                          <td>Browser</td>
                        </tr>

                        <tr>
                          <td>03-07-2022 19:31:10</td>
                          <td>
                            {" "}
                            <span className="text-success">Login - -</span>
                          </td>
                          <td>115.99.249.178</td>

                          <td>-</td>
                          <td>-, -</td>
                          <td>Browser</td>
                          <td>Browser</td>
                          <td>Browser</td>
                        </tr>

                        <tr>
                          <td>03-07-2022 19:31:10</td>
                          <td>
                            {" "}
                            <span className="text-success">Login - -</span>
                          </td>
                          <td>115.99.249.178</td>

                          <td>-</td>
                          <td>-, -</td>
                          <td>Browser</td>
                          <td>Browser</td>
                          <td>Browser</td>
                        </tr>

                        <tr>
                          <td>03-07-2022 19:31:10</td>
                          <td>
                            {" "}
                            <span className="text-success">Login - -</span>
                          </td>
                          <td>115.99.249.178</td>

                          <td>-</td>
                          <td>-, -</td>
                          <td>Browser</td>
                          <td>Browser</td>
                          <td>Browser</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </section>

                {/* acccount-statement */}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default ActivityLog;
