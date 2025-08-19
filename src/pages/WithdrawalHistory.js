import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { apiGet, apiPost } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import ReactPaginate from "react-paginate";
import { useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { startCase } from "lodash";
import obj from "../utils/helpers";
import moment from "moment";
const WithdrwalHistory = () => {
  let { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const location = useLocation();
  var previousDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  var currentDate = moment().format("YYYY-MM-DD");
  const [filter, setFilter] = useState({
    startDate: previousDate,
    endDate: currentDate,
    filterByDay: "",
    page: 1,
    limit: 1000,
    keyword: "",
    status: "",
  });

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
    const { status, data: response_users } = await apiPost(
      apiPath.walletHistory,
      obj
    );
    if (status === 200) {
      if (response_users.success) {
        setData(response_users?.results);
      }
    }
  };

  const handlePageClick = (event) => {
    let obj = {
      ...filter,
      page: event.selected + 1,
      limit: filter?.limit,
      startDate: filter?.startDate,
      endDate: filter?.endDate,
      keyword: filter?.keyword,
      status: filter?.status,
    };
    setFilter(obj);
    getData(obj);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Wallet Withdrawal History</h2>
          </div>
          <div className="inner-wrapper">
            <div className="common-container">
              {" "}
              <Form className="">
                <div className="bet_status mb-0">
                  <Row>
                    <Col
                      lg={2}
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
                      lg={2}
                      sm={6}
                      className="mb-lg-0 mb-3 flex-grow-0 pe-3 "
                    >
                      <Form.Group className="position-relative d-flex align-items-center">
                        <Form.Select
                          style={{ height: "2.5rem" }}
                          className="small_select"
                          onChange={(e) =>
                            setFilter({ ...filter, status: e.target.value })
                          }
                          value={filter.status}
                          aria-label="Default select example"
                        >
                          <option value="">Select Status</option>
                          <option value="approve">Approve</option>
                          <option value="decline">Decline</option>
                        </Form.Select>
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
                                    startDate: e.target.value,
                                    filterByDay: "",
                                  })
                                }
                                max={new Date().toISOString().split("T")[0]}
                                value={filter.startDate}
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
                                    endDate: e.target.value,
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
                                value={filter.endDate}
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
                    <Col
                      lg={3}
                      sm={6}
                      className="mb-lg-0 mb-3 d-flex align-items-center"
                    >
                      {" "}
                      <ul className="list-unstyled mb-0 d-flex">
                        <li style={{ marginRight: "15px" }}>
                          <Button
                            className={"me-0 theme_light_btn"}
                            onClick={(e) =>
                              setFilter({
                                ...filter,
                                filterByDay: "today",
                                startDate: currentDate,
                                endDate: currentDate,
                              })
                            }
                          >
                            Just For Today
                          </Button>
                        </li>
                        <li>
                          <Button
                            className={
                              // filter.filterByDay === "yesterday"
                              //   ? "me-0 theme_dark_btn"
                              //   :
                              "me-0 theme_light_btn"
                            }
                            onClick={(e) =>
                              setFilter({
                                ...filter,
                                filterByDay: "yesterday",
                                startDate: previousDate,
                                endDate: currentDate,
                              })
                            }
                          >
                            From Yesterday
                          </Button>
                        </li>
                      </ul>
                    </Col>
                    <Col
                      lg={2}
                      sm={6}
                      className="mb-lg-0 mt-2 d-flex align-items-center"
                    >
                      <ul className="list-unstyled mb-0 d-flex">
                        <li>
                          <Button
                            className="theme_light_btn theme_dark_btn"
                            onClick={() => getData(filter)}
                          >
                            Search
                          </Button>
                        </li>
                        <li>
                          <Button
                            className="theme_light_btn"
                            onClick={() => {
                              setFilter({
                                startDate: previousDate,
                                endDate: currentDate,
                                filterByDay: "",
                                page: 1,
                                limit: 10,
                                keyword: "",
                                status: "",
                              });
                              getData({
                                startDate: previousDate,
                                endDate: currentDate,
                                filterByDay: "",
                                page: 1,
                                limit: 10,
                                keyword: "",
                                status: "",
                              });
                            }}
                          >
                            Reset
                          </Button>
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </div>
              </Form>
              <section className="total-balance-sec was">
                <Container fluid className="px-0">
                  <ul className="list-unstyled">
                    <li>
                      <dt>Approve Withdrawal Amount</dt>
                      <strong>
                        BDT{" "}
                        {`${obj.currencyFormat(data?.totalApproveAmount)}`}
                      </strong>
                    </li>
                    <li>
                      <dt>Decline Withdrawal Amount</dt>
                      <strong>
                        BDT{" "}
                        {`${obj.currencyFormat(data?.totalDeclineAmount)}`}
                      </strong>
                    </li>
                  </ul>
                </Container>
              </section>
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Sr no.</th>
                        <td scope="col">Username</td>
                        <th scope="col">Account Name</th>
                        <th scope="col">Bank Name</th>
                        <th scope="col">Bank Account</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Transaction Type</th>
                        <th scope="col">Created Date</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    {data?.data && data?.data?.length > 0 ? (
                      data?.data?.map((item, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{item?.username || item?.userId}</td>
                            <td>{item?.AccountName}</td>
                            <td>{item?.bank_name || item.bank}</td>
                            <td>{item?.BankAccount || "-"}</td>
                            <td>{item?.amount}</td>
                            <td>{startCase(item?.type) || "-"}</td>
                            <td>{obj?.dateFormat(item?.createdAt)}</td>

                            <td>
                              {(item?.status == "completed" && item?.transferedProcess=="process")?<span className="text-success">Processing</span>:item?.status == "completed"
                                ?<span className="text-success">Approve</span>
                                :<span className="text-danger">Decline</span>}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={12}>
                          <span>No Record Found.</span>
                        </td>
                      </tr>
                    )}
                  </Table>
                </div>
                {(data?.hasNextPage || data?.hasPrevPage) && (
                  <div className="bottom-pagination">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel=" >"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={10}
                      pageCount={data?.totalPages}
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
        </Container>
      </section>
    </div>
  );
};

export default WithdrwalHistory;
