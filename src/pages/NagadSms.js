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

const NagadSms = () => {
  const parmas = useParams();
  const location = useLocation();
  const user_params = compact(location.pathname.split("/"));
  let { user } = useContext(AuthContext);
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);
  var previousDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  var currentDate = moment().format("YYYY-MM-DD");
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    fromPeriod: previousDate,
    toPeriod: currentDate,
    filterByDay: "",
    keyword: "",
    created_by: parmas.id ? parmas.id : user?._id,
    userType: parmas.user_type ? parmas.user_type : user?.userType
  });

  const handlePageClick = (event) => {
    let obj = {
      ...filter,
      page: event.selected + 1,
      limit: filter?.limit,
    };
    setFilter(obj);
    getData(obj);
  };

  const getData = async (obj = filter) => {
    if (obj.filterByDay != "") {
      if (obj.filterByDay == "today") {
        obj.startDate = currentDate;
        obj.endDate = currentDate;
      }
      if (obj.filterByDay == "yesterday") {
        obj.startDate = previousDate;
        obj.endDate = currentDate;
      }
    }
    obj = {...obj,type:"nagad"}
    let path = apiPath.userSMSList;
    try {
      const { status, data: response_users } = await apiGet(path, obj);
      if (status === 200) {
        if (response_users.success) {
          setData(response_users?.results?.data);
          setPageCount(response_users?.results?.totalPages);
        }
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <Row>
            <div className="db-sec">
              <h2 className="common-heading">Nagad SMS</h2>
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
                          <Form.Group className="position-relative">
                            <Form.Control
                              type="text"
                              placeholder="Keyword"
                              value={filter?.keyword}
                              onChange={(e) =>
                                setFilter({
                                  ...filter,
                                  keyword: e.target.value,
                                })
                              }
                            />
                          </Form.Group>
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
                          className="me-0 theme_light_btn theme_dark_btn"
                          onClick={() => getData()}
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
                              userType: parmas.user_type
                                ? parmas.user_type
                                : user?.userType,
                            });
                            getData({
                              page: 1,
                              page_size: 10,
                              fromPeriod: previousDate,
                              toPeriod: currentDate,
                              filterByDay: "",
                              created_by: parmas.id ? parmas.id : user?._id,
                              userType: parmas.user_type
                                ? parmas.user_type
                                : user?.userType
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
              <section className="account-table aprofit-downline-sms">
                <div className="responsive transaction-history">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Sr no.</th>
                        <th scope="col">Sender</th>
                        <th scope="col">Message</th>
                        <th scope="col">Message Time</th>
                        <th scope="col">Transaction ID</th>
                        <th scope="col">App User</th>
                        <th scope="col">Device Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data && data?.length > 0 ? (
                        data?.map((item, index) => {
                          return (
                            <tr key={index + 1}>
                              <td>{item._id}</td>
                              <td>{item.sender}</td>
                              <td>{item.smsBody}</td>
                              <td>{item.createdAt}</td>
                              <td>{item.transactionId}</td>
                              <td>{item.username}</td>
                              <td>{item.device_name}</td>
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

export default NagadSms;
