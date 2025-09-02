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

const AllAprofitByDownline = () => {
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
  const [loader, setLoader] = useState(false);

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

  const showDetail = async (event, id, userType) => {

    try {
      const { status, data: response_users } = await apiGet(
        apiPath.reportDownlineDetail + "?fromPeriod=" + filter.fromPeriod + "&toPeriod=" + filter.toPeriod + "&userId=" + id + "&userType=" + userType
      );
      if (status === 200) {
        if (response_users.success) {
          setDetailsData(response_users.results);
          const detailDiv = document.getElementById(id);
          let table = '<td colSpan="6" class="abc"><table width="100%" class="sub-table">';
          response_users.results.forEach((item, index) => {
            table = table + `<tr>`;
            table = table + `<td >${item?.username || null}</td>`;
            table = table + `<td>${helpers.currencyFormat(item?.stakeAmount ? item?.stakeAmount : 0)}</td>`;
            table = table + `<td>${Math.sign(item?.amount) !== -1 ? ("<span class='text-danger'>" + "(" + "-" + helpers.currencyFormat(item?.amount) + ")" + "</span>") : "<span class='text-success'>" + (helpers.currencyFormat(Math.abs(item?.amount)))}</span></td>`;
            table = table + `<td>${Math.sign(item?.amount) === -1 ? ("<span class='text-danger'>" + "(" + helpers.currencyFormat(item?.amount) + ")" + "</span>") : "<span class='text-success'>" + (helpers.currencyFormat(Math.abs(item?.amount)))}</span></td>`;
            table = table + `<td>${helpers.currencyFormat(item?.stake?.commission)}</td>`;
            table = table + `<td>${Math.sign(item?.amount) !== -1 ? ("<span class='text-danger'>" + "(" + "-" + helpers.currencyFormat(item?.amount) + ")" + "</span>") : "<span class='text-success'>" + (helpers.currencyFormat(Math.abs(item?.amount)))}</span></td>`;
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
    setLoader(true)
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
    let path;
    if (check == "AllAprofitByDownline") {
      path = apiPath.reportDownlineNew;
    } else {
      path = apiPath.reportMarket;
    }
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
          const sportsPL = response_users?.results?.data?.reduce((a, v) => {
            a = parseInt(a) + parseInt(v?.sportData?.amount);
            return a;
          }, 0);
          const casinoPL = response_users?.results?.data?.reduce(
            (a, v) => {
              a = parseInt(a) + parseInt(v?.casinoData?.amount);
              return a;
            },
            0
          );
          
          setObj({
            commission: commission || 0,
            stake: stake || 0,
            totalSportsPL: sportsPL || 0,
            totalCasinoPL: casinoPL || 0,
          });
          setLoader(false)
        }
      }
    } catch (err) {
      setLoader(false)
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    getData();
    setViewPage(filter.page ? filter.page - 1 : 0);
  }, []);

  const search = async (item) => {
    setLoader(true)
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
    let path;
    if (check == "AllAprofitByDownline") {
      path = apiPath.reportDownlineNew;
    } else {
      path = apiPath.reportMarket;
    }
    try {
      const { status, data: response_users } = await apiGet(path, obj);
      if (status === 200) {
        if (response_users.success) {
          setData(response_users.results.data);
          setPageCount(response_users.results.totalPages);
          setSumData(response_users.results.sumData);
          // console.log(response_users.results.data, "data");
          const commission = response_users?.results?.data?.reduce((a, v) => {
            a = parseInt(a) + parseInt(v?.sportData?.commission);
            return a;
          }, 0);
          const stake = response_users?.results?.data?.reduce((a, v) => {
            a = parseInt(a) + parseInt(v?.stake?.realAmount);
            return a;
          }, 0);
          const sportsPL = response_users?.results?.data?.reduce((a, v) => {
            a = parseInt(a) + parseInt(v?.sportData?.amount);
            return a;
          }, 0);
       
          const casinoPL = response_users?.results?.data?.reduce(
            (a, v) => {
              a = parseInt(a) + parseInt(v?.casinoData?.amount);
              return a;
            },
            0
          );
          if (check == "AllAprofitByDownline") {
          setObj({
            commission: commission || 0,
            stake: stake || 0,
            totalSportsPL: sportsPL || 0,
            totalCasinoPL: casinoPL || 0,
          });
         } else{
          setObj({
            commission: commission || 0,
            stake: stake || 0,
            totalSportsPL: sportsPL || 0,
            totalCasinoPL: casinoPL || 0,
          });
          }
          setLoader(false);
        }
      }
    } catch (err) {
      setLoader(false)
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
             All Profit/Loss Report by{" "}
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
                  <div className="history-btn mt-2 aprofitdownline-filter">
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
                          Get P & L
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
{console.log("loader",loader,data?.length)}
            <Col md={12} sm={12} lg={12} className="mt-2">
              <section className="account-table aprofit-downline">
                <div className="responsive transaction-history">
                  <Table>
                  { data?.length > 0 && !loader ? (
                        <>
                    <thead>
                      <tr>
                        <th scope="col">UID</th>
                        {check == "AprofitMarket" && (
                          <>
                            <th scope="col">Sports</th>
                            <th scope="col">Client Name</th>
                            <th scope="col">Report Type</th>
                            <th scope="col">Event Name</th>
                            <th scope="col">Report Name</th>
                            <th scope="col">Comm.</th>
                            <th scope="col">Upline/Total P/L</th>
                          </>
                        )}

                        {check !== "AprofitMarket" && (
                          <>
                            {/* <th scope="col">Stake</th>
                            <th scope="col">Downline P/L</th>
                            <th scope="col">Player P/L</th>
                            <th scope="col">Comm.</th>
                            <th scope="col">Upline/Total P/L</th> */}
                            <th scope="col">Sports PL	</th>
                            <th scope="col">Casino P/L	</th>
                            <th scope="col">Comm.</th>
                            <th scope="col">Total P/L</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      
                      <>
                        {data && data?.length > 0 ? (
                          data?.map((item, index) => {
                            let totalpl=item?.sportData?.amount+item?.casinoData?.amount

                            return (item?.sportData?.amount===0 && item?.casinoData?.amount==0)?(""):(
                              <>
                                <tr key={index + 1}>
                                  {/* <td>
                                  <Link
                                    to={`/AprofitDownline/${item.id}/${item.id}`}
                                  >
                                    <i className="fas fa-plus-square pe-2"></i>{" "}
                                    <span className="d-inline-block">SD</span>
                                    {item.firstName} {item.lastName}
                                  </Link>
                                </td> */}
                                  {check == "AprofitMarket" && (
                                    <>
                                      <td>{item._id}</td>
                                      <td>
                                        {constant.betCheckObj[item.eventType]}
                                      </td>
                                      <td>{item.clientName}</td>
                                      <td>{item.reportType}</td>
                                      <td>{item.matchName}</td>
                                      <td>{item.reportName}</td>
                                      <td>0</td>
                                      <td>
                                        {item.transactionType == "credit" ? (
                                          <span className="text-success">
                                            {`( +${helpers.currencyFormat(
                                              item.amount
                                            )} )`}
                                          </span>
                                        ) : (
                                          <span className="text-danger">
                                            {`( -${helpers.currencyFormat(
                                              item.amount
                                            )} )`}
                                          </span>
                                        )}
                                      </td>
                                    </>
                                  )}
                                  {check !== "AprofitMarket" && (
                                    <>
                                      <td className="text-start">
                                        {item?.userType == "user" ? (
                                          <>
                                          <a href={"#"} className="text-primary">
                                            <span>
                                              {
                                                constant?.user_status[
                                                item?.userType || ""
                                                ]
                                              }
                                            </span>
                                            </a>
                                            {item?.username || null}
                                          </>
                                        ) : (
                                          <>
                                            
                                            <Link
                                              to={`/AllAprofitByDownline/${item._id}/${item?.userType}`}
                                              onClick={() => search(item)}
                                            >
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
                                      {" "}
                                        {Math.sign(item?.sportData?.amount) !==
                                          -1 ? (
                                          <span className="text-danger">
                                            (
                                            {helpers.currencyFormat(
                                              "-" + item?.sportData?.amount
                                            )}
                                            )
                                          </span>
                                        ) : (
                                          <span className="text-success">

                                            {helpers.currencyFormat(
                                              Math.abs(item?.sportData?.amount)
                                            )}

                                          </span>
                                        )}
                                      
                                      </td>
                                      <td>
                                      {" "}
                                        {Math.sign(item?.casinoData?.amount) !==
                                          -1 ? (
                                          <span className="text-danger">
                                            (
                                            {helpers.currencyFormat(
                                              "-" + item?.casinoData?.amount
                                            )}
                                            )
                                          </span>
                                        ) : (
                                          <span className="text-success">

                                            {helpers.currencyFormat(
                                              Math.abs(item?.casinoData?.amount)
                                            )}

                                          </span>
                                        )}
                                      
                                      </td>
                                      
                                      <td>
                                       
                                        {helpers.currencyFormat(
                                          item?.sportData?.commission
                                        )}
                                      </td>
                                      <td>
                                        {Math.sign(totalpl) !==
                                          -1 ? (
                                          <span className="text-danger">
                                            (
                                            {helpers.currencyFormat(
                                              "-" + Math.abs(totalpl)
                                            )}
                                            )
                                          </span>
                                        ) : (
                                          <span className="text-success">

                                            {helpers.currencyFormat(
                                              
                                              Math.abs(totalpl)
                                            )}

                                          </span>
                                        )}
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr
                                  className=""
                                  id={item?._id}
                                  style={{ display: getProperty }}
                                  key={item?._id}
                                >


                                 
                                </tr>
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
                            {check == "AprofitMarket" && (
                              <tr>
                                <th scope="col">Total</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                <th scope="col">
                                  {Math.sign(obj.downlinePnlAmount) === -1 ? (
                                    <span className="text-danger">
                                      {helpers.currencyFormat(
                                        Math.abs(obj.downlinePnlAmount)
                                      )}
                                    </span>
                                  ) : (
                                    <span className="text-success">
                                      (
                                      {helpers.currencyFormat(
                                        obj.downlinePnlAmount
                                      )}
                                      )
                                    </span>
                                  )}
                                </th>
                              </tr>
                            )}
                            {check !== "AprofitMarket" && (
                              
                              <tr>
                                <th scope="col">Total</th>
                                
                                <th scope="col">
                                  {Math.sign(obj?.totalSportsPL) !==
                                    -1 ? (
                                    <span className="text-danger">
                                      (
                                      {helpers.currencyFormat(
                                        "-" + Math.abs(obj?.totalSportsPL)
                                      )}
                                      )
                                    </span>
                                  ) : (
                                    <span className="text-success">

                                      {helpers.currencyFormat(
                                        Math.abs(obj?.totalSportsPL)
                                      )}

                                    </span>
                                  )}
                                </th>
                                <th scope="col">
                                  {Math.sign(obj?.totalCasinoPL) !==
                                    -1 ? (
                                    <span className="text-danger">
                                      (
                                      {helpers.currencyFormat(
                                        "-" + Math.abs(obj?.totalCasinoPL)
                                      )}
                                      )
                                    </span>
                                  ) : (
                                    <span className="text-success">

                                      {helpers.currencyFormat(
                                        Math.abs(obj?.totalCasinoPL)
                                      )}

                                    </span>
                                  )}
                                </th>
                                <th scope="col">
                                 
                                  {helpers.currencyFormat(sumData?.sport?.commission)}
                                </th>
                                <th scope="col">
                           
                                  {Math.sign(obj?.totalCasinoPL+obj?.totalSportsPL)!==
                                    -1 ? (
                                    <span className="text-danger">
                                      (
                                        {helpers.currencyFormat(
                                          Math.abs(obj?.totalCasinoPL+obj?.totalSportsPL))
                                      }
                                      )
                                    </span>
                                  ) : (
                                    <span className="text-success">

                                      {helpers.currencyFormat(
                                         Math.abs(obj?.totalCasinoPL+obj?.totalSportsPL)
                                      )}

                                    </span>
                                  )}
                                </th>
                              </tr>
                            )}
                          </>
                        )}
                        
                      </>
                      
                    </tbody>
                    </>  
                  ):<tr><td colSpan="8" style={{ textAlign: `center` }}><div class="lds-ellipsis">

                  <div></div><div></div><div></div><div></div>

                </div> <p>Please wait transaction is loading ...</p></td></tr>
                
                  }
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

export default AllAprofitByDownline;
