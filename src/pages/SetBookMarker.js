import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
const SetBookMarker = () => {
  return (
    <div>
      <section className="set-limit-sec py-4">
        <Container fluid>
          <Form>
            <Row className="align-items-center">
              <h2 className="common-heading">Set BookMaker Header</h2>
              <Col xl={2} lg={3} sm={6} className="mb-2">
                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="pe-2 mb-0">Header </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Header"
                    value="BookMaker"
                  />
                </Form.Group>
              </Col>
              <Col xl={2} lg={3} sm={6} className="mb-2">
                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="pe-2 mb-0">Team1</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Team 1"
                    value="West Indies Women"
                  />
                </Form.Group>
              </Col>

              <Col xl={2} lg={3} sm={6} className="mb-2">
                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="pe-2 mb-0">Team2</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Team 2"
                    value="New Zealand Women"
                  />
                </Form.Group>
              </Col>

              <Col xl={2} lg={3} sm={6} className="mb-2">
                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="pe-2 mb-0 w-md-50">Team 3</Form.Label>
                  <Form.Control type="text" placeholder="Enter Team 3" />
                </Form.Group>
              </Col>

              <Col lg={2} md={3} className="mb-2">
                <Button className="green-btn">Set Headers</Button>
              </Col>
            </Row>
            <Row className="align-items-center">
              <h2 className="common-heading">Data BookMaker Header</h2>
              <Col xl={2} lg={3} sm={6} className="mb-2">
                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="pe-2 mb-0">Header </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Header"
                    value="BookMaker"
                  />
                </Form.Group>
              </Col>
              <Col xl={2} lg={3} sm={6} className="mb-2">
                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="pe-2 mb-0">Team1</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Team 1"
                    value="West Indies Women"
                  />
                </Form.Group>
              </Col>

              <Col xl={2} lg={3} sm={6} className="mb-2">
                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="pe-2 mb-0">Team2</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Team 2"
                    value="New Zealand Women"
                  />
                </Form.Group>
              </Col>

              <Col xl={2} lg={3} sm={6} className="mb-2">
                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="pe-2 mb-0 w-md-50">Team 3</Form.Label>
                  <Form.Control type="text" placeholder="Enter Team 3" />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </section>
    </div>
  );
};

export default SetBookMarker;
