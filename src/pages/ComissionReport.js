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
import obj from "../utils/constants";
import apiPath from "../utils/apiPath";
import moment from "moment";
import constants from "../utils/constants";
import ReactPaginate from "react-paginate";
import { useLocation, useParams, Link } from "react-router-dom";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
import classNames from "classnames";
import { toast } from "wc-toast";
import constant from "../utils/constants";
import { compact, isEmpty, startCase } from "lodash";
import { useForm, Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import VerifyOtp from "../components/VerifyOtp";
import EnterPassword from "../components/EnterPassword";

const ComissionReport = () => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    clearErrors,
    watch,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
  });
  const inputRef = React.useRef(null);
  const [modal, setModal] = useState(false);
  const parmas = useParams();
  const location = useLocation();
  const user_params = compact(location.pathname.split("/"));
  let { user, profileData, getProfileData } = useContext(AuthContext);
  const [results, setResults] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);
  var previousDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  var currentDate = moment().format("YYYY-MM-DD");
  const [settlementFilter, setSettlementFilter] = useState({});
  const [filter, setFilter] = useState({
    // page: 1,
    // page_size: 10,
    // fromPeriod: previousDate,
    // toPeriod: currentDate,
    // filterByDay: "",
    // created_by: parmas.id ? parmas.id : user?._id,
    // userType: parmas.user_type ? parmas.user_type : user?.userType,
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
    try {
      const { status, data: response_users } = await apiGet(
        apiPath.commisionReport,
        {}
      );
      if (status === 200) {
        setResults(response_users?.results || []);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const [withdrwaRequest, setWithdrwaRequest] = useState([]);
  const getWithdrwaRequest = async () => {
    try {
      const { status, data: response_users } = await apiGet(
        apiPath.withdrwaRequestList
      );
      if (status === 200) {
        setWithdrwaRequest(response_users?.results || []);
      }
    } catch (err) {}
  };

  useEffect(() => {
    getData();
    getWithdrwaRequest();
  }, []);

  useEffect(() => {
    if (!isEmpty(profileData)) {
      if (profileData?.phone?.toString()?.length > 5) {
        setValue("mobile", profileData?.phone);
      }
    }
  }, [profileData]);
  const onSubmit = async () => {
    try {
      const { status, data: response_users } = await apiPost(
        apiPath.updateUserReferenceAmount,
        {}
      );
      if (status === 200) {
        if (response_users.success) {
        } else {
          toast.error(response_users.message);
        }
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };
  const [prevData, setPrevData] = useState({});
  const [otp, setOtp] = useState(false);
  const [otpNumber, setOtpNumber] = useState("");

  const onSubmitWithdraw = async () => {
    let body = {
      amount: prevData?.amount,
      bank: prevData?.bank,
      AccountName: prevData?.AccountName,
      BankAccount: prevData?.BankAccount,
      phone_number: prevData?.phone_number,
      bankName: prevData?.bankName || "",
    };
    const { status, data } = await apiPost(apiPath.withdrawal, body);
    if (status == 200) {
      if (data?.success) {
        toast.success(data?.message);
        reset();
        getData();
        getWithdrwaRequest();
        if (profileData?.phone?.toString()?.length > 5) {
          getProfileData();
        }
        setOtp(false);
      } else {
        toast.error(data?.message);
        reset();
        setModal(false);
      }
    } else {
      toast.error(data?.message);
      reset();
      setModal(false);
    }
  };

  const sendOTP = async (body) => {
    if (profileData?.phone?.toString()?.length > 5) {
      body = {
        amount: body?.amount,
        bank: body?.bank,
        AccountName: body?.accountName || "Personal",
        BankAccount: body?.bankAccount,
        phone_number: body?.mobile,
        bankName: body?.bankName || "",
      };
    } else {
      body = {
        amount: body?.amount,
        bank: body?.bank,
        AccountName: body?.accountName || "Personal",
        BankAccount: body?.bankAccount,
        phone_number: body?.mobile,
        bankName: body?.bankName || "",
        mobile: body?.mobile?.substring(
          inputRef?.current?.state.selectedCountry?.countryCode?.length,
          body?.mobile?.toString()?.length
        ),
        countryCode: inputRef?.current?.state.selectedCountry?.countryCode,
      };
    }
     setOtp(true);
      setModal(false);
      setPrevData(body);
    // const { data: response_data, status } = await apiPost(
    //   apiPath.sendOTP,
    //   profileData?.phone?.toString()?.length > 5
    //     ? { phone: body?.phone_number }
    //     : {
    //         phone_number: body?.mobile,
    //         country_code: body?.countryCode,
    //       }
    // );
    // if (response_data?.success) {
    //   setOtpNumber(response_data?.results?.otp);
    //   setOtp(true);
    //   setModal(false);
    //   setPrevData(body);
    // } else {
    //   toast.error(response_data?.message);
    // }
  };

  const handelVerifyOTP = async (body) => {
    const { data: response_data, status } = await apiPost(
      apiPath.otpVerify,
      profileData?.phone?.toString()?.length > 5
        ? {
            otp: body?.otp,
            phone: prevData?.phone_number,
          }
        : {
            otp: body?.otp,
            phone_number: prevData?.mobile,
            country_code: prevData?.countryCode,
          }
    );
    if (response_data?.success) {
      toast.success(response_data?.message);
      setOtp(false);
      onSubmitWithdraw();
    } else {
      toast.error(response_data?.message);
    }
  };

  const checkWithdrawal = async () => {
    try {
      const { status, data: response_users } = await apiGet(
        apiPath.withdrawalCheck,
        {}
      );

      if (status === 200) {
        if (response_users.success) {
          setModal(true);
        } else {
          toast.error(response_users.message);
        }
      } else {
        toast.error(response_users.message);
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
            <marquee
              direction="left"
              class="transaction-errMsg text-danger depositMsg"
            >
              <p
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "800",
                  fontSize: "18px",
                  margin: 0,
                  padding: 0,
                }}
              >
                {`সপ্তাহে ৬০% কমিশন ব্যাংকের মাধ্যমে পুরোটাই উইথড্র করতে পারবেন। বিকাশ/নাগাদে দিনে ৩০ করে সপ্তাহে ২ লাখ উত্তলন করতে পারেন। ধন্যবাদ`}
              </p>
              <p  style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "800",
                  fontSize: "18px",
                  margin: 0,
                  padding: 0,
                }}>
               
                0-2 = 10% ,3-5= 20% ,5-8= 25% ,8+  Rest of Percent 
              </p>
            </marquee>
            <div className="d-flex p-3 w-100 justify-content-around">
              <div className="w-50 p-2">
                <h5
                  className="p-2"
                  style={{ background: "rgb(44,71,89)", color: "white" }}
                >
                  Commission Report
                </h5>
                <section className="total-balance-sec tbc">
                  <Container fluid className="px-0">
                    <ul className="list-unstyled">
                      <li>
                        <dt>Total Turnour</dt>
                        <strong>
                          BDT{" "}
                          {`${helpers.currencyFormat(
                            Math.abs(results?.totalBet)
                          )}`}
                        </strong>
                      </li>

                      <li>
                        <dt>Total Commission</dt>
                        <strong>
                          BDT {`${helpers.currencyFormat(results?.sumData)}`}
                        </strong>
                      </li>
                    </ul>
                  </Container>
                </section>
                <section className="account-table">
                  <div className="container-fluid px-0">
                    <div className="responsive table-color">
                      <Table>
                        <thead>
                          <tr>
                            <th scope="col">SR</th>
                            <th scope="col">Date</th>
                            <th scope="col">Commission</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results?.data?.map((user, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-start">{index}</td>
                                <td className="text-start">
                                  {user?.date || null}
                                </td>
                                <td className="text-start">
                                  <span
                                    style={{
                                      color:
                                        user?.shareAmount >= 0
                                          ? "green"
                                          : "red",
                                    }}
                                  >
                                    {helpers.currencyFormat(user?.shareAmount)}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                          {isEmpty(results) ? (
                            <tr>
                              <td colSpan={3}>No records found</td>
                            </tr>
                          ) : null}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </section>
                {/* <PieChart highcharts={Highcharts} options={options} /> */}
              </div>

              <div className="w-50 p-2">
                <h5
                  className="p-2"
                  style={{ background: "rgb(44,71,89)", color: "white" }}
                >
                  Settlement History
                </h5>
                <section className="total-balance-sec was">
                  <Container fluid className="px-0">
                    <ul className="list-unstyled">
                      <li>
                        <dt>Withdrawal Amount</dt>
                        <strong>
                          BDT {`${helpers.currencyFormat(results?.sumData)}`}
                        </strong>
                      </li>
                      <li>
                        <button
                          onClick={
                            () => checkWithdrawal()

                            // toast.error("Withdraw will be active at 4pm")
                          }
                          className="withdraw-btn"
                        >
                          Withdraw Request
                        </button>
                      </li>
                    </ul>
                  </Container>
                </section>
                <section className="account-table">
                  <div className="container-fluid px-0">
                    <div className="responsive table-color">
                      <Table>
                        <thead>
                          <tr>
                            <th scope="col">SR</th>
                            <th scope="col">Account Name</th>
                            <th scope="col">Bank Name</th>
                            <th scope="col">Bank Account</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Created Date</th>
                            <th scope="col">Status</th>
                            <th scope="col">Remark</th>
                          </tr>
                        </thead>
                        <tbody>
                          {withdrwaRequest?.length > 0 ? (
                            withdrwaRequest?.map((res, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{res?.AccountName || "-"}</td>
                                  <td>{res?.bank || "-"}</td>
                                  <td>{res?.BankAccount || "-"}</td>
                                  <td>{res?.amount || "-"}</td>
                                  <td>{helpers?.dateFormat(res?.createdAt)}</td>
                                  <td>
                                    <span
                                      style={{
                                        color:
                                          res?.status == "completed"
                                            ? "green"
                                            : res?.status == "declined"
                                            ? "red"
                                            : "",
                                      }}
                                    >
                                      {res?.status == "completed"
                                        ? "Approve"
                                        : res?.status == "declined"
                                        ? "Decline"
                                        : res?.status}
                                    </span>
                                  </td>

                                  <td>{res?.remark}</td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={8}>No records found</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </section>
                {/* <PieChart highcharts={Highcharts} options={options2} /> */}
              </div>
            </div>
            {/* <div className="db-sec">
              <h2 className="common-heading">Commission Report</h2>
            </div> */}
            {/* <Col md={12}>
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
            </Col> */}
            {/* <Col md={12} sm={12} lg={12} className="mt-2">
              <section className="account-table aprofit-downline">
                <div className="responsive transaction-history">
                  
                </div>
              </section>
            </Col>
            <div className="db-sec">
              <h2 className="common-heading">Settlement</h2>
            </div>
            <Col md={12}>
              <div className="inner-wrapper">
                <Form className="bet_status">
                  <Row>
                    <Col xl={12} md={12}>
                      <Row>
                        <Col md={3}>
                          <Form.Group className="d-flex align-items-center find-member-sec ">
                            <Form.Label className="pe-2 mb-0 w-75">
                              Select User
                            </Form.Label>
                            <Form.Select
                              value={settlementFilter?.user}
                              onChange={(e) => {
                                setSettlementFilter((prev) => {
                                  let obj = JSON.parse(e.target?.value);
                                  if (!isEmpty(obj)) {
                                    return {
                                      ...prev,
                                      user: obj?.username,
                                      availableAmount: obj?.playerBalance,
                                      settlementAmount: obj?.playerBalance,
                                    };
                                  }
                                });
                              }}
                              aria-label="Default select example w-auto"
                            >
                              <option value="">Select User</option>
                              {results?.data?.length > 0 &&
                                results?.data?.map((res) => {
                                  return (
                                    <option value={JSON.stringify(res)}>
                                      {res?.username}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="d-flex align-items-center find-member-sec">
                            <Form.Label className="pe-2 mb-0 w-50">
                              Avilable Amount
                            </Form.Label>
                            <Form.Control
                              value={settlementFilter?.availableAmount}
                              placeholder="Enter Available Amount"
                              disabled
                              // onChange={(e) =>
                              //   setSettlementFilter((prev) => {
                              //     return {
                              //       ...prev,
                              //       availableAmount: e.target.value,
                              //     };
                              //   })
                              // }
                              aria-label="Default select example w-auto"
                              type="number"
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="d-flex align-items-center find-member-sec">
                            <Form.Label className="pe-2 mb-0 w-50">
                              Settlement amount
                            </Form.Label>
                            <Form.Control
                              value={settlementFilter?.settlementAmount}
                              placeholder="Enter Settlement Amount"
                              onChange={(e) =>
                                setSettlementFilter((prev) => {
                                  return {
                                    ...prev,
                                    settlementAmount: e.target.value,
                                  };
                                })
                              }
                              aria-label="Default select example w-auto"
                              type="number"
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Button
                            onClick={() => {
                              if (!isEmpty(settlementFilter?.user)) {
                                onSubmit();
                              } else {
                                toast.error("Please select agent");
                              }
                            }}
                            className="btn btn-primary"
                          >
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col> */}
          </Row>
        </Container>
      </section>

      <Modal
        show={modal}
        onHide={() => {
          setModal(false);
        }}
      >
        <Modal.Header className="d-flex justify-content-center align-items-center">
          Withdraw Request
        </Modal.Header>
        <Modal.Body>
          <div class="usrTrans-wrapper common-box form-f">
            <div class="withdraw-form usrTrans-form">
              <Form
                onSubmit={handleSubmit(sendOTP)}
                id="deposit_form"
                class="deposit_form"
              >
                <div class="transaction-errMsg text-danger depositMsg mb-2">
                  {`প্রিয় এফিলিয়েট, আপনার মোট জমা টাকা থেকে ৬০% ৳ উত্তলন করতে পাবেন।  ধন্যবাদ।`}
                </div>

                <div class="usrTrans-seperate bankInfoField">
                  <div class="transaction-title">
                    <span>Bank</span>
                    <span class="important-icon">*</span>
                  </div>
                  <div class="transaction-option m-auto">
                    <select
                      {...register("bank", {
                        required: {
                          value: true,
                          message: "Please select bank",
                        },
                      })}
                      id="depositBankId"
                      class="gatewayBankSelect"
                    >
                      <option value="">Select Bank</option>
                      <option value="bKash">bKash</option>
                      <option value="NAGAD">NAGAD</option>
                      <option value="bank">Bank</option>
                      <option value="phonepegpay">Phonepe/gpay</option>
                    </select>
                  </div>
                  {errors?.bank?.message && (
                    <div class="transaction-errMsg text-danger depositMsg mb-2">
                      {errors?.bank?.message}
                    </div>
                  )}
                </div>
                {!isEmpty(watch("bank")) && (
                  <>
                    <div class="usrTrans-seperate bankInfoField bankInfo">
                      <div class="transaction-title">
                        <span>Bank account / number</span>
                        {/* <span class="copyBtn bg-gradient-secondary">
                          <i class="fas fa-copy"></i>
                        </span> */}
                      </div>
                      <div class="transaction-option m-auto">
                        <input
                          {...register("bankAccount", {
                            required: {
                              value: true,
                              message: "Please enter bank account number",
                            },
                          })}
                          class="text-input"
                          id="depositAccNo"
                        />
                      </div>{" "}
                      {errors?.bankAccount?.message && (
                        <div class="transaction-errMsg text-danger depositMsg mb-2">
                          {errors?.bankAccount?.message}
                        </div>
                      )}
                    </div>
                    <div class="usrTrans-seperate bankInfoField bankInfo">
                      <div class="transaction-title">
                        <span>Account Name</span>
                        {/* <span class="copyBtn bg-gradient-secondary">
                          <i class="fas fa-copy"></i>
                        </span> */}
                      </div>
                      <div class="transaction-option m-auto">
                        {watch("bank") == "bank" ? (
                          <>
                            <input
                              {...register("accountName", {
                                required: {
                                  value: true,
                                  message: "Please enter account name",
                                },
                              })}
                              class="text-input"
                              id="depositAccName"
                            />
                            {errors?.accountName?.message && (
                              <div class="transaction-errMsg text-danger depositMsg">
                                {errors?.accountName?.message}
                              </div>
                            )}
                          </>
                        ) : (
                          <input
                            value={"Personal"}
                            disabled
                            class="text-input"
                            id="depositAccName"
                          />
                        )}
                      </div>{" "}
                    </div>
                  </>
                )}

                {!isEmpty(watch("bank")) && watch("bank") == "bank" && (
                  <>
                    <div class="usrTrans-seperate bankInfoField bankInfo">
                      <div class="transaction-title">
                        <span>Bank Name</span>
                        {/* <span class="copyBtn bg-gradient-secondary">
                          <i class="fas fa-copy"></i>
                        </span> */}
                      </div>
                      <div class="transaction-option m-auto">
                        <input
                          {...register("bankName", {
                            required: {
                              value: true,
                              message: "Please enter bank name",
                            },
                          })}
                          class="text-input"
                          id="depositAccNo"
                        />
                      </div>{" "}
                      {errors?.bankName?.message && (
                        <div class="transaction-errMsg text-danger depositMsg mb-2">
                          {errors?.bankName?.message}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div class="usrTrans-seperate deposit-amount">
                  <div class="transaction-title">
                    <span>Amount</span>{" "}
                    {!isEmpty(watch("bank")) && watch("bank") == "bank"
                      ? `(Min 50000  - Max 1000000)`
                      : `(Min 500 - Max 30000)`}
                    <span class="important-icon">*</span>
                  </div>
                  <div class="transaction-option m-auto">
                    <input
                      {...register("amount", {
                        required: {
                          value: true,
                          message: "Please enter amount",
                        },
                        validate: (value) => {
                          if (value > 0) {
                            if (
                              !isEmpty(watch("bank")) &&
                              watch("bank") == "bank"
                            ) {
                              let min = Number(
                                (results?.sumData * 60) / 100
                              )?.toFixed(2);
                              if (Number(value) > 1000000) {
                                return "Amount should not be greater than 1000000.";
                              } else if (Number(value) < 50000) {
                                return "Min Withdraw amount should be 50000 or greater than 50000";
                              } else if (Number(value) > Number(min)) {
                                return `Withraw amount should not be greater than 60% available withdrawal amount is (${min})`;
                              }
                            } else {
                              let min = Number(
                                (results?.sumData * 60) / 100
                              )?.toFixed(2);
                              if (Number(value) > 30000) {
                                return "Amount should not be greater than 30000.";
                              } else if (Number(value) < 500) {
                                return "Min Withdraw amount should be 500 or greater than 500";
                              } else if (Number(value) > Number(min)) {
                                return `Withraw amount should not be greater than 60% available withdrawal amount is (${min})`;
                              }
                            }
                          } else {
                            return "Amount should be greater than 0";
                          }
                        },
                      })}
                      type="number"
                      class="text-input"
                      id="depositAmt"
                      placeholder="0.00"
                    />
                  </div>
                  {errors?.amount?.message && (
                    <div class="transaction-errMsg text-danger depositMsg mb-2">
                      {errors?.amount?.message}
                    </div>
                  )}
                </div>

                <div className="usrTrans-seperate">
                  <div className="transaction-title">
                    <span>Mobile Number</span>
                    <span className="important-icon"></span>
                  </div>
                  <div className="transaction-option m-auto">
                    {profileData?.phone?.toString()?.length > 5 ? (
                      <input
                        className="text-input disabled"
                        type="number"
                        disabled
                        {...register("mobile")}
                      />
                    ) : (
                      <Controller
                        className="d-flex"
                        style={{ width: "100% !important" }}
                        control={control}
                        name="mobile"
                        rules={{
                          required: "Please enter mobile number.",
                          validate: (value) => {
                            let inputValue = value
                              ?.toString()
                              ?.slice(
                                inputRef?.current?.state?.selectedCountry
                                  ?.countryCode?.length,
                                value?.length
                              );
                            if (inputValue?.length < 8) {
                              return "Mobile number must contain 5 digit";
                            } else if (inputValue?.length > 12) {
                              return "Mobile number should not exceed 13 digit";
                            } else {
                              return true;
                            }
                          },
                        }}
                        render={({ field: { ref, ...field } }) => (
                          <PhoneInput
                            {...field}
                            inputExtraProps={{
                              ref,
                              required: true,
                              autoFocus: true,
                            }}
                            ref={inputRef}
                            inputStyle={{
                              width: "100% !important",
                              height: "38px",
                            }}
                            country={"bd"}
                            enableSearch
                            countryCodeEditable={false}
                          />
                        )}
                      />
                    )}
                  </div>
                  {errors?.mobile?.message && (
                    <div class="transaction-errMsg text-danger depositMsg mb-2">
                      {errors?.mobile?.message}
                    </div>
                  )}
                </div>

                <div className="usrTrans-seperate">
                  <div className="transaction-option">
                    <div className="transaction-btn">
                      <input
                        type="hidden"
                        id="withdrawBankCode"
                        name="withdrawBankCode"
                        value="BKASH"
                      />
                      <button
                        type="submit"
                        className="btn-submit bg-gradient-primary"
                      >
                        WITHDRAW
                      </button>
                    </div>
                  </div>
                </div>

                <input id="maxWithdrawCountPerDay" value="0" type="hidden" />
              </Form>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* {otp && (
        <VerifyOtp
          open={otp}
          otpNumber={otpNumber}
          onClose={() => setOtp(false)}
          onSubmit={handelVerifyOTP}
        />
      )} */}
      {otp && (
        <EnterPassword
          open={otp}
          // otpNumber={otpNumber}
          onClose={() => setOtp(false)}
          onSubmit={onSubmitWithdraw}
        />
      )}
    </div>
  );
};

export default ComissionReport;
