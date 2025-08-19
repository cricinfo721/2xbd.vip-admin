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

const AprofitMarket = () => {
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
    eventType:4,
  });

  const handlePageClick = (event) => {
    setFilter((prevState) => {
      return {
        ...prevState,
        page: event.selected + 1,
      };
    });
  };

  const showDetail = async (event, eventId, eventType) => {

    try {
      const { status, data: response_users } = await apiGet(
        apiPath.reportMarketDetail + "?fromPeriod=" + filter.fromPeriod + "&toPeriod=" + filter.toPeriod + "&eventType=" + eventType + "&eventId=" + eventId
      );
      if (status === 200) {
        if (response_users.success) {
          setDetailsData(response_users.results);
          const detailDiv = document.getElementById(eventId);
          let table = '<td colSpan="7" class="abc"><table width="100%" class="sub-table ">';
          response_users.results.forEach((item, index) => {
            table = table + `<tr>`;
            table = table + `<td >${item?.betFaireType=="fancy"?"Fancy":"Odds"}</td>`;
            table = table + `<td>0</td>`;
            table = table + `<td>${item?.amount ?(Math.sign(item?.amount) !== -1 ? ("<span class='text-danger'>" + "(" + "-" + helpers.currencyFormat(item?.amount) + ")" + "</span>") : "<span class='text-success'>" + (helpers.currencyFormat(Math.abs(item?.amount)))):("")}</span></td>`;
            table = table + `<td>${item?.amount ?(Math.sign(item?.amount) === -1 ? ("<span class='text-danger'>" + "(" + helpers.currencyFormat(item?.amount) + ")" + "</span>") : "<span class='text-success'>" + (helpers.currencyFormat(Math.abs(item?.amount)))):("")}</span></td>`;
            table = table + `<td>${helpers.currencyFormat(item?.commission)}</td>`;
            table = table + `<td>${item?.amount ?(Math.sign(item?.amount) !== -1 ? ("<span class='text-danger'>" + "(" + "-" + helpers.currencyFormat(item?.amount) + ")" + "</span>") : "<span class='text-success'>" + (helpers.currencyFormat(Math.abs(item?.amount)))):("")}</span></td>`;
           table = table + `<td><a style="padding: 5px ;text-decoration:none" class='me-0 theme_light_btn theme_dark_btn' href="/match-market-bets/${eventId}/${item?.betFaireType}" target="_blank">Show Bets</a></td>`;
            table += `</tr>`;
          });
          table += "</table></td >";

          if (detailDiv.style.display === "none") {
            detailDiv.style.setProperty("display", "contents");
            event.target.className = "fas fa-minus-square pe-2";
            detailDiv.innerHTML = table;
          } else {
            detailDiv.style.setProperty("display", "none");
            event.target.className = "fas fa-plus-square pe-2";
          }

        }
      }
    } catch (err) {
      toast.error(err.response.data.message);
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
    let  path = apiPath.reportMarket;

    try {
      const { status, data: response_users } = await apiGet(
        path,
        type == "search" ? filter : type
      );
      if (status === 200) {
        if (response_users.success) {
          setData(response_users.results.data);
          //setSumData(response_users.results.sumData);

          setPageCount(response_users.results.totalPages);
          const commission = response_users?.results?.data?.reduce((a, v) => {
            a = parseInt(a) + parseInt(v?.commission);
            return a;
          }, 0);
          // const stake = response_users?.results?.data?.reduce((a, v) => {
          //   a = parseInt(a) + parseInt(v?.stake?.realAmount);
          //   return a;
          // }, 0);
          const downlinePnl = response_users?.results?.data?.reduce((a, v) => {
            a = parseFloat(a) + parseFloat(v?.amount);
            return a;
          }, 0);


          setObj({
            commission: commission || 0,
            stake: 0,
            downlinePnl: downlinePnl || 0,
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
    let  path = apiPath.reportMarket;

    try {
      const { status, data: response_users } = await apiGet(path, obj);
      if (status === 200) {
        if (response_users.success) {
          setData(response_users.results.data);
          setPageCount(response_users.results.totalPages);
        }
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };
console.log("data",data);
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <Row>
            <div className="db-sec">
              <h2 className="common-heading">
                Profit/Loss Report by{" "}
                {check == "AprofitMarket" ? "Market" : "Downline"}
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
          <Col md={6} className="">
                <div className="d-flex flex-wrap live-match-bat justify-sm-content-end">
                  <Button
                    onClick={(e) =>
                      setFilter({
                        ...filter,
                        eventType: 4,

                      })
                    }
                    className={filter.eventType=="4"?"mb-2 mx-1  green-btn":"mb-2 mx-1 theme_light_btn"}
                  >
                    Cricket
                  </Button>
                  <Button
                     onClick={(e) =>
                      setFilter({
                        ...filter,
                        eventType: 1,

                      })
                    }
                    className={filter.eventType=="1"?"mb-2 mx-1  green-btn":"mb-2 mx-1 theme_light_btn"}
                  >
                    Soccer
                  </Button>
                  <Button
                     onClick={(e) =>
                      setFilter({
                        ...filter,
                        eventType: 2,

                      })
                    }
                    className={filter.eventType=="2"?"mb-2 mx-1  green-btn":"mb-2 mx-1 theme_light_btn"}
                  >
                    Tenis
                  </Button>
                </div>
              </Col>
            <Col md={12} sm={12} lg={12} className="mt-2">
              <section className="account-table aprofit-downline aprofit-market">
                <div className="responsive transaction-history table-color">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">UID</th>
                        <th scope="col">Stake</th>
                        <th scope="col">Downline P/L</th>
                        <th scope="col">Player P/L</th>
                        <th scope="col">Comm.</th>
                        <th scope="col" colSpan={2}>Upline P/L</th>
                      </tr>
                    </thead>
                    <tbody>

                      <>
                        {data && data?.length > 0 ? (
                          data?.map((item, index) => {
                            return (
                              <>
                              {item?.amount!=0 ?(<>
                              <tr key={index + 1}>
                                 <td>

                                 <>
                                  <i
                                    id={"icon_" + item?._id}
                                    className="fas fa-plus-square pe-2"
                                    onClick={(e) =>
                                      showDetail(e, item?.eventId, item?.eventType)
                                    }
                                  ></i>
                                  <Link
                                    to={`/AprofitDownline/${item._id}/${item?.userType}`}
                                    onClick={() => search(item)}
                                  >
                                    {item?.betFaireType=="fancy"?"Fancy":"Odds"} ▸ {item?.matchName}
                                  </Link>
                                </>
                                </td>
                                 <td>0</td>
                                 <td>
                                        {" "}
                                        {item?.amount ?(
                                        Math.sign(item?.amount) !==
                                          -1 ? (
                                          <span className="text-danger">
                                            (
                                            {helpers.currencyFormat(
                                              "-" + item?.amount
                                            )}
                                            )
                                          </span>
                                        ) : (
                                          <span className="text-success">

                                            {helpers.currencyFormat(
                                              Math.abs(item?.amount)
                                            )}

                                          </span>
                                        )
                                        ):("-")}
                                      </td>
                                      <td>
                                      {item?.amount ?(Math.sign(item?.amount) ===
                                          -1 ? (
                                          <span className="text-danger">
                                            (
                                            {helpers.currencyFormat(
                                              item?.amount
                                            )}
                                            )
                                          </span>
                                        ) : (
                                          <span className="text-success">
                                            {helpers.currencyFormat(
                                              Math.abs(item?.amount)
                                            )}
                                          </span>
                                        )
                                        ):("-")}
                                      </td>
                                      <td>
                                        {helpers.currencyFormat(
                                          item?.commission
                                        )}
                                      </td>
                                      <td>
                                      {item?.amount ?(Math.sign(item?.amount) !==
                                          -1 ? (
                                          <span className="text-danger">
                                            (
                                            {helpers.currencyFormat(
                                              "-" + item?.amount
                                            )}
                                            )
                                          </span>
                                        ) : (
                                          <span className="text-success">

                                            {helpers.currencyFormat(
                                              Math.abs(item?.amount)
                                            )}

                                          </span>
                                        )):("-")}

                                      </td>
                                      <td>&nbsp;</td>
                              </tr>

                                <tr
                                  className=""
                                  id={item?.eventId}
                                  style={{ display: getProperty }}
                                  key={item?.eventId}
                                ></tr>
                                        </> ):"" }
                              </>
                            );
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
                                <th scope="col">0</th>
                                <th>
                                        {" "}
                                        {obj?.downlinePnl ?(
                                        Math.sign(obj?.downlinePnl) !==
                                          -1 ? (
                                          <span className="text-danger">
                                            (
                                            {helpers.currencyFormat(
                                              "-" + obj?.downlinePnl
                                            )}
                                            )
                                          </span>
                                        ) : (
                                          <span className="text-success">

                                            {helpers.currencyFormat(
                                              Math.abs(obj?.downlinePnl)
                                            )}

                                          </span>
                                        )
                                        ):("-")}
                                      </th>
                                      <th>
                                      {obj?.downlinePnl ?(Math.sign(obj?.downlinePnl) ===
                                          -1 ? (
                                          <span className="text-danger">
                                            (
                                            {helpers.currencyFormat(
                                              obj?.downlinePnl
                                            )}
                                            )
                                          </span>
                                        ) : (
                                          <span className="text-success">
                                            {helpers.currencyFormat(
                                              Math.abs(obj?.downlinePnl)
                                            )}
                                          </span>
                                        )
                                        ):("-")}
                                      </th>
                                      <th>
                                        {helpers.currencyFormat(
                                          obj?.commission
                                        )}
                                      </th>
                                      <th>
                                      {obj?.downlinePnl ?(Math.sign(obj?.downlinePnl) !==
                                          -1 ? (
                                          <span className="text-danger">
                                            (
                                            {helpers.currencyFormat(
                                              "-" + obj?.downlinePnl
                                            )}
                                            )
                                          </span>
                                        ) : (
                                          <span className="text-success">

                                            {helpers.currencyFormat(
                                              Math.abs(obj?.downlinePnl)
                                            )}

                                          </span>
                                        )):("-")}
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

export default AprofitMarket;
