import React, { useEffect, useState } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { toast } from "wc-toast";
import { apiGet, apiPost } from "../utils/apiFetch";
import pathObj from "../utils/apiPath";
import obj from "../utils/constants";
const DefaultSetting = () => {
  const [data, setData] = useState(obj.settingArray);
  const [select, setSelect] = useState("cricket");
  const [getInplay, setInplay] = useState(0);
  const [getInplayId, setInplayId] = useState("");
  const [getInplayData, setInplayData] = useState({});

  const handelInPlay = (value, error) => {
    setInplay(value);
  };

  const handelChange = (e, type, error) => {
    let temp = data.map((res) => {
      return res.type === type && e.target.name !== "onShow"
        ? {
            ...res,
            [e.target.name]: Number(e.target.value),
            ["maxError"]: error,
          }
        : res.type === type && e.target.name === "onShow"
        ? { ...res, onShow: e.target.checked ? "1" : "0" }
        : res;
    });
    setData(temp);
  };
  const onSubmit = async (type) => {
    let result = data.filter((res) => res.type === type);
    if (!result[0].maxError) {
      try {
        let response = await apiPost(pathObj.updateDefaultSetting, {
          ...result[0],
          sportType: select,
        });
        if (response?.data?.success) {
          getData();
          toast.success(response?.data?.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  const onSubmit1 = async () => {
    try {
      let response = await apiPost(
        pathObj.siteSettingUpdate + "/" + getInplayId,
        {
          fieldValue: getInplay,
        }
      );
      if (response?.data?.success) {
        getData();
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const getBeforeInplayData = async () => {
    try {
      const { status, data: response_users } = await apiGet(
        pathObj.beforeInplayLimit + `?sportType=${select}`
      );

      if (status === 200) {
        if (response_users.success) {
          setInplay(response_users?.results?.fieldValue);
          setInplayId(response_users?.results?._id);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const getData = async () => {
    try {
      let response = await apiGet(
        pathObj.getDefaultSetting + `?sportType=${select}`
      );
      if (response?.data?.success) {
        // if (response.data.results.length == obj.settingArray.length) {
        //   console.log("response.data.results1", response.data.results);
        //   setData(
        //     response?.data.results?.map((res) => {
        //       return res.onShow
        //         ? { ...res, onShow: "1" }
        //         : { ...res, onShow: "0" };
        //     })
        //   );
        // } else {
        // console.log("response.data.results2", response.data.results);
        // let temp = obj.settingArray.map((e, i) => {
        //   return e.type == response?.data?.results[i]?.type
        //     ? response?.data?.results[i]
        //     : e;
        // });
        // console.log(temp, "temp");
        // setData(
        //   temp?.map((res) => {
        //     return res.onShow
        //       ? { ...res, onShow: "1" }
        //       : { ...res, onShow: "0" };
        //   })
        // );
        console.log(response?.data?.results);
        if (response?.data?.results.length > 0) {
          for (let temp of response?.data?.results) {
            setData((current) => {
              return current.map((res) => {
                if (res.type == temp.type) {
                  return {
                    ...res,
                    minAmount: temp.minAmount,
                    maxAmount: temp.maxAmount,
                    betDelay: temp.betDelay,
                    onShow: temp.onShow ? "1" : "0",
                    oddsLimit: temp.oddsLimit,
                    maxProfit: temp.maxProfit,
                    maxError: temp.maxError,
                  };
                } else {
                  return res;
                }
              });
            });
          }
        }
        // }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getData();
    getBeforeInplayData();
  }, [select]);
  return (
    <div>
      <section className="set-limit-sec py-4">
        <Container fluid>
          <Form>
            <Row className="align-items-center">
              <Col md={3}>
                <Form.Group className="d-flex align-items-center mb-3  find-member-sec ">
                  <Form.Label className="pe-2 mb-0 w-75">
                    Select Sports
                  </Form.Label>
                  <Form.Select
                    value={select}
                    onChange={(e) => setSelect(e.target.value)}
                    aria-label="Default select example w-auto"
                  >
                    <option value="cricket">Cricket</option>
                    <option value="soccer">Soccer</option>
                    <option value="tennis">Tennis</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form>
              {data &&
                data?.map((item) => {
                  return (
                    <Row className="align-items-center">
                      <h2 className="common-heading">
                        {obj.settingHeading[item.type]}
                      </h2>
                      <Col xl={3} lg={3} sm={6}>
                        <Form.Group className="d-flex align-items-center mb-2">
                          <Form.Label className="pe-2 mb-0 w-lg-auto">
                            Min Amount
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="minAmount"
                            placeholder="Min Amount"
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
                      <Col xl={3} lg={3} sm={6}>
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
                          <Form.Label className="pe-2 mb-0">
                            Bet Delay
                          </Form.Label>
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
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Button
                          className="green-btn"
                          onClick={() => onSubmit(item.type)}
                        >
                          Set Limit
                        </Button>
                      </div>
                    </Row>
                  );
                })}
              <Row className="align-items-center">
                <h2 className="common-heading">Before Inplay</h2>
                <Col xl={3} lg={3} sm={6}>
                  <Form.Group className="d-flex align-items-center mb-2">
                    <Form.Label className="pe-2 mb-0 w-lg-auto">
                      Minutes
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="minutes"
                      placeholder="Minutes"
                      value={getInplay}
                      onChange={(e) => {
                        if (Number(e.target.value)) {
                          handelInPlay(e.target.value, true);
                        } else {
                          handelInPlay(e.target.value, false);
                        }
                      }}
                    />
                  </Form.Group>
                </Col>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <Button className="green-btn" onClick={() => onSubmit1()}>
                    Set Limit
                  </Button>
                </div>
              </Row>
            </Form>
          </Form>
        </Container>
      </section>
    </div>
  );
};

export default DefaultSetting;
