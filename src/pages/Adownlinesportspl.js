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

const Adownlinesportspl = () => {
  const parmas = useParams();
  const location = useLocation();
  const user_params = compact(location.pathname.split("/"));
  let { user } = useContext(AuthContext);
  const [pageCount, setPageCount] = useState(0);
  const [getProperty, setProperty] = useState("none");
  var previousDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  var currentDate = moment().format("YYYY-MM-DD");
  const [matchData, setMatchData] = useState("");
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

  const [obj, setObj] = useState({});

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
    let path = apiPath.casinoMarket;

    try {
      const { status, data: response_users } = await apiGet(
        path,
        type == "search" ? filter : type
      );
      if (status === 200) {
        if (response_users.success) {
          setMatchData(response_users.results);
          setData(response_users.results.data.sort(function(a, b){
            if(a.eventType < b.eventType) { return -1; }
            if(a.eventType > b.eventType) { return 1; }
            return 0;
          }));
          setPageCount(response_users.results.totalPages);
          // console.log(response_users?.results?.data, "res");
          const betAmount = response_users?.results?.data?.reduce((a, v) => {
            a = parseFloat(a) + parseFloat(v.betAmount);
            return a;
          }, 0);
          const realCutAmount = response_users?.results?.data?.reduce(
            (a, v) => {
              a = parseFloat(a) + parseFloat(v?.realCutAmount);
              return a;
            },
            0
          );
          const commission = response_users?.results?.data?.reduce((a, v) => {
            a = parseFloat(a) + parseFloat(v?.commission);
            return a;
          }, 0);
          setObj({
            commission: commission || 0,
            betAmount: betAmount || 0,
            realCutAmount: realCutAmount || 0,
          });
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
// console.log(data.sort(function(a, b){
//   if(a.eventType < b.eventType) { return -1; }
//   if(a.eventType > b.eventType) { return 1; }
//   return 0;
// }));
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <Row>
            <div className="db-sec">
              <h2 className="common-heading">Casino Profit/Loss Report</h2>
            </div>
            <Col md={12}>
              <div className="inner-wrapper">
                <Form className="bet_status">
                  <Row>
                    <Col xl={12} md={12}>
                      <Row>
                        <Col
                          lg={3}
                          sm={6}
                          className="mb-lg-0 mb-3 flex-grow-0 pe-3"
                        >
                          <div className="bet-sec bet-period">
                            <Form.Label className="px-2">From</Form.Label>
                            <Form.Group className="form-group">
                              <Form.Control
                                className="small_form_control"
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
                        <Col
                          lg={3}
                          sm={6}
                          className="mb-lg-0 mb-3 flex-grow-0 ps-3"
                        >
                          <div className="bet-sec bet-period">
                            <Form.Label className="px-2">To</Form.Label>
                            <Form.Group className="form-group">
                              <Form.Control
                                className="small_form_control"
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
                  <div className="history-btn mt-2">
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
                          className="me-0 theme_light_btn theme_dark_btn"
                          onClick={() => getData("search")}
                        >
                          Search
                        </Button>
                      </li>
                      <li>
                        <Button
                          className="me-0 theme_light_btn"
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

            <Col md={12} sm={12} lg={12} className="mt-2">
              <section className="account-table">
                <div className="responsive transaction-history">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">UID</th>
                        <>
                          <th scope="col">Stake</th>
                          <th scope="col">Downline P/L</th>
                          <th scope="col">Player P/L</th>
                          <th scope="col">Comm.</th>
                          <th scope="col">Upline/Total P/L</th>
                        </>
                      </tr>
                    </thead>
                    <tbody>
                      <>
                        {data && data?.length > 0 ? (
                          data?.map((item, index) => {
                            return (
                              <>
                                <tr key={index + 1}>
                                  <>
                                    <td className="text-start">
                                      {`${
                                      item?.eventType === "4"
                                        ? "Cricket"
                                        : item?.eventType === "1"
                                        ? "Soccer"
                                        : item?.eventType === "2"
                                        ? "Tennis"
                                        : "Casino"
                                    }`}
                                    </td>
                                    <td>
                                      {helpers.currencyFormat(item?.betAmount)}
                                    </td>
                                    <td>
                                      {" "}
                                      {Math.sign(item?.realCutAmount) === -1 ? (
                                        <span className="text-success">
                                          {helpers.currencyFormat(
                                            Math.abs(item?.realCutAmount)
                                          )}
                                        </span>
                                      ) : (
                                        <span className="text-danger">
                                          (
                                          {helpers.currencyFormat(
                                            item?.realCutAmount
                                          )}
                                          )
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      {Math.sign(item?.realCutAmount) === -1 ? (
                                        <span className="text-danger">
                                          (
                                          {helpers.currencyFormat(
                                            item?.realCutAmount
                                          )}
                                          )
                                        </span>
                                      ) : (
                                        <span className="text-success">
                                          {helpers.currencyFormat(
                                            Math.abs(item?.realCutAmount)
                                          )}
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      {helpers.currencyFormat(item?.commission)}
                                    </td>
                                    <td>
                                    {Math.sign(item?.realCutAmount) === -1 ? (
                                        <span className="text-success">
                                          {helpers.currencyFormat(
                                            Math.abs(item?.realCutAmount)
                                          )}
                                        </span>
                                      ) : (
                                        <span className="text-danger">
                                          (
                                          {helpers.currencyFormat(
                                            item?.realCutAmount
                                          )}
                                          )
                                        </span>
                                      )}
                                    </td>
                                  </>
                                </tr>
                              </>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6}>
                              <span>You have no bets in this time period.</span>
                            </td>
                          </tr>
                        )}
                        {data?.length > 0 && (
                          <>
                            <td className="text-start">
                              Total
                            </td>
                            <td>
                              {helpers.currencyFormat(obj?.betAmount)}
                            </td>
                            <td>
                              {" "}
                              {Math.sign(obj?.realCutAmount) === -1 ? (
                                <span className="text-success">
                                  {helpers.currencyFormat(
                                    Math.abs(obj?.realCutAmount)
                                  )}
                                </span>
                              ) : (
                                <span className="text-danger">
                                  (
                                  {helpers.currencyFormat(
                                    obj?.realCutAmount
                                  )}
                                  )
                                </span>
                              )}
                            </td>
                            <td>
                              {Math.sign(obj?.realCutAmount) === -1 ? (
                                <span className="text-danger">
                                  (
                                  {helpers.currencyFormat(
                                    obj?.realCutAmount
                                  )}
                                  )
                                </span>
                              ) : (
                                <span className="text-success">
                                  {helpers.currencyFormat(
                                    Math.abs(obj?.realCutAmount)
                                  )}
                                </span>
                              )}
                            </td>
                            <td>
                              {helpers.currencyFormat(obj?.commission)}
                            </td>
                            <td>
                              {Math.sign(obj?.realCutAmount) === -1 ? (
                                <span className="text-success">
                                  {helpers.currencyFormat(
                                    Math.abs(obj?.realCutAmount)
                                  )}
                                </span>
                              ) : (
                                <span className="text-danger">
                                  (
                                  {helpers.currencyFormat(
                                    obj?.realCutAmount
                                  )}
                                  )
                                </span>
                              )}
                            </td>
                          </>
                        )}
                      </>
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

export default Adownlinesportspl;
