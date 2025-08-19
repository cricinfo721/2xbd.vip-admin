import React from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";

const StatementByUser = () => {
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <Row>
            <div className="db-sec">
              <h2 className="common-heading">Profit Loss</h2>
            </div>

            <Col md={12}>
              <div className="inner-wrapper">
                <Form className="bet_status">
                  <Row>
                    <Col xl={8} md={12}>
                      <Row>
                        <Col lg={6} sm={6} className="mb-lg-0 mb-3">
                          <div className="bet-sec bet-period">
                            <Form.Label>Period</Form.Label>
                            <Form.Group className="form-group">
                              <Form.Control
                                type="date"
                                className="w-50 mw-100"
                              />
                              <Form.Control
                                type="text"
                                placeholder="09:00"
                                className="w-50"
                              />
                            </Form.Group>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div>
                            <Button className="green-btn me-3">Apply</Button>
                            <Button className="green-btn bg-white">
                              Cancel
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>

                <div className="history-btn mt-3 d-flex justify-content-between">
                  <ul className="list-unstyled mb-0">
                    <li>
                      <a href="#" className="active">
                        Cricket
                      </a>
                    </li>
                    <li>
                      <a href="#" className="active">
                        Soccer
                      </a>
                    </li>
                    <li>
                      <a href="#" className="active">
                        Tennis
                      </a>
                    </li>
                  </ul>
                  <div className="find-member-sec">
                    <Form>
                      <Form.Group className="position-relative">
                        <Form.Control type="text" placeholder="Search...." />
                        <i className="fas fa-search"></i>
                      </Form.Group>
                    </Form>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={12} className="mt-4">
              <section className="account-table">
                <div className="responsive transaction-history">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">S.No.</th>
                        <th scope="col"> Match Name</th>
                        <th scope="col"> Match Date</th>
                        <th scope="col">Pnl+</th>
                        <th scope="col">Pnl-</th>
                        <th scope="col">Commission</th>
                        <th scope="col">Final P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td></td>
                        <td>Total</td>
                        <td></td>
                        <td>
                          {" "}
                          <span className="text-danger">-233.05</span>
                        </td>
                        <td>
                          {" "}
                          <span className="text-success">509.75</span>
                        </td>
                        <td>
                          {" "}
                          <span className="text-success">0.00</span>
                        </td>
                        <td>
                          <span className="text-success">276.70</span>
                        </td>
                      </tr>
                      <tr>
                        <td>1</td>
                        <td>
                          <a href="#">Galfi v Er Andreeva</a>
                        </td>
                        <td>2022-09-27 13:30:00</td>
                        <td>
                          {" "}
                          <span className="text-danger">-233.05</span>
                        </td>
                        <td>
                          <span className="text-success">509.75</span>
                        </td>

                        <td>
                          {" "}
                          <span className="text-success">0.00</span>
                        </td>
                        <td>
                          <span className="text-success">276.70</span>
                        </td>
                      </tr>
                      <tr>
                        <td>1</td>
                        <td>
                          <a href="#">Galfi v Er Andreeva</a>
                        </td>
                        <td>2022-09-27 13:30:00</td>
                        <td>
                          {" "}
                          <span className="text-danger">-233.05</span>
                        </td>
                        <td>
                          <span className="text-success">509.75</span>
                        </td>

                        <td>
                          {" "}
                          <span className="text-success">0.00</span>
                        </td>
                        <td>
                          <span className="text-success">276.70</span>
                        </td>
                      </tr>

                      <tr>
                        <td>2</td>
                        <td>
                          <a href="#">Galfi v Er Andreeva</a>
                        </td>
                        <td>2022-09-27 13:30:00</td>
                        <td>
                          {" "}
                          <span className="text-danger">-233.05</span>
                        </td>
                        <td>
                          <span className="text-success">509.75</span>
                        </td>

                        <td>
                          {" "}
                          <span className="text-success">0.00</span>
                        </td>
                        <td>
                          <span className="text-success">276.70</span>
                        </td>
                      </tr>

                      <tr>
                        <td>3</td>
                        <td>
                          <a href="#">Galfi v Er Andreeva</a>
                        </td>
                        <td>2022-09-27 13:30:00</td>
                        <td>
                          {" "}
                          <span className="text-danger">-233.05</span>
                        </td>
                        <td>
                          <span className="text-success">509.75</span>
                        </td>

                        <td>
                          {" "}
                          <span className="text-success">0.00</span>
                        </td>
                        <td>
                          <span className="text-success">276.70</span>
                        </td>
                      </tr>

                      <tr>
                        <td>4</td>
                        <td>
                          <a href="#">Galfi v Er Andreeva</a>
                        </td>
                        <td>2022-09-27 13:30:00</td>
                        <td>
                          {" "}
                          <span className="text-danger">-233.05</span>
                        </td>
                        <td>
                          <span className="text-success">509.75</span>
                        </td>

                        <td>
                          {" "}
                          <span className="text-success">0.00</span>
                        </td>
                        <td>
                          <span className="text-success">276.70</span>
                        </td>
                      </tr>

                      <tr>
                        <td>5</td>
                        <td>
                          <a href="#">Galfi v Er Andreeva</a>
                        </td>
                        <td>2022-09-27 13:30:00</td>
                        <td>
                          {" "}
                          <span className="text-danger">-233.05</span>
                        </td>
                        <td>
                          <span className="text-success">509.75</span>
                        </td>

                        <td>
                          {" "}
                          <span className="text-success">0.00</span>
                        </td>
                        <td>
                          <span className="text-success">276.70</span>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </section>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default StatementByUser;
