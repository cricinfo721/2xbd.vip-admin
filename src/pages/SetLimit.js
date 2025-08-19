import { isEmpty } from "lodash";
import React, { useState } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "wc-toast";
import { apiPost } from "../utils/apiFetch";
import pathObj from "../utils/apiPath";
import obj from "../utils/constants";
const SetLimit = () => {
  const { id, type } = useParams();
  const loaction = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(
    isEmpty(loaction?.state) ? obj.settingArray : loaction?.state
  );
  const handelChange = (e, type, error) => {
    let temp = data.map((res) => {
      return res.type === type && e.target.name !== "onShow"
        ? { ...res, [e.target.name]: e.target.value, ["maxError"]: error }
        : res.type === type && e.target.name === "onShow"
        ? { ...res, onShow: e.target.checked ? "1" : "0" }
        : res;
    });
    setData(temp);
  };
  const onSubmit = async () => {
    let check = data.some((res) => res.maxError);
    let obj = {};
    if (type == "series") {
      obj = { seriesId: id };
    } else {
      obj = { eventId: id };
    }
    if (!check) {
      try {
        let response = await apiPost(pathObj.updateSettingLimit, {
          ...obj,
          data: data,
        });
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          //navigate("/sport-setting");
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <div>
      <section className="set-limit-sec py-4">
        <Container fluid>
          <Form>
            {data &&
              data?.map((item) => {
                return (
                  <Row className="align-items-center">
                    <h2 className="common-heading">
                      {obj.settingHeading[item.type]}
                    </h2>
                    <Col xl={2} lg={2} sm={6}>
                      <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Label className="pe-2 mb-0 w-lg-auto">
                          Min Amount
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="minAmount"
                          placeholder="Min Amount"
                          max={"2"}
                          value={item.minAmount}
                          onChange={(e) => {
                            if (
                              Number(e.target.value) > Number(item.maxAmount)
                            ) {
                              handelChange(e, item.type, true);
                            } else {
                              handelChange(e, item.type, false);
                            }
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col xl={2} lg={2} sm={6}>
                      <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Label className="pe-2 mb-0 w-lg-auto">
                          Max Amount
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="maxAmount"
                          placeholder="Max Amount"
                          value={item.maxAmount}
                          onChange={(e) => {
                            if (
                              Number(e.target.value) <= Number(item.minAmount)
                            ) {
                              handelChange(e, item.type, true);
                            } else {
                              handelChange(e, item.type, false);
                            }
                          }}
                        />
                      </Form.Group>
                      {item.maxError && (
                        <span style={{ color: "red", fontSize: "14px" }}>
                          Min amount should be greater than max amount
                        </span>
                      )}
                    </Col>

                    <Col xl={2} lg={2} sm={6}>
                      <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Label className="pe-2 mb-0">
                          Max Profit
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="maxProfit"
                          placeholder="Max Profit"
                          value={item.maxProfit}
                          onChange={(e) => handelChange(e, item.type)}
                        />
                      </Form.Group>
                    </Col>
                    <Col xl={2} lg={2} sm={6}>
                      <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Label className="pe-2 mb-0">
                          Odds Limit
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="oddsLimit"
                          placeholder="Odds Limit"
                          value={item.oddsLimit}
                          onChange={(e) => handelChange(e, item.type)}
                        />
                      </Form.Group>
                    </Col>

                    <Col xl={2} lg={2} sm={6}>
                      <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Label className="pe-2 mb-0">Bet Delay</Form.Label>
                        <Form.Control
                          type="number"
                          name="betDelay"
                          placeholder="Bet Delay"
                          value={item.betDelay}
                          onChange={(e) => handelChange(e, item.type)}
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={2} sm={6}>
                      <Form.Check
                        label="ON (IS SHOWING)"
                        className="mb-2"
                        name="onShow"
                        checked={item.onShow == 1 ? true : false}
                        onChange={(e) => handelChange(e, item.type)}
                      />
                    </Col>
                  </Row>
                );
              })}
          </Form>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button className="green-btn" onClick={onSubmit}>
              Set Limit
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default SetLimit;
