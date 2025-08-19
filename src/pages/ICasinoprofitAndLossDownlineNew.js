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

const ICasinoprofitAndLossDownlineNew = () => {
  const parmas = useParams();
  const location = useLocation();
  const user_params = compact(location.pathname.split("/"));
  let { user } = useContext(AuthContext);
  let check = user_params[0];
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);
  const [getProperty, setProperty] = useState("none");
  var previousDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  var currentDate = moment().format("YYYY-MM-DD");
  const [detailsData, setDetailsData] = useState([]);

  const [filter, setFilter] = useState({
    page: 1,
    page_size: 10,
    fromPeriod: previousDate,
    toPeriod: currentDate,
    filterByDay: "",
    created_by: parmas.id ? parmas.id : user?._id,
    userType: parmas.user_type ? parmas.user_type : user?.userType,
  });

  const handlePageClick = (event) => {
    setFilter((prevState) => {
      return {
        ...prevState,
        page: event.selected + 1,
      };
    });
  };
  
  useEffect(() => {
    setFilter((prevState) => {
      return {
        ...prevState,
        created_by: parmas?.id,
        userType: parmas?.user_type,
      };
    });
  }, [parmas?.id]);
  const [obj, setObj] = useState({});
  const [data, setData] = useState([]);
  const [sumData, setSumData] = useState({});

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

    let path = apiPath.ICasinoprofitAndLossDownlineNew;

    try {
      const { status, data: response_users } = await apiGet(
        path,
        type == "search" ? filter : type
      );
      if (status === 200) {
        if (response_users.success) {
          setData(response_users.results.data);
          setSumData(response_users.results.sumData);
          // console.log(response_users.results.data, "data");
          setPageCount(response_users.results.totalPages);
          const commission = response_users?.results?.data?.reduce((a, v) => {
            a = parseInt(a) + parseInt(v?.stake?.commission);
            return a;
          }, 0);
          const stake = response_users?.results?.data?.reduce((a, v) => {
            a = parseInt(a) + parseInt(v?.stake?.realAmount);
            return a;
          }, 0);
          const downlinePnl = response_users?.results?.data?.reduce((a, v) => {
            a = parseInt(a) + parseInt(v?.stake?.amount);
            return a;
          }, 0);
          const downlinePnlAmount = response_users?.results?.data?.reduce(
            (a, v) => {
              a = parseInt(a) + parseInt(v?.amount);
              return a;
            },
            0
          );

          setObj({
            commission: commission || 0,
            stake: stake || 0,
            downlinePnl: downlinePnl || 0,
            downlinePnlAmount: downlinePnlAmount || 0,
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

  const search = async (item) => {
    let obj = {
      page: filter.page,
      page_size: filter.page_size,
      fromPeriod: filter.fromPeriod,
      toPeriod: filter.toPeriod,
      filterByDay: filter.filterByDay,
      created_by: item._id,
      userType: item?.userType,
    };
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
    let path = apiPath.ICasinoprofitAndLossDownlineNew;
    try {
      const { status, data: response_users } = await apiGet(path, obj);
      if (status === 200) {
        if (response_users.success) {
          setData(response_users.results.data);
          setPageCount(response_users.results.totalPages);
          setSumData(response_users.results.sumData);
          // console.log(response_users.results.data, "data");
          const commission = response_users?.results?.data?.reduce((a, v) => {
            a = parseInt(a) + parseInt(v?.stake?.commission);
            return a;
          }, 0);
          const stake = response_users?.results?.data?.reduce((a, v) => {
            a = parseInt(a) + parseInt(v?.stake?.realAmount);
            return a;
          }, 0);
          const downlinePnl = response_users?.results?.data?.reduce((a, v) => {
            a = parseInt(a) + parseInt(v?.stake?.amount);
            return a;
          }, 0);
          const downlinePnlAmount = response_users?.results?.data?.reduce(
            (a, v) => {
              a = parseInt(a) + parseInt(v?.amount);
              return a;
            },
            0
          );

          setObj({
            commission: commission || 0,
            stake: stake || 0,
            downlinePnl: downlinePnl || 0,
            downlinePnlAmount: downlinePnlAmount || 0,
          });
        }
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <Row>
            <div className="db-sec">
              <h2 className="common-heading">
               International Casino Profit/Loss Report by Downline
              </h2>
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
                          className="mb-lg-0 mb-3 flex-grow-0 pe-3 "
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
                              fromPeriod: previousDate,
                              toPeriod: currentDate,
                              filterByDay: "",
                              created_by: parmas.id ? parmas.id : user?._id,
                              userType: parmas.user_type ? parmas.user_type : user?.userType,
                            });
                            getData({
                              page: 1,
                              page_size: 10,
                              fromPeriod: previousDate,
                              toPeriod: currentDate,
                              filterByDay: "",
                              created_by: parmas.id ? parmas.id : user?._id,
                              userType: parmas.user_type ? parmas.user_type : user?.userType,
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
              <section className="account-table aprofit-downline">
                <div className="responsive transaction-history">
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
                      {/* const resultTotalStake = item?.bets_list?.reduce((a, v) => {
                    a = parseInt(a) + parseInt(v.amount);
                    return a;
                  }, 0); */}
                      <>
                        {data && data?.length > 0 ? (
                          data?.map((item, index) => {
                            return (Math.abs(item?.stake?.amount) >0)?
                            (
                              <>
                                <tr key={index + 1}>

                                      <td className="text-start">
                                        {item?.userType == "user" ? (
                                          <>
                                            <span>
                                              {
                                                constant?.user_status[
                                                item?.userType || ""
                                                ]
                                              }
                                            </span>
                                            {item?.username || null}
                                          </>
                                        ) : (
                                          <>
                                            <Link
                                              to={`/ICasinoprofitAndLossDownlineNew/${item._id}/${item?.userType}`}
                                              onClick={() => search(item)}>
                                              <span>
                                                {
                                                  constant?.user_status[
                                                  item?.userType || ""
                                                  ]
                                                }
                                              </span>
                                              {item?.username || null}
                                            </Link>
                                          </>
                                        )}
                                      </td>
                                      <td>
                                        {helpers.currencyFormat(
                                          item?.stakeAmount
                                        )}
                                      </td>
                                      <td>
                                        {" "}
                                        {Math.sign(item?.stake?.amount) !==
                                          -1 ? (
                                          <span className="text-danger">
                                            (
                                            {helpers.currencyFormat(
                                              "-" + item?.stake?.amount
                                            )}
                                            )
                                          </span>
                                        ) : (
                                          <span className="text-success">

                                            {helpers.currencyFormat(
                                              Math.abs(item?.stake?.amount)
                                            )}

                                          </span>
                                        )}
                                      </td>
                                      <td>
                                        {Math.sign(item?.stake?.amount) ===
                                          -1 ? (
                                          <span className="text-danger">
                                            (
                                            {helpers.currencyFormat(
                                              item?.stake?.amount
                                            )}
                                            )
                                          </span>
                                        ) : (
                                          <span className="text-success">
                                            {helpers.currencyFormat(
                                              Math.abs(item?.stake?.amount)
                                            )}
                                          </span>
                                        )}
                                      </td>
                                      <td>
                                        {helpers.currencyFormat(
                                          item?.stake?.commission
                                        )}
                                      </td>
                                      <td>
                                        {Math.sign(item?.stake?.amount) !==
                                          -1 ? (
                                          <span className="text-danger">
                                            (
                                            {helpers.currencyFormat(
                                              "-" + item?.stake?.amount
                                            )}
                                            )
                                          </span>
                                        ) : (
                                          <span className="text-success">

                                            {helpers.currencyFormat(
                                              Math.abs(item?.stake?.amount)
                                            )}

                                          </span>
                                        )}
                                      </td>
                                </tr>
                                <tr
                                  className=""
                                  id={item?._id}
                                  style={{ display: getProperty }}
                                  key={item?._id}
                                >
                                </tr>
                              </>
                            )
                            :
                            ("")
                          })
                        ) : (
                          <tr>
                            <td colSpan={12}>
                              <span>You have no bets in this time period.</span>
                            </td>
                          </tr>
                        )}
                        {data && data?.length > 0 && (
                          <>
                            <tr>
                                <th scope="col">Total</th>
                                <th scope="col">
                                  {" "}
                                  {helpers.currencyFormat(sumData?.stakeAmount)}
                                </th>
                                <th scope="col">
                                  {Math.sign(sumData?.PlayerPL) !==
                                    -1 ? (
                                    <span className="text-danger">
                                      (
                                      {helpers.currencyFormat(
                                        "-" + sumData?.PlayerPL
                                      )}
                                      )
                                    </span>
                                  ) : (
                                    <span className="text-success">

                                      {helpers.currencyFormat(
                                        Math.abs(sumData?.PlayerPL)
                                      )}

                                    </span>
                                  )}
                                </th>
                                <th scope="col">

                                  {Math.sign(sumData?.PlayerPL) ===
                                    -1 ? (
                                    <span className="text-danger">
                                      (
                                      {helpers.currencyFormat(
                                        sumData?.PlayerPL
                                      )}
                                      )
                                    </span>
                                  ) : (
                                    <span className="text-success">

                                      {helpers.currencyFormat(
                                        Math.abs(sumData?.PlayerPL)
                                      )}

                                    </span>
                                  )}
                                </th>
                                <th scope="col">
                                  {" "}
                                  {helpers.currencyFormat(sumData?.commission)}
                                </th>
                                <th scope="col">
                                  {Math.sign(sumData?.PlayerPL) !==
                                    -1 ? (
                                    <span className="text-danger">
                                      (
                                      {helpers.currencyFormat(
                                        "-" + sumData?.PlayerPL
                                      )}
                                      )
                                    </span>
                                  ) : (
                                    <span className="text-success">

                                      {helpers.currencyFormat(
                                        Math.abs(sumData?.PlayerPL)
                                      )}

                                    </span>
                                  )}
                                </th>
                            </tr>
                          </>
                        )}
                      </>
                    </tbody>
                  </Table>
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

export default ICasinoprofitAndLossDownlineNew;