import React from "react";
import { Container, Col, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
const AprofitAndLoss = () => {
  return (
    <div>
      <section className="py-4 main-inner-outer">
        <Container fluid>
          <div className="agent-path mb-4">
            <ul className="m-0 list-unstyled">
              <li>
                <a href="#">
                  <span>A</span>
                  <strong>admin</strong>
                </a>
              </li>
              <li>
                <a href="#">
                  <span>SUA</span>
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
                <h2 className="common-heading">Account Summary</h2>
                <div className="user-test mb-2">
                  <i className="fas fa-user"></i> <strong>test</strong>
                </div>

                <section className="account-table">
                  <div className="responsive">
                    <Table>
                      <thead>
                        <tr>
                          <th scope="col">Wallet</th>
                          <th scope="col">Available to Bet </th>
                          <th scope="col">Funds available to withdraw </th>
                          <th scope="col">Current exposure</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Main wallet</td>
                          <td>50,400.00</td>
                          <td>50,400.00</td>
                          <td>0.00</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>

                  <div className="profile-tab">
                    <Row>
                      <Col lg={7} md={12}>
                        <h2 className="common-heading">Profile</h2>
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

                        {/* contact-details */}

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

                        {/* contact-details */}
                      </Col>
                    </Row>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AprofitAndLoss;
