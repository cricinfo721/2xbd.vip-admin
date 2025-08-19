import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { apiGet, apiPost } from "../utils/apiFetch";
import obj from "../utils/constants";
import apiPath from "../utils/apiPath";
import moment from "moment";
import ReactPaginate from "react-paginate";
import { useLocation, useParams, Link } from "react-router-dom";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
import { toast } from "wc-toast";
import constant from "../utils/constants";
import { compact, isEmpty, startCase } from "lodash";
import pathObj from "../utils/apiPath";
const CSetting = () => {
  const parmas = useParams();
  const location = useLocation();
  let { user } = useContext(AuthContext);
  const [percent, setPercent] = useState("");

  const submit = async () => {
    try {
      const { status, data: response_users } = await apiPost(
        pathObj.commissionSetting,
        {
          percent: percent,
        }
      );
      if (status == 200) {
        if (response_users.success) {
          toast.success(response_users.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <Row>
            <div className="db-sec">
              <h2 className="common-heading">Commission Setting</h2>
            </div>
            <Col md={12}>
              <div className="inner-wrapper">
                <Form className="bet_status">
                  <Row>
                    <Col xl={12} md={12}>
                      <Row>
                        <Col md={3} className="mb-2">
                          <Form.Group className="d-flex align-items-center find-member-sec ">
                            <Form.Label className="pe-2 mb-0 w-75">
                              Select Commission
                            </Form.Label>
                            <Form.Select
                              value={percent}
                              onChange={(e) => setPercent(e.target.value)}
                              aria-label="Default select example w-auto"
                            >
                              <option value="">Select Percent</option>
                              <option value="0">0%</option>
                              <option value="1">1%</option>
                              <option value="2">2%</option>
                              <option value="3">3%</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Button
                            onClick={() => {
                              if (!isEmpty(percent)) {
                                submit();
                              } else {
                                toast.error("Please select comission");
                              }
                            }}
                            className="btn btn-primary"
                          >
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default CSetting;
