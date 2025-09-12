import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { apiGet, apiPut } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import { isEmpty } from "lodash";
import ReactPaginate from "react-paginate";
import { useForm } from "react-hook-form";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import { toast } from "wc-toast";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import UpdateDialogBox from "../components/UpdateDialogBox";
import moment from "moment-timezone";

const ReferralReport = () => {
  let { user } = useContext(AuthContext);
  const [mark, setMark] = useState(false);
  const setMarkToggle = () => setMark(!mark);
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState({
    type: "",
    id: "",
  });
  const setOpenToggle = () => {
    setOpen(!open);
    setModel({
      type: "",
      id: "",
    });
  };
  const { handleSubmit, reset } = useForm({});
  const [updateDate, setUpdateDate] = useState(false);
  const setUpdateDateToggle = () => setUpdateDate(!updateDate);
  const [isLoader, setLoader] = useState(false);
  const [matchData, setMatchData] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);
  const [getUpdateId, setUpdateId] = useState("");
  const [getMatchStatus, setMatchStatus] = useState("");
  const [getEventID, setEventId] = useState("");
  const [getEventName, setEventName] = useState("");
  const [getDate, setDate] = useState("");

  var previousDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  var currentDate = moment().format("YYYY-MM-DD");
   const [filter, setFilter] = useState({
      page: 1,
      page_size: 10,
      keyword:"",
      fromPeriod: previousDate,
      toPeriod: currentDate,
      filterByDay: "",
      limit: 100,
    });

const getData = async () => {
  try {
    setLoader(true);

    // Apply date filters
    if (filter.filterByDay !== "") {
      if (filter.filterByDay === "today") {
        filter.fromPeriod = currentDate;
        filter.toPeriod = currentDate;
      } else if (filter.filterByDay === "yesterday") {
        filter.fromPeriod = previousDate;
        filter.toPeriod = currentDate;
      }
    }

    const { status, data: response_users } = await apiGet(apiPath.referralReport, filter);

    if (status === 200) {
      if (response_users?.success) {
        setMatchData(response_users.results);
      } else {
        console.error("API responded with success: false", response_users);
      }
    } else {
      console.error("Unexpected status code:", status);
    }

  } catch (error) {
    console.error("Error fetching referral report:", error);
  } finally {
    setLoader(false);
  }
};

  const handlePageClick = (event) => {
    setFilter((prevState) => {
      return {
        ...prevState,
        page: event.selected + 1,
      };
    });
    setViewPage(event.selected);
  };

  const handleSearch = (keyword) => {
    setFilter((prevState) => {
      return {
        ...prevState,
        page: 1,
        keyword: keyword,
      };
    });
  };



  useEffect(() => {
    setPageCount(matchData?.totalPages || []);
  }, [matchData]);

  useEffect(() => {
    getData();
    //setViewPage(filter.page ? filter.page - 1 : 0);
  }, []);



 
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Referral Report</h2>
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
                                placeholder="Enter username"
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
                              
                             
                            });
                            getData({
                              page: 1,
                              page_size: 10,
                              keyword: "",
                              fromPeriod: previousDate,
                              toPeriod: currentDate,
                              filterByDay: "",
                             
                              
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
          <div className="inner-wrapper">
            <div className="common-container">
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                         <th scope="col" style={{width:`5%`}}> &nbsp;</th>
                        <th scope="col" style={{width:`10%`}}> Referred By</th>
                        <th scope="col" style={{width:`10%`}}>Player Count</th>
                            <th scope="col" style={{width:`10%`}}>Total P/L</th>
                        <th scope="col" style={{width:`10%`}}>Bonus Earned</th>
                        <th scope="col" style={{width:`65%`}}>Referral Username</th>
                       
                      </tr>
                    </thead>
                    <tbody>
                      {matchData &&
                        matchData?.map((matchList, index) => {
                        
                          return (
                            <tr key={index}>
                                <td>&nbsp;</td>
                             
                              <td>{matchList.username}</td>
                              <td>{helpers.currencyFormat(matchList.count) || 0.00}</td>
                              <td>{Math.sign(matchList.refreralLoss) === 1? 
                                <span className="text-success">{helpers.currencyFormat(Math.abs(matchList.refreralLoss))}</span>
                                :<span className="text-danger">{helpers.currencyFormat(Math.abs(matchList.refreralLoss))}</span>
                              }
                                </td>
                               <td>{helpers.currencyFormat(matchList.earnd) || 0.00}</td>
                              <td>{matchList.referrals}</td>
                              
                            </tr>
                          );
                        })}
                      {isEmpty(matchData.data) ? (
                          <>
                            {isLoader ?
                              <tr><td colSpan="8" style={{ textAlign: `center` }}>
                                <div class="lds-ellipsis">

                                <div></div><div></div><div></div><div></div>

                              </div> <p>Please wait report is loading ...</p></td></tr>
                              : null
                            }

                          </>
                        ) : null}
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
                      activeClassName="p-1"
                      activeLinkClassName="pagintion-li"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
};

export default ReferralReport;
