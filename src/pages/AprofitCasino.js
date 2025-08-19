import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import { toast } from "wc-toast";
import { useLocation, useParams, Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import constant from "../utils/constants";
import { compact, isEmpty, startCase } from "lodash";
import AuthContext from "../context/AuthContext";
import helpers from "../utils/helpers";
import moment from "moment";
const AprofitCasino = () => {
  const [hideData, setHideData] = useState(false);
  const parmas = useParams();
  const location = useLocation();
  const user_params = compact(location.pathname.split("/"));
  let { user } = useContext(AuthContext);
  let check = user_params[0];
  const [pageCount, setPageCount] = useState(0);
  const [getProperty, setProperty] = useState("none");
  var previousDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  var currentDate = moment().format("YYYY-MM-DD");
  const [viewpage, setViewPage] = useState(0);

  const [filter, setFilter] = useState({
    page: 1,
    page_size: 10,
    fromPeriod: previousDate,
    toPeriod: currentDate,
    filterByDay: "",
    created_by: "",
    userType: user?.userType,
  });

  const handlePageClick = (event) => {
    setFilter((prevState) => {
      return {
        ...prevState,
        page: event.selected + 1,
      };
    });
  };

  const showDetail = (event, id) => {
    const detailDiv = document.getElementById(id);
    if (detailDiv.style.display === "none") {
      detailDiv.style.setProperty("display", "contents");
      event.target.className = "fas fa-minus-square pe-2";
    } else {
      detailDiv.style.setProperty("display", "none");
      event.target.className = "fas fa-plus-square pe-2";
    }
  };
  useEffect(() => {
    setFilter((prevState) => {
      return {
        ...prevState,
        created_by: parmas?.id,
        userType: parmas?.user_type,
      };
    });
  }, [parmas]);
  const [data, setData] = useState([]);
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
    let path = apiPath.aprofitCasino;

    try {
      const { status, data: response_users } = await apiGet(
        path,
        type == "search" ? filter : type
      );
      if (status === 200) {
        if (response_users.success) {
          setData(response_users.results.sort(function(a, b){
            if(a.date < b.date) { return -1; }
            if(a.date > b.date) { return 1; }
            return 0;
          }));
        }
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    getData();
    setViewPage(filter.page ? filter.page - 1 : 0);
  }, []);
  const totalStake = data?.reduce((a, v) => {
    a = parseFloat(a) + parseFloat(v.betAmount);
    return a;
  }, 0);
  const downlinePl = data?.reduce((a, v) => {
    a = parseFloat(a) + parseFloat(v.playerPL);
    return a;
  }, 0);

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <Row>
            <div className="db-sec">
              <h2 className="common-heading">Profit/Loss Report by Market</h2>
            </div>
            <Col md={3} className="mb-2">
              <Form className="bet_status bg-transparent border-0 p-0">
                <div className="bet-sec">
                  <Form.Label>Data Source:</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    className="small_select ms-2"
                  >
                    <option>DB</option>
                  </Form.Select>
                </div>
              </Form>
            </Col>
            <Col md={12}>
              <div className="inner-wrapper">
                <Form className="bet_status">
                  <Row>
                    <Col xl={12} md={12}>
                      <Row>
                        <Col lg={2} sm={6} className="mb-lg-0 mb-3">
                          <div className="bet-sec">
                            <Form.Label>Sports:</Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              className="small_select ms-2"
                            >
                              <option>All</option>
                              <option>Casino</option>
                            </Form.Select>
                          </div>
                        </Col>

                        <Col lg={3} sm={6} className="mb-lg-0 mb-3">
                          <div className="bet-sec">
                            <Form.Label className="me-2">Time Zone:</Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              className="small_select ms-2"
                            >
                              <option>IST(Bangalore/Bombay)</option>
                            </Form.Select>
                          </div>
                        </Col>
                        <Col lg={3} sm={6} className="mb-lg-0 mb-3">
                          <div className="bet-sec bet-period">
                            <Form.Label className="me-2">Period</Form.Label>
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
                        <Col lg={3} sm={6} className="mb-lg-0 mb-3">
                          <div className="bet-sec bet-period">
                            <Form.Label className="me-2">to</Form.Label>
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
                      </Row>
                    </Col>
                  </Row>

                  <div className="history-btn mt-3">
                    <ul className="list-unstyled mb-0">
                      <li>
                        <Button
                          className={
                            filter.filterByDay === "today"
                              ? "me-0 theme_dark_btn"
                              :
                            "me-0 theme_light_btn"
                          }
                          onClick={(e) =>
                            setFilter({
                              ...filter,
                              filterByDay: "today",
                            })
                          }
                        >
                          Just For Today
                        </Button>
                      </li>
                      <li>
                        <Button
                          className={
                            filter.filterByDay === "yesterday"
                              ? "me-0 theme_dark_btn"
                              :
                            "me-0 theme_light_btn"
                          }
                          onClick={(e) =>
                            setFilter({
                              ...filter,
                              filterByDay: "yesterday",
                            })
                          }
                        >
                          From Yesterday
                        </Button>
                      </li>
                      <li>
                        <Button
                          className="theme_dark_btn"
                          onClick={() => getData("search")}
                        >
                          Search
                        </Button>
                      </li>
                      <li>
                        <Button
                          className="theme_light_btn"
                          onClick={() => {
                            setFilter({
                              page: 1,
                              page_size: 10,
                              fromPeriod: "",
                              toPeriod: "",
                              filterByDay: "",
                              created_by: "",
                              userType: "",
                            });
                            getData({
                              page: 1,
                              page_size: 10,
                              fromPeriod: "",
                              toPeriod: "",
                              filterByDay: "",
                              created_by: "",
                              userType: "",
                            });
                          }}
                        >
                          Reset
                        </Button>
                      </li>
                    </ul>
                  </div>
                </Form>
              </div>
            </Col>
            <Col md={12} className="mt-2">
              <section className="account-table">
                <div className="responsive transaction-history table-color">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">UID</th>
                        <th scope="col">Stake</th>
                        <th scope="col">Downline P/L</th>
                        <th scope="col">Player P/L</th>
                        <th scope="col">Comm.</th>
                        <th scope="col">Upline/Total P/L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data && data?.length > 0 ? (
                        data?.map((item, index) => {
                          return (
                            <tr>
                              <td>{item?.date}</td>
                              <td>{item?.betAmount}</td>
                              <td>
                                {Math.sign(item?.playerPL) !== -1 ? (
                                  <span className="text-danger">
                                    ({helpers.currencyFormat(item?.playerPL)})
                                  </span>
                                ) : (
                                  <span className="text-success">
                                    (
                                    {helpers.currencyFormat(
                                      Math.abs(item?.playerPL)
                                    )}
                                    )
                                  </span>
                                )}
                              </td>
                              <td>

                                  {Math.sign(item?.playerPL) === -1 ? (
                                  <span className="text-danger">
                                    ({helpers.currencyFormat(item?.playerPL)})
                                  </span>
                                ) : (
                                  <span className="text-success">
                                    (
                                    {helpers.currencyFormat(
                                      Math.abs(item?.playerPL)
                                    )}
                                    )
                                  </span>
                                )}
                              </td>
                              <td>0</td>
                              <td>
                                {Math.sign(item?.playerPL) !== -1 ? (
                                  <span className="text-danger">
                                    ({helpers.currencyFormat(item?.playerPL)})
                                  </span>
                                ) : (
                                  <span className="text-success">
                                    (
                                    {helpers.currencyFormat(
                                      Math.abs(item?.playerPL)
                                    )}
                                    )
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6}>
                            <span>You have no bets in this time period.</span>
                          </td>
                        </tr>
                      )}

                      {/* {hideData && (
                        <tr className="hide-tr">
                          <td>Fancy1</td>
                          <td>0.00</td>
                          <td>
                            <span className="text-danger">(0.00)</span>
                          </td>
                          <td>0</td>
                          <td>0</td>
                          <td>0.00</td>
                        </tr>
                      )} */}
                      {data && data?.length > 0 ? (
                        <tr className="total-table-balance-none">
                          <td>Total</td>
                          <td>{totalStake}</td>
                          <td>
                            <strong className="text-danger">
                              {Math.sign(downlinePl) !== -1 ? (
                                <span className="text-danger">
                                  ({helpers.currencyFormat(downlinePl)})
                                </span>
                              ) : (
                                <span className="text-success">
                                  {helpers.currencyFormat(Math.abs(downlinePl))}
                                </span>
                              )}
                            </strong>
                          </td>
                          <td>
                            <strong className="text-success">
                            {Math.sign(downlinePl) === -1 ? (
                                <span className="text-danger">
                                  ({helpers.currencyFormat(downlinePl)})
                                </span>
                              ) : (
                                <span className="text-success">
                                  {helpers.currencyFormat(Math.abs(downlinePl))}
                                </span>
                              )}
                            </strong>
                          </td>
                          <td>
                            <strong className="text-success">0.00</strong>
                          </td>
                          <td>
                            <strong className="text-danger">
                              {Math.sign(downlinePl) !== -1 ? (
                                <span className="text-danger">
                                  ({helpers.currencyFormat(downlinePl)})
                                </span>
                              ) : (
                                <span className="text-success">
                                  {helpers.currencyFormat(Math.abs(downlinePl))}
                                </span>
                              )}
                            </strong>
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}
                    </tbody>
                  </Table>
                  <div className="bottom-pagination">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel=" >"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={10}
                      pageCount={pageCount}
                      previousLabel="< "
                      renderOnZeroPageCount={null}
                      activeClassName="p-0"
                      activeLinkClassName="pagintion-li"
                    />
                  </div>
                </div>
              </section>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AprofitCasino;
