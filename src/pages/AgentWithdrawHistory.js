import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Button,
  Modal,
} from "react-bootstrap";
import { apiGet, apiPost } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import ReactPaginate from "react-paginate";
import { useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { startCase,isEmpty } from "lodash";
import obj from "../utils/helpers";
import moment from "moment";
import { toast } from "wc-toast";
import UpdateDialogBox from "../components/UpdateDialogBox";
const AgentWithdrawHistory = () => {
  let { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const location = useLocation();
  var previousDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  var currentDate = moment().format("YYYY-MM-DD");
  const [show, setShow] = useState(false);

  const [getUpdateId, setUpdateId] = useState("");
  const [viewData, setViewData] = useState(false);
  const [isLoader, setLoader] = useState(false);
  const [getProcessAction, setProcessAction] = useState("");
  const [getUpdateDate, setUpdateDate] = useState("");
  const setViewDataToggle = () => setViewData(!viewData);
  const setDataForView = (id, updateDate) => {
    setUpdateId(id);
    setUpdateDate(updateDate);
    setViewDataToggle();
  };
  const [getDetailsData, setDetailsData] = useState([]);

  const [filter, setFilter] = useState({
    startDate: previousDate,
    endDate: currentDate,
    filterByDay: "",
    page: 1,
    limit: 100,
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
    const { status, data: response_users } = await apiGet(
      apiPath.agentWithdrawHistory,
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


  const processAction = async (obj) => {
    setLoader(true);
    
    const { status, data: response_users } = await apiPost(
      apiPath.withdrawalProcessCheckUpdate,
      {
        TransactionRequestId: getUpdateId ? getUpdateId : "",
        status: getProcessAction ? getProcessAction : "getProcessAction",
      }
    );

    if (status === 200) {
      if (response_users.success) {
        toast.success(response_users?.message);
        getData();
        setUpdateId("");
        setShow(false);
        setViewDataToggle();
        setProcessAction("");
        setLoader(false);
      } else {
        toast.error(response_users?.message);
        getData();
        setUpdateId("");
        setShow(false);
        setViewDataToggle();
        setProcessAction("");
        setLoader(false);
      }
    } else {
      toast.error(response_users?.message);
      getData();
      setUpdateId("");
      setShow(false);
      setViewDataToggle();
      setProcessAction("");
      setLoader(false);
    }
  };

  const viewDetail = async () => {
    setDetailsData([]);
    const { status, data: response_users } = await apiPost(
      apiPath.withdrawalProcessCheck,
      {
        id: getUpdateId ? getUpdateId : "",
      }
    );
    if (status === 200) {
      if (response_users.success) {
        setDetailsData(response_users.results);
      }
    }
  };

  useEffect(() => {
    if (viewData) {
      viewDetail();
    }
  }, [viewData]);
  
  const [timeDuration, setTimeDuration] = useState([]);

  useEffect(() => {
    if (getDetailsData?.updatedAt) {
      setTimeDuration("");
      setTimeDuration(obj?.calculateDifferenceInMinutes(getDetailsData?.updatedAt));
    }
    
  }, [getDetailsData?.updatedAt]);

  // console.log("timeDuration",timeDuration)
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Agent Withdrawal History</h2>
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
                          <option value="processing">Processing</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col
                      lg={2}
                      sm={6}
                      className="mb-lg-0 mb-3 d-flex align-items-center"
                    >
                      <div className="bet-sec bet-period">
                        <Form.Label className="mt-2 me-2">From</Form.Label>
                        <Form.Group className="form-group">
                          <Form.Control
                            onChange={(e) =>
                              setFilter({
                                ...filter,
                                startDate: e.target.value,
                                filterByDay: "",
                              })
                            }
                            max={new Date().toISOString().split("T")[0]}
                            value={filter?.startDate}
                            type="date"
                          />
                        </Form.Group>
                      </div>
                    </Col>
                    <Col
                      lg={2}
                      sm={6}
                      className="mb-lg-0 mb-3 d-flex align-items-center"
                    >
                      <div className="bet-sec bet-period">
                        <Form.Label className="mt-2 me-2">To</Form.Label>
                        <Form.Group className="form-group">
                          <Form.Control
                            onChange={(e) =>
                              setFilter({
                                ...filter,
                                endDate: e.target.value,
                                filterByDay: "",
                              })
                            }
                            min={
                              filter?.startDate
                                ? new Date(filter?.startDate)
                                    .toISOString()
                                    .split("T")[0]
                                : new Date()
                            }
                            disabled={filter.startDate ? false : true}
                            max={new Date().toISOString().split("T")[0]}
                            value={filter?.endDate}
                            type="date"
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
                        {`${obj.currencyFormat(
                          // data?.data?.length > 0
                          //   ? data?.data.reduce((prev, acc) => {
                          //       return acc?.status == "completed"
                          //         ? prev + acc?.amount
                          //         : prev;
                          //     }, 0)
                          //   : 0.0
                          data?.totalApproveAmount||0.0
                        )}`}
                      </strong>
                    </li>
                    <li>
                      <dt>Decline Withdrawal Amount</dt>
                      <strong>
                        BDT{" "}
                        {`${obj.currencyFormat(
                          // data?.data?.length > 0
                          //   ? data?.data.reduce((prev, acc) => {
                          //       return acc?.status !== "completed"
                          //         ? prev + acc?.amount
                          //         : prev;
                          //     }, 0)
                          //   : 0.0
                          data?.totalDeclineAmount||0.0
                        )}`}
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
                        <th scope="col">Username</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Account Name</th>
                        <th scope="col">Bank Name</th>
                        <th scope="col">Bank Account</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Transaction Type</th>
                        <th>Requested Time</th>
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
                            <td>{item?.phone_number}</td>
                            <td>{item?.AccountName}</td>
                            <td>{item?.bank_name || item.bank}</td>
                            <td>{item?.BankAccount || "-"}</td>
                            <td>{item?.amount}</td>
                            <td>{startCase(item?.type) || "-"}</td>
                            <td>{item?.isResend==true?obj?.timeAgo( new Date(item?.updateDate)):""}</td>
                            <td>{obj?.dateFormat(item?.createdAt)}</td>
                            <td>
                              {item?.status == "completed" &&
                              item?.transferedProcess == "process" ? (
                                <>
                                  <span className="text-success">
                                    Processing
                                  </span>
                                  <button
                                    type="button"
                                    onClick={function (e) {
                                      setDataForView(item._id, item?.updatedAt);
                                    }}
                                    className="btn theme_light_btn"
                                  >
                                    <i class="fa-solid fa-eye"></i> View
                                  </button>
                                </>
                              ) : item?.status == "completed" ? (
                                <span className="text-success">Approve</span>
                              ) : (
                                <span className="text-danger">Decline</span>
                              )}
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
      <Modal
          show={viewData}
          onHide={setDataForView}
          className="change-status-modal"
        >
          <Modal.Header closeButton className="p-0 pb-2">
            <Modal.Title className="modal-title-status h4">
              Withdrawal Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="test-status border-0 text-start">
              <section className="account-table">
                <div className="responsive transaction-history">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Customer Number</th>
                        <th scope="col">agent</th>
                        <th scope="col">Bank Type</th>
                        <th scope="col">Device Id</th>
                        <th scope="col">sms</th>
                        {/* <th scope="col">Status</th> */}
                        <th scope="col">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!isEmpty(getDetailsData) && getDetailsData && (
                        <tr>
                          <td>{getDetailsData?.cust_number}</td>
                          <td>{getDetailsData?.agent}</td>
                          <td>{getDetailsData?.mfs_operator}</td>
                          <td>{getDetailsData?.device_unique_id}</td>
                          <td>{getDetailsData?.sms}</td>
                          {/* <td>{getDetailsData?.resend==true?"Already Sent":""}</td> */}

                          <td>{obj.dateFormat(getDetailsData?.updatedAt)}</td>
                        </tr>
                      )}
                      {isEmpty(getDetailsData) ? (
                        <tr>
                          <td colSpan={9}>No records found</td>
                        </tr>
                      ) : null}
                    </tbody>
                  </Table>
                
                   {/* {getDetailsData?.resend==false || (getDetailsData?.resend==true && timeDuration > 15 )? ( 
                    <>
                      <button
                        type="button"
                        onClick={function (e) {
                          setProcessAction("completed");
                          setShow(true);
                        }}
                        className="btn theme_light_btn text-success-btn"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={function (e) {
                          setProcessAction("voided");
                          setShow(true);
                        }}
                        className="btn theme_light_btn text-decline-btn"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={function (e) {
                          setProcessAction("resend");
                          setShow(true);
                        }}
                        className="btn theme_light_btn text-resend-btn"
                      >
                        Resend
                      </button>
                    </>
                   ) : (
                    ""
                  )}  */}
                </div>
              </section>
            </div>
          </Modal.Body>
        </Modal>
        {show && (
          <UpdateDialogBox
            open={show}
            onClose={() => setShow(false)}
            onSubmit={processAction}
            headerTitle={"Submit"}
            isLoader={isLoader}
            title={"Are you sure to  " + getProcessAction + "?"}
          />
        )}
    </div>
  );
};

export default AgentWithdrawHistory;
