import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import { toast } from "wc-toast";
import { useLocation, useParams, Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { compact, isEmpty, startCase } from "lodash";
import AuthContext from "../context/AuthContext";
import helpers from "../utils/helpers";
import moment from "moment";
import { Helmet } from "react-helmet";
// import DetailSlip from "../components/DetailSlip";

const SpinReport = () => {
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
    keyword:"",
    fromPeriod: previousDate,
    toPeriod: currentDate,
    filterByDay: "",
    limit: 100,
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
    let path = apiPath.spinReport;

    try {
      const { status, data: response_users } = await apiGet(
        path,
        type == "search" ? filter : type
      );
      if (status === 200) {
        if (response_users.success) {
          setData(response_users.results);
          setPageCount(response_users.results.totalPages);
          const totalspincount = response_users?.results?.data?.reduce(
            (a, v) => {
              a = parseInt(a) + parseInt(v?.spin);
              return a;
            },
            0
          );

          const totalspinamount = response_users?.results?.data?.reduce(
            (a, v) => {
              a = parseFloat(a) + parseFloat(v?.amount);
              return a;
            },
            0
          );

          setObj({
            totalspincount: totalspincount || 0,

            totalspinamount: totalspinamount || 0,
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
  }, [filter?.eventType]);

 
  return (
    <div>
      {/* <Helmet>
        <meta name="viewport" content="width=device-width,  initial-scale=.2" />
      </Helmet> */}
      <section className="main-inner-outer py-4">
        <Container fluid>
          <Row>
            <div className="db-sec">
              <h2 className="common-heading">
               Spin Report
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
                            <Form.Label className="px-2">username</Form.Label>
                            <Form.Group className="form-group">
                              <Form.Control
                                className="small_form_control"
                                onChange={(e) =>
                                  setFilter({
                                    ...filter,
                                    keyword: e.target.value,
                                   
                                  })
                                }
                               
                                type="text"
                              />
                             
                            </Form.Group>
                          </div>
                        </Col>
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
                        <Col lg={2} sm={3} className="mb-lg-0 mb-3">
                          <div className="bet-sec">
                            <Form.Label>Last</Form.Label>
                            <Form.Select
                              className="small_select"
                              onChange={(e) =>
                                setFilter({ ...filter, limit: e.target.value })
                              }
                              value={filter.limit}
                              aria-label="Default select example"
                            >
                              <option value={100}>100 Txn</option>
                              <option value={200}>200 Txn</option>
                              <option value={500}>500 Txn</option>
                              <option value={1000}>1000 Txn</option>
                              <option value={5000}>5000 Txn</option>
                              <option value={10000}>10000 Txn</option>
                              <option value={""}>All</option>
                            </Form.Select>
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
                              : "me-0 theme_light_btn"
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
                              : "me-0 theme_light_btn"
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
                          className="me-0 theme_light_btn"
                          onClick={() => {
                            setFilter({
                              page: 1,
                              page_size: 10,
                               keyword: "",
                              fromPeriod: previousDate,
                              toPeriod: currentDate,
                              filterByDay: "",
                              created_by: parmas.id ? parmas.id : user?._id,
                              userType: parmas.user_type
                                ? parmas.user_type
                                : user?.userType,
                            });
                            getData({
                              page: 1,
                              page_size: 10,
                              keyword: "",
                              fromPeriod: previousDate,
                              toPeriod: currentDate,
                              filterByDay: "",
                              created_by: parmas.id ? parmas.id : user?._id,
                              userType: parmas.user_type
                                ? parmas.user_type
                                : user?.userType,
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
              <section className="account-table aprofit-downline aprofit-market w-100">
                <div className="responsive transaction-history table-color">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col" style={{ width: `5%` }}>
                          {" "}
                          &nbsp;
                        </th>
                        <th scope="col" style={{ width: `10%` }}>
                          {" "}
                          Username
                        </th>
                        <th scope="col" style={{ width: `10%` }}>
                          {" "}
                          Spin Count
                        </th>
                        <th scope="col" style={{ width: `10%` }}>
                          Spin Win
                        </th>
                        <th scope="col" style={{ width: `10%` }}>
                          Created Date
                        </th>
                        {/*<th scope="col" style={{width:`65%`}}>Referral Username</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      <>
                        {data?.data &&
                          data?.data?.map((matchList, index) => {
                            return (
                              <tr key={index}>
                                <td>&nbsp;</td>

                                <td>{matchList.username}</td>
                                <td>{matchList.spin}</td>
                                <td>{matchList.amount || 0}</td>
                                <td>
                                  {helpers.dateFormat(
                                    matchList?.createdAt,
                                    user?.timeZone
                                  )}
                                </td>
                                {/*<td>{matchList.referrals}</td> */}
                              </tr>
                            );
                          })}
                        {isEmpty(data?.data) ? (
                          <tr>
                            <td colSpan={5}>No records found</td>
                          </tr>
                        ) : null}
                        {data?.data && data?.data?.length > 0 && (
                          <>
                            <tr>
                               <th>&nbsp;</th>
                              <th scope="col">Total</th>
                              <th>{obj?.totalspincount}</th>
                              <th>{obj?.totalspinamount}</th>
                               <th>&nbsp;</th>
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

export default SpinReport;
