import React from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
const TransactionHistory = () => {
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
                  <span className="sua">SUA</span>
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
                <h2 className="common-heading">Transaction History</h2>

                <section className="account-table">
                  <div className="responsive transaction-history">
                    <Table>
                      <thead>
                        <tr>
                          <th scope="col">Date/Time</th>
                          <th scope="col">Deposit From Upline</th>
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
                          <td>12/05/2022 16:34:27</td>
                          <td>-</td>
                          <td>-</td>
                          <td>
                            <span className="text-danger">1.00</span>
                          </td>
                          <td>-</td>
                          <td>50400.00</td>
                          <td>-</td>
                          <td>
                            Admin{" "}
                            <span>
                              <i className="fas fa-arrow-right"></i>
                            </span>{" "}
                            test
                          </td>
                        </tr>
                        <tr>
                          <td>12/05/2022 16:34:27</td>
                          <td>
                            <span className="text-success">1</span>
                          </td>
                          <td>-</td>
                          <td>
                            <span className="text-danger">1.00</span>
                          </td>
                          <td>
                            {" "}
                            <span className="text-danger">0.00</span>
                          </td>
                          <td>50400.00</td>
                          <td>-</td>
                          <td>
                            Admin{" "}
                            <span>
                              <i className="fas fa-arrow-right"></i>
                            </span>{" "}
                            test
                          </td>
                        </tr>
                        <tr>
                          <td>12/05/2022 16:34:27</td>
                          <td>
                            <span className="text-success">1</span>
                          </td>
                          <td>-</td>
                          <td>
                            <span className="text-danger">1.00</span>
                          </td>
                          <td>
                            {" "}
                            <span className="text-danger">0.00</span>
                          </td>
                          <td>50400.00</td>
                          <td>-</td>
                          <td>
                            Admin{" "}
                            <span>
                              <i className="fas fa-arrow-right"></i>
                            </span>{" "}
                            test
                          </td>
                        </tr>
                        <tr>
                          <td>12/05/2022 16:34:27</td>
                          <td>
                            <span className="text-success">1</span>
                          </td>
                          <td>-</td>
                          <td>
                            <span className="text-danger">1.00</span>
                          </td>
                          <td>
                            {" "}
                            <span className="text-danger">0.00</span>
                          </td>
                          <td>50400.00</td>
                          <td>-</td>
                          <td>
                            Admin{" "}
                            <span>
                              <i className="fas fa-arrow-right"></i>
                            </span>{" "}
                            test
                          </td>
                        </tr>

                        <tr>
                          <td>12/05/2022 16:34:27</td>
                          <td>
                            <span className="text-success">1</span>
                          </td>
                          <td>-</td>
                          <td>
                            <span className="text-danger">1.00</span>
                          </td>
                          <td>
                            {" "}
                            <span className="text-danger">0.00</span>
                          </td>
                          <td>50400.00</td>
                          <td>-</td>
                          <td>
                            Admin{" "}
                            <span>
                              <i className="fas fa-arrow-right"></i>
                            </span>{" "}
                            test
                          </td>
                        </tr>

                        <tr>
                          <td>12/05/2022 16:34:27</td>
                          <td>
                            <span className="text-success">1</span>
                          </td>
                          <td>-</td>
                          <td>
                            <span className="text-danger">1.00</span>
                          </td>
                          <td>
                            {" "}
                            <span className="text-danger">0.00</span>
                          </td>
                          <td>50400.00</td>
                          <td>-</td>
                          <td>
                            Admin{" "}
                            <span>
                              <i className="fas fa-arrow-right"></i>
                            </span>{" "}
                            test
                          </td>
                        </tr>

                        <tr>
                          <td>12/05/2022 16:34:27</td>
                          <td>
                            <span className="text-success">1</span>
                          </td>
                          <td>-</td>
                          <td>
                            <span className="text-danger">1.00</span>
                          </td>
                          <td>
                            {" "}
                            <span className="text-danger">0.00</span>
                          </td>
                          <td>50400.00</td>
                          <td>-</td>
                          <td>
                            Admin{" "}
                            <span>
                              <i className="fas fa-arrow-right"></i>
                            </span>{" "}
                            test
                          </td>
                        </tr>

                        <tr>
                          <td>12/05/2022 16:34:27</td>
                          <td>
                            <span className="text-success">1</span>
                          </td>
                          <td>-</td>
                          <td>
                            <span className="text-danger">1.00</span>
                          </td>
                          <td>
                            {" "}
                            <span className="text-danger">0.00</span>
                          </td>
                          <td>50400.00</td>
                          <td>-</td>
                          <td>
                            Admin{" "}
                            <span>
                              <i className="fas fa-arrow-right"></i>
                            </span>{" "}
                            test
                          </td>
                        </tr>
                      </tbody>
                    </Table>
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

export default TransactionHistory;
