import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Button,
  Modal,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "wc-toast";
import { apiGet, apiPost } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import obj from "../utils/constants";
import { Link } from "react-router-dom";
import { startCase } from "lodash";

const LiveMatchBet = () => {
  const [data, setData] = useState([]);
  const [unmatched, setUnmatched] = useState("");
  const [open, setOpen] = useState(false);
  const [check, setCheck] = useState(true);
  const [keyword, setKeyword] = useState();
  const [getBetType, setBetType] = useState("betfair");
  const [filter, setFilter] = useState({
    type: "4",
    betType: "betfair",
    sortType: "amount",
    sortOrder: "asc",
    last: 25,
    status: "active",


  });
  const [betId, setBetId] = useState("");
  const [getStatus, setStatus] = useState("");
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
  });
  const handleClick = () => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        keyword: keyword,
      };
    });
    getData();
  };

  const setOpenToggle = (betId, status) => {
    setOpen(!open);
    setBetId(betId);
    setStatus(status);
  };

  const getData = async (type) => {

    const { status, data: response_users } = await apiGet(
      apiPath.getBetslive,
      type == "search" ? filter : (keyword) ? search_params : type
    );
    if (status === 200) {
      if (response_users.success) {
        if (filter?.betType == "betfair" && type == "search") {
          setCheck(true);
        } else if (type?.betType == "betfair") {
          setCheck(true);
        } else {
          setCheck(false);
        }
        setBetType(filter?.betType);
        let temp = (response_users?.results && response_users?.results.length>0) && response_users.results.filter((res) => !res.isMatched);
        setUnmatched(temp);
        setData(response_users.results);
      }
    }
  };
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
    reset: reset1,
  } = useForm({});
  const [isLoader, setLoader] = useState(false);
  const onSubmit1 = async (request) => {
    setLoader(true);
    try {
      if ((betId && getStatus, getBetType)) {
        const { status, data: response_users } = await apiPost(
          apiPath.updateBetsStatus,
          {
            betId: betId,
            status: getStatus,
            betType: getBetType,
            password: request.password,
          }
        );
        if (status === 200) {
          if (response_users.success) {
            setLoader(false);
            toast.success(response_users.message);
            reset1();
            setOpenToggle();
          } else {
            setLoader(false);
            toast.error(response_users.message);
          }
        }
      }
    } catch (err) {
      setLoader(false);
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // console.log("getBetType", getBetType);
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <Form className="bet_status bet-list-live mb-4">
            <div key={`inline-radio`} className="mb-1">
              {obj.betCheckData.map((type) => {
                return (
                  <Form.Check
                    inline
                    label={type.value}
                    name={type.label}
                    type="radio"
                    checked={type.label === filter.type ? true : false}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        type: e.target.name,
                        betType:
                          type?.value == "Casino"
                            ? "casino"
                            : "betfair",
                      })
                    }
                    id={`inline-radio-1`}
                  />
                );
              })}
            </div>
            <div key={`inline-radio`} className="mb-2">
              {obj.betCheckDataInner.map((type) => {
                return (
                  <Form.Check
                    inline
                    label={type.value}
                    name={type.label}
                    type="radio"
                    checked={type.label === filter.betType ? true : false}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        betType: e.target.name,
                      })
                    }
                    id={`inline-radio-1`}
                  />
                );
              })}
            </div>
            <Row>
              <Col xl={12} md={12} lg={12}>
                <Row>
                  <Col xxl={2} lg={3} md={4} sm={6} className="mb-lg-0 mb-3">
                    <div className="bet-sec">
                      <Form.Label>Order of display:</Form.Label>
                      <Form.Select
                        onChange={(e) =>
                          setFilter({ ...filter, sortType: e.target.value })
                        }
                        value={filter.sortType}
                        aria-label="Default select example"
                      >
                        <option value="amount">Stake</option>
                        <option value="timeInserted">Time</option>
                      </Form.Select>
                    </div>
                  </Col>
                  <Col xxl={2} lg={3} md={4} sm={6} className="mb-lg-0 mb-3">
                    <div className="bet-sec bet-period">
                      <Form.Label>of</Form.Label>
                      <Form.Select
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            sortOrder: e.target.value,
                          })
                        }
                        value={filter.sortOrder}
                        aria-label="Default select example"
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Decending</option>
                      </Form.Select>
                    </div>
                  </Col>

                  <Col xxl={2} lg={3} md={4} sm={6} className="mb-lg-0 mb-3">
                    <div className="bet-sec bet-period">
                      <Form.Label>Last</Form.Label>
                      <Form.Select
                        onChange={(e) =>
                          setFilter({ ...filter, last: e.target.value })
                        }
                        value={filter.last}
                        aria-label="Default select example"
                      >
                        <option value={25}>25 Txn</option>
                        <option value={50}>50 Txn</option>
                        <option value={100}>100 Txn</option>
                        <option value={200}>200 Txn</option>
                        <option value={""}>All</option>
                      </Form.Select>
                    </div>
                  </Col>
                  <Col xxl={2} lg={3} md={4} sm={6} className="mb-lg-0 mb-3">
                    <div className="bet-sec">
                      <Form.Label>Bet Status:</Form.Label>
                      <Form.Select
                        onChange={(e) =>
                          setFilter({ ...filter, status: e.target.value })
                        }
                        value={filter.status}
                        aria-label="Default select example"
                      >
                        <option value={"active"}>Active</option>
                        <option value={"suspend"}>Suspend</option>
                      </Form.Select>
                    </div>
                  </Col>

                  <Col lg={1}>
                    <div style={{ display: "flex" }}>
                      <Button
                        className="green-btn"
                        style={{ marginRight: "10px" }}
                        onClick={() => getData("search")}
                      >
                        Search
                      </Button>
                      <Button
                        className="theme_light_btn"
                        onClick={() => {
                          setFilter({
                            type: "4",
                            betType: "betfair",
                            sortType: "amount",
                            sortOrder: "",
                            last: 25,
                            status: "active",
                          });
                          getData({
                            type: "4",
                            betType: "betfair",
                            sortType: "amount",
                            sortOrder: "",
                            last: 25,
                            status: "active",
                          });
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>

          <div className="find-member-sec">
            <Row className="mb-3">
              <Col md={6}>
                <Form className="">
                  <Form.Group className="position-relative mb-2">
                    <Form.Control
                      type="text"
                      className="small_form_control"
                      placeholder="Enter Username..."
                      onChange={(e) => {
                        setKeyword(e.target.value);
                      }}
                    />
                    <i className="fas fa-search"></i>
                  </Form.Group>
                  <div className="d-flex flex-wrap block-search-sec ms-sm-3">
                    {/* <Button className="mb-2 mx-1 theme_dark_btn">Search1</Button> */}
                    <Button
                      className="mb-2 mx-1 theme_dark_btn"
                      onClick={handleClick}>
                      Search
                    </Button>
                    <Button className="mb-2 mx-1 theme_dark_btn">Clear</Button>
                  </div>
                </Form>
              </Col>
              <Col md={6} className="">
                <div className="d-flex flex-wrap live-match-bat justify-sm-content-end">
                  <Link
                    to="/userProfitLoss"
                    className="mb-2 mx-1 theme_dark_btn green-btn"
                  >
                    User P/L
                  </Link>
                  <Link
                    to="/PreMatch"
                    className="mb-2 mx-1 theme_dark_btn green-btn"
                  >
                    Pre-Match P/L
                  </Link>
                  <Link
                    to="/rejected-bets"
                    className="mb-2 mx-1 theme_dark_btn green-btn"
                  >
                    Rejected Bets
                  </Link>
                </div>
              </Col>
            </Row>

            {check && getBetType === "betfair" ? (
              <div className="account-table">
                <caption className="d-block text-start">UnMatched</caption>
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Sports </th>
                        <th scope="col"> Match Name</th>
                        <th scope="col">Client</th>
                        <th scope="col">Type</th>
                        <th scope="col">Selection</th>
                        <th scope="col">Odds</th>
                        <th scope="col">Stake</th>
                        <th scope="col">Place Time</th>
                        <th scope="col">IP</th>
                        <th scope="col">Pnl</th>
                        {/* <th scope="col">Del.</th> */}
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    {unmatched && unmatched?.length > 0 ? (
                      unmatched?.map((item) => {
                        return (
                          <tr>
                            <td>{obj.betCheckObj[filter.type]}</td>
                            <td>{item?.matchName || "N/A"}</td>
                            <td> {item?.clientName || "N/A"}</td>
                            <td> {item?.betType || "N/A"}</td>
                            <td> {item?.teamName || "N/A"}</td>
                            <td> {item?.bhav || "N/A"}</td>
                            <td> {item?.amount || "N/A"}</td>
                            <td> {item?.timeInserted || "N/A"} </td>
                            <td> {(item?.ipAddress) && item?.ipAddress.replace("::ffff:","") || "N/A"} </td>
                            <td> {item?.profitAmount || "N/A"} </td>
                            {/* <td> {item?.loseAmount || "N/A"} </td> */}
                            <td>
                              <Button
                                className="theme_light_btn"
                                onClick={() =>
                                  setOpenToggle(item.matchBetId, "delete")
                                }
                              >
                                Delete
                              </Button>
                              <Button
                                className="theme_light_btn"
                                onClick={() =>
                                  setOpenToggle(item.matchBetId, "cancelled")
                                }
                              >
                                Cancel
                              </Button>
                              <Button
                                className="theme_light_btn"
                                onClick={() =>
                                  setOpenToggle(item.matchBetId, "voided")
                                }
                              >
                                Voided
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={11}>
                          <span>You have no bets in this time period.</span>
                        </td>
                      </tr>
                    )}
                  </Table>
                </div>
              </div>
            ) : null}
            <div className="account-table">
              <caption className="d-block text-start">Matched</caption>
              <div className="responsive">
                <Table className="banking_detail_table">
                  <thead>
                    <tr>
                      <th scope="col">Sports </th>

                      <th scope="col">{getBetType === "casino" ? "Casino" : "Match"}  Name</th>
                      <th scope="col">Client</th>
                      <th scope="col">Type</th>
                      <th scope="col">Selection</th>
                      {getBetType !== "casino" && <th scope="col">Odds</th>}
                      <th scope="col">Stake</th>
                      <th scope="col">Place Time</th>
                      <th scope="col">IP</th>
                      {getBetType !== "casino" && <th scope="col">Pnl</th>}

                      {/* <th scope="col">Del.</th> */}
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  {data && data?.length > 0 ? (
                    data?.map((item) => {
                      if (getBetType === "fancy") {
                        return (
                          <tr>
                            <td>{obj.betCheckObj[filter.type]}</td>
                            <td>{item?.matchName || "N/A"}</td>
                            <td> {item?.clientName || "N/A"}</td>
                            <td> {item?.type || "N/A"}</td>
                            <td> {item?.fancyName || "N/A"}</td>
                            <td> {item?.betRun || "N/A"}</td>
                            <td> {item?.amount || "N/A"}</td>
                            <td> {item?.timeInserted || "N/A"} </td>
                            <td> {(item?.ipAddress) && item?.ipAddress.replace("::ffff:","") || "N/A"}</td>
                            <td> {item?.profitAmount || "N/A"} </td>
                            {/* <td> {item?.loseAmount || "N/A"} </td> */}
                            <td>
                              <Button
                                className="theme_light_btn"
                                onClick={() =>
                                  setOpenToggle(item.matchBetId, "delete")
                                }
                              >
                                Delete
                              </Button>
                              <Button
                                className="theme_light_btn"
                                onClick={() =>
                                  setOpenToggle(item.matchBetId, "cancelled")
                                }
                              >
                                Cancel
                              </Button>
                              <Button
                                className="theme_light_btn"
                                onClick={() =>
                                  setOpenToggle(item.matchBetId, "voided")
                                }
                              >
                                Voided
                              </Button>
                            </td>
                          </tr>
                        );
                      } else if (getBetType === "casino") {
                        return (
                          <tr>
                            <td>{obj.betCheckObj[filter.type]}</td>
                            <td>{item?.casinoName || "N/A"}</td>
                            <td> {item?.clientName || "N/A"}</td>
                            <td> {item?.gameCode || "N/A"}</td>
                            <td> {item?.platformTxId || "N/A"}</td>
                            <td> {item?.betAmount || "N/A"}</td>
                            <td> {item?.timeInserted || "N/A"} </td>
                            <td> {(item?.ipAddress) && item?.ipAddress.replace("::ffff:","") || "N/A"}</td>
                            {/* <td> {item?.profitAmount || "N/A"} </td> */}
                            {/* <td> {item?.loseAmount || "N/A"} </td> */}
                            <td>
                              <Button
                                className="theme_light_btn"
                                onClick={() =>
                                  setOpenToggle(item.platformTxId, "delete")
                                }
                              >
                                Delete
                              </Button>
                              <Button
                                className="theme_light_btn"
                                onClick={() =>
                                  setOpenToggle(item.platformTxId, "cancelled")
                                }
                              >
                                Cancel
                              </Button>
                              <Button
                                className="theme_light_btn"
                                onClick={() =>
                                  setOpenToggle(item.platformTxId, "voided")
                                }
                              >
                                Voided
                              </Button>
                            </td>
                          </tr>

                        );
                      } else {
                        return (
                          item.isMatched && (
                            <tr>
                              <td>{obj.betCheckObj[filter.type]}</td>
                              <td>{item?.matchName || "N/A"}</td>
                              <td> {item?.clientName || "N/A"}</td>
                              <td> {item?.betType || "N/A"}</td>
                              <td> {item?.teamName || "N/A"}</td>
                              <td> {item?.bhav || "N/A"}</td>
                              <td> {item?.amount || "N/A"}</td>
                              <td> {item?.timeInserted || "N/A"} </td>
                              <td> {(item?.ipAddress) && item?.ipAddress.replace("::ffff:","") || "N/A"} </td>
                              <td> {item?.profitAmount || "N/A"} </td>
                              {/* <td> {item?.loseAmount || "N/A"} </td> */}
                              <td>
                                <Button
                                  className="theme_light_btn"
                                  onClick={() =>
                                    setOpenToggle(item.matchBetId, "delete")
                                  }
                                >
                                  Delete
                                </Button>
                                <Button
                                  className="theme_light_btn"
                                  onClick={() =>
                                    setOpenToggle(item.matchBetId, "cancelled")
                                  }
                                >
                                  Cancel
                                </Button>
                                <Button
                                  className="theme_light_btn"
                                  onClick={() =>
                                    setOpenToggle(item.matchBetId, "voided")
                                  }
                                >
                                  Voided
                                </Button>
                              </td>
                            </tr>
                          )
                        );
                      }
                    })
                  ) : (
                    <tr>
                      <td colSpan={10}>
                        <span>You have no bets in this time period.</span>
                      </td>
                    </tr>
                  )}
                </Table>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <Modal show={open} onHide={setOpenToggle} className="change-status-modal">
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-status h4">
            {startCase(getStatus)} Match
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="test-status border-0">
            <Form
              className="change-password-sec"
              onSubmit={handleSubmit1(onSubmit1)}
            >
              <Form.Group className=" mb-2">
                <h4 className="modal-title-status h4 text-center mb-3">
                  Are you want to {startCase(getStatus)} ?
                </h4>
              </Form.Group>
              <Form.Group className=" mb-2">
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  className={
                    errors1.password
                      ? " w-sm-50 m-auto is-invalid "
                      : "w-sm-50 m-auto"
                  }
                  {...register1("password", {
                    required: "Please enter password",
                  })}
                />
                {errors1.password && errors1.password.message && (
                  <label className="invalid-feedback text-left">
                    {errors1.password.message}
                  </label>
                )}
              </Form.Group>

              <div className="text-center mt-4">
                <Button type="submit" className="green-btn">
                  {isLoader ? "Loading..." : "Submit"}
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LiveMatchBet;
