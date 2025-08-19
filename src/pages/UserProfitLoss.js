import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { apiGet } from "../utils/apiFetch";
import obj from "../utils/constants";
import apiPath from "../utils/apiPath";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import moment from "moment";

const UserProfitLoss = () => {
  const [pageCount, setPageCount] = useState(0);
  const [data, setData] = useState([]);
  const [viewpage, setViewPage] = useState(0);
  const [getGameType, setGameType] = useState("cricket");
  var previousDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  var currentDate = moment().format("YYYY-MM-DD");
  const [filter, setFilter] = useState({
    fromPeriod: previousDate,
    toPeriod: currentDate,
    gameType: "cricket",
    order: "top",
    page: 1,
    page_size: 10,
  });
  const getData = async (type = "search") => {
    if (filter.filterByDay != "") {
      if (filter.filterByDay == "today") {
        filter.fromPeriod = currentDate;
        filter.toPeriod = currentDate;
      }
      if (filter.filterByDay == "yesterday") {
        filter.fromPeriod = previousDate;
        filter.toPeriod = currentDate;
      }
    }
    const { status, data: response_users } = await apiGet(
      apiPath.userProfitLoss,
      type == "search" ? filter : type
    );
    if (status === 200) {
      if (response_users.success) {
        setData(response_users.results);
        setGameType(filter?.gameType);
        if (filter?.order === "bottom") {
          setData(
            response_users?.results.sort((a, b) =>
              a.amount > b.amount ? 1 : -1
            )
          );
        }
      }
    }
  };

  useEffect(() => {
    if (filter.filterByDay != "") {
      getData();
    }
  }, [filter.filterByDay]);
  const handlePageClick = (event) => {
    setFilter((prevState) => {
      return {
        ...prevState,
        page: event.selected + 1,
      };
    });
    setViewPage(event.selected);
  };
  useEffect(() => {
    setPageCount(data?.totalPages || []);
  }, [data]);

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">User Profit Loss</h2>
          </div>
          <div className="inner-wrapper">
            <div className="common-container">
              <Form className="bet_status">
                <Row>
                  <Col lg={8}>
                    <Row>
                      <Col lg={2} sm={6} className="mb-lg-0 mb-3">
                        <div className="bet-sec bet-period upl-date">
                          <Form.Label>Period</Form.Label>
                          <Form.Group className="form-group">
                            <Form.Control
                              onChange={(e) =>
                                setFilter({
                                  ...filter,
                                  fromPeriod: e.target.value,
                                  filterByDay: "",
                                })
                              }
                              max={new Date().toISOString().split("T")[0]}
                              value={filter.fromPeriod}
                              type="date"
                            />
                            <Form.Control
                              className="small_form_control"
                              type="text"
                              placeholder="00:00"
                              disabled
                            />
                          </Form.Group>
                        </div>
                      </Col>
                      <Col lg={2} sm={6} className="mb-lg-0 mb-3">
                        <div className="bet-sec bet-period upl-date">
                          <Form.Label>To</Form.Label>
                          <Form.Group className="form-group">
                            <Form.Control
                              onChange={(e) =>
                                setFilter({
                                  ...filter,
                                  toPeriod: e.target.value,
                                  filterByDay: "",
                                })
                              }
                              min={
                                filter?.fromPeriod
                                  ? new Date(filter?.fromPeriod)
                                      .toISOString()
                                      .split("T")[0]
                                  : new Date()
                              }
                              disabled={filter.fromPeriod ? false : true}
                              max={new Date().toISOString().split("T")[0]}
                              value={filter.toPeriod}
                              type="date"
                            />
                            <Form.Control
                              className="small_form_control"
                              type="text"
                              placeholder="23:59"
                              disabled
                            />
                          </Form.Group>
                        </div>
                      </Col>
                      <Col lg={2} sm={6} className="mb-lg-0 mb-3">
                        <div className="bet-sec">
                          {/* <Form.Label>Sport:</Form.Label> */}
                          <Form.Select
                            onChange={(e) =>
                              setFilter({
                                ...filter,
                                gameType: e.target.value,
                              })
                            }
                            value={filter.gameType}
                            aria-label="Default select example"
                          >
                            <option value="cricket">Cricket</option>
                            <option value="tennis">Tennis</option>
                            <option value="soccer">Soccer</option>
                            <option value="fancy">Fancy</option>
                            <option value="casino">Casino</option>
                          </Form.Select>
                        </div>
                      </Col>
                      <Col lg={2} sm={6} className="mb-lg-0 mb-3">
                        <div className="bet-sec">
                          <Form.Select
                            onChange={(e) =>
                              setFilter({ ...filter, order: e.target.value })
                            }
                            value={filter.order}
                            aria-label="Default select example"
                          >
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                          </Form.Select>
                        </div>
                      </Col>
                      <Col lg={2} sm={6} className="mb-lg-0 mb-3">
                        <div className="bet-sec">
                          {/* <Form.Label>Sport:</Form.Label> */}
                          <Form.Select
                            onChange={(e) =>
                              setFilter({ ...filter, limit: e.target.value })
                            }
                            value={filter.limit}
                            aria-label="Default select example"
                          >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </Form.Select>
                        </div>
                      </Col>
                      <Col lg={2} sm={6} className="mb-lg-0 mb-3">
                        <div className="history-btn mt-0">
                          <ul className="list-unstyled mb-0">
                            <li>
                              <Button
                                className="green-btn"
                                onClick={() => getData("search")}
                              >
                                Search
                              </Button>
                            </li>
                            <li>
                              <Button
                                className="theme_light_btn me-0"
                                onClick={() => {
                                  setFilter({
                                    fromPeriod: "",
                                    toPeriod: "",
                                    gameType: "cricket",
                                    order: "top",
                                    page: 1,
                                    page_size: 10,
                                  });
                                  getData({
                                    fromPeriod: "",
                                    toPeriod: "",
                                    gameType: "cricket",
                                    order: "top",
                                    page: 1,
                                    page_size: 10,
                                  });
                                }}
                              >
                                Reset
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Col>
                    </Row>
                  </Col>

                  <Col lg={4}>
                    <Row>
                      <Col
                        sm={12}
                        className="mb-lg-0 mb-3 d-flex justify-content-end"
                      >
                        <Link to="/BetListLive" className="green-btn me-2">
                          Live Match Bet
                        </Link>
                        <Link to="/rejected-bets" className="green-btn">
                          Rejected Bets
                        </Link>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>

              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Sr. No.</th>
                        <th scope="col"> Username</th>
                        <th scope="col">Cricket</th>
                        <th scope="col">Tennis </th>
                        <th scope="col">Soccer</th>
                        <th scope="col">Fancy</th>
                        <th scope="col">Live Casino</th>
                      </tr>
                    </thead>
                    {data && data?.length > 0 ? (
                      data?.map((item, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{item?.username || "0"}</td>
                            <td>
                              {" "}
                              {getGameType == "cricket" ? item?.amount : "0"}
                            </td>
                            <td>
                              {" "}
                              {getGameType == "tennis" ? item?.amount : "0"}
                            </td>
                            <td>
                              {" "}
                              {getGameType == "soccer" ? item?.amount : "0"}
                            </td>
                            <td>
                              {" "}
                              {getGameType == "fancy" ? item?.amount : "0"}
                            </td>
                            <td>
                              {" "}
                              {getGameType == "casino" ? item?.amount : "0"}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={12}>
                          <span>You have no bets in this time period.</span>
                        </td>
                      </tr>
                    )}
                  </Table>
                  {data?.length == 0 && (
                    <div className="bottom-pagination">
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel=" >"
                        forcePage={viewpage}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={10}
                        pageCount={pageCount}
                        previousLabel="< "
                        renderOnZeroPageCount={null}
                        activeClassName="p-1"
                        activeLinkClassName="pagintion-li"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default UserProfitLoss;
