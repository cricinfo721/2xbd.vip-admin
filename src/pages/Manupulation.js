import React, { useState } from "react";
import {
  Button,
  Col,
  Row,
  Container,
  Form,
  Table,
  Modal,
} from "react-bootstrap";
const Manupulation = () => {
  const [detailMan, setDetailMan] = useState(false);
  const DetailManToggle = () => setDetailMan(!detailMan);

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="inner-wrapper">
            <div className="common-container">
              <Form className="bet_status bet-list-live">
                <Row>
                  <Col xl={12} md={12}>
                    <Row>
                      <Col
                        xxl={3}
                        lg={3}
                        md={6}
                        sm={6}
                        className="mb-lg-0 mb-3"
                      >
                        <div className="bet-sec">
                          <Form.Label className="pe-1">
                            Select target:
                          </Form.Label>
                          <Form.Select aria-label="Default select example">
                            <option>Select target</option>
                            <option value="1">Player ID</option>
                            <option value="2">Time</option>
                          </Form.Select>
                        </div>
                      </Col>
                      <Col
                        xxl={3}
                        lg={3}
                        md={6}
                        sm={6}
                        className="mb-lg-0 mb-3"
                      >
                        <div className="bet-sec">
                          <Form.Label className="pe-1">Select Type</Form.Label>
                          <Form.Select aria-label="Default select example">
                            <option>Select Type</option>
                            <option value="1">Ascending</option>
                            <option value="2">Ascending</option>
                          </Form.Select>
                        </div>
                      </Col>

                      <Col
                        xxl={3}
                        lg={3}
                        md={6}
                        sm={6}
                        className="mb-lg-0 mb-3"
                      >
                        <div className="bet-sec">
                          <Form.Label className="pe-1">Select Range</Form.Label>
                          <Form.Select aria-label="Default select example">
                            <option>Select Range</option>
                            <option>25 Txn</option>
                            <option>25 Txn</option>
                          </Form.Select>
                        </div>
                      </Col>
                      <Col xxl={2} lg={3} sm={6} className="mb-lg-0 mb-3">
                        <div className="bet-sec">
                          <Form.Label className="pe-1">Select Gap </Form.Label>
                          <Form.Select aria-label="Default select example">
                            <option>Select Gap</option>
                            <option>25 Txn</option>
                            <option>25 Txn</option>
                          </Form.Select>
                        </div>
                      </Col>

                      <Col xxl={1} className="m-auto">
                        <div className="text-xxl-end text-center mt-xxl-0 mt-lg-4 mt-2">
                          <Button className="green-btn">Submit</Button>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
              <div className="account-table batting-table mt-3">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">S.No.</th>
                        <th scope="col"> Odds Type</th>
                        <th scope="col">Type</th>
                        <th scope="col">Info </th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>#</td>
                        <td>Odds</td>
                        <td>Real</td>
                        <td>
                          <a href="#" onClick={DetailManToggle}>
                            Info
                          </a>
                        </td>
                        <td>IS OFF</td>
                      </tr>
                      <tr>
                        <td>#</td>
                        <td>Odds</td>
                        <td>Real</td>
                        <td>
                          <a href="#" onClick={DetailManToggle}>
                            Info
                          </a>
                        </td>
                        <td>IS OFF</td>
                      </tr>

                      <tr>
                        <td>#</td>
                        <td>Odds</td>
                        <td>Real</td>
                        <td>
                          <a href="#" onClick={DetailManToggle}>
                            Info
                          </a>
                        </td>
                        <td>IS OFF</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* detail-modal */}

      <Modal
        show={detailMan}
        onHide={DetailManToggle}
        className="change-status-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="modal-title-status">Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="exposure-content">
            <Table>
              <thead>
                <tr>
                  <th scope="col" width="50%">
                    Range
                  </th>
                  <th scope="col" width="50%" className="text-end">
                    Gap
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="2">---</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="secondary"
            className="green-btn"
            onClick={DetailManToggle}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* detail-modal */}
    </div>
  );
};

export default Manupulation;
