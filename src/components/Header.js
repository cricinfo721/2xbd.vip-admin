import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  NavDropdown,
  Nav,
  Button,
  Offcanvas,
  Form,
} from "react-bootstrap";
import { isEmpty } from "lodash";
import { useForm } from "react-hook-form";
import io from "socket.io-client";
import AuthContext from "../context/AuthContext";
import { Helmet } from "react-helmet";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import helpers from "../utils/helpers";
import download from "../assets/images/download-icon.png";
import upload from "../assets/images/upload.png";
import { apiGet } from "../utils/apiFetch";
import pathObj from "../utils/apiPath";
import notifySound from "../assets/newAudio.wav";
const Header = () => {
  const [socket, setSocket] = useState(null);
  const { register, handleSubmit } = useForm({ mode: "onChange" });
  const location = useLocation();
  const { count, bellSound } = useContext(AuthContext);
  const parmas = useParams();
  const navigate = useNavigate();
  const current_url = location.pathname.split("/")[1];
  let {
    user,
    logoutUser,
    user_coins,
    setUserCoins,
    getCoins,
    isRefereshLoader,
    setRefereshLoader,
  } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleFormSubmit = (form_data = {}) => {
    document.documentElement.style.setProperty("--primary", "#b36c3d");
  };
  useEffect(() => {
    const newSocket = io(
      `${process.env.REACT_APP_API_BASE_URL}?token=${
        user._id ? user._id : 112233
      }`,
      {
        transports: ["websocket"],
      }
    );
    const coinListener = (message) => {
      setUserCoins(message.results.totalCoins);
    };
    const forceLogout = (message) => {
      const uniqueId = localStorage.getItem("uniqueId");
      if (uniqueId !== message.results.uniqueId) {
        logoutUser();
      }
    };
    newSocket.emit("getCoins", { user_id: user._id });
    newSocket.on("listenGetCoin", coinListener);
    newSocket.on("listenForceLogout", forceLogout);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);
  const [expanded, setExpanded] = useState(false);
  const [check, setCheck] = useState(
    parmas?.id && parmas.user_type ? true : false
  );

  // useEffect(() => {
  //   if (bellSound) {
  //     let interval = setInterval(() => {
  //       const clickSound = new Audio(notifySound);
  //       clickSound.play().catch(function (error) {
  //         console.log(
  //           "Chrome cannot play sound without user interaction first"
  //         );
  //       });
  //     }, 1500);
  //     return () => {
  //       clearInterval(interval);
  //     };
  //   }
  // }, [bellSound]);
  return (
    <div>
      <header>
        <Helmet>
          <meta name="viewport" content="width=device-width, initial-scale=0" />
        </Helmet>
        <div className="top-header">
          <Container fluid>
            <Row className="align-items-center">
              <Col sm={4}>
                <div className="logo">
                  <a href="/" className="d-inline-block">
                    <img
                      src="./assets/images/logo.png"
                      alt=""
                      style={{ maxWidth: `25%` }}
                    />
                  </a>
                </div>
              </Col>
              {!isEmpty(user) ? (
                <Col sm={8}>
                  <div className="text-sm-end text-center top-header-owner">
                    <ul className="list-unstyled mb-0">
                      {(user?.userType == "sub_owner" ||
                        user?.userType == "owner") && (
                        <>
                          <li
                            onClick={() => navigate("/wallet-deposit")}
                            className="header-count cursor-pointer"
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              style={{
                                width: "23px",
                                height: "23px",
                              }}
                              src={download}
                            />
                            <span>{count?.depositRequests || 0}</span>
                          </li>
                          <li
                            onClick={() => navigate("/wallet-withdrawal")}
                            className="header-count cursor-pointer"
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              style={{
                                width: "23px",
                                height: "23px",
                              }}
                              src={upload}
                            />
                            <span>{count?.withdrawalRequests || 0}</span>
                          </li>
                        </>
                      )}
                      <li>
                        <span>
                          {user?.userType == "super_admin"
                            ? "Admin"
                            : user?.userType || ""}
                        </span>{" "}
                        <strong>{user?.username || ""}</strong>
                      </li>
                      {isRefereshLoader ? (
                        <li>
                          <p className="loading-bar" id="menuRefreshLoading">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                          </p>
                        </li>
                      ) : (
                        <li>
                          <a href="#" className="text-decoration-none">
                            <span>Main</span>{" "}
                            <strong>
                              BDT {helpers.currencyFormat(user_coins)}
                            </strong>
                          </a>
                          <a
                            href="#"
                            className="btn"
                            onClick={() => getCoins()}
                          >
                            <span>
                              <i className="fas fa-redo-alt"></i>
                            </span>
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </Col>
              ) : null}
            </Row>
          </Container>
        </div>

        <div className="main-header">
          <Container fluid>
            <Navbar expand="xl" expanded={expanded}>
              <Navbar.Toggle
                aria-controls="basic-navbar-nav"
                onClick={() => setExpanded(expanded ? false : "expanded")}
              />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link
                    as={NavLink}
                    onClick={() => setExpanded(false)}
                    to="/dashboard"
                    className={current_url === "dashboard" ? "active1" : ""}
                  >
                    Dashboard
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/"
                    onClick={() => setExpanded(false)}
                    className={
                      current_url === "" ||
                      current_url === "account-summary" ||
                      current_url === "betting-history" ||
                      current_url === "activity-log" ||
                      current_url === "betting-profit-loss" ||
                      current_url === "transaction-history" ||
                      current_url === "transaction-history-2" ||
                      current_url === parmas?.id
                        ? "active1"
                        : ""
                    }
                  >
                    {" "}
                    Downline List
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    onClick={() => setExpanded(false)}
                    to="/my-account-summary"
                    className={
                      current_url === "my-account-summary" ||
                      current_url === "my-account-statement" ||
                      current_url === "my-profile" ||
                      current_url === "my-activity-log"
                        ? "active1"
                        : ""
                    }
                  >
                    My Account
                  </Nav.Link>
                  {user?.userType == "owner" ||
                    (user?.userType == "sub_owner" && (
                      <>
                        <NavDropdown title="My Report" id="basic-nav-dropdown">
                          {/* <NavDropdown.Item
                      onClick={() => setExpanded(false)}
                      as={NavLink}
                      to="/AprofitByDownline"
                    >
                      {" "}
                      Profit/Loss Report by Downline
                    </NavDropdown.Item> */}
                         <NavDropdown.Item
                      onClick={() => setExpanded(false)}
                      as={NavLink}
                      to="/AllAprofitByDownline"
                    >
                      {" "}
                      All Profit/Loss Report by Downline
                    </NavDropdown.Item>
                          <NavDropdown.Item
                            onClick={() => setExpanded(false)}
                            as={NavLink}
                            to="/AprofitMarket"
                          >
                            Profit/Loss Report by Market
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            onClick={() => setExpanded(false)}
                            as={NavLink}
                            to="/Adownlinesportspl"
                          >
                            Profit/Loss Sports Wise
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            onClick={() => setExpanded(false)}
                            as={NavLink}
                            to="/ACdownlinesportspl"
                          >
                            All Casino Profit/Loss
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            onClick={() => setExpanded(false)}
                            as={NavLink}
                            to="/AprofitCasino"
                          >
                            Casino Profit/Loss Report by Date
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            onClick={() => setExpanded(false)}
                            as={NavLink}
                            to="/ACasinoprofitAndLossDownlineNew"
                          >
                            Casino P/L Downline Monthly
                          </NavDropdown.Item>
                          {/* <NavDropdown.Item
                      onClick={() => setExpanded(false)}
                      as={NavLink}
                      to="/AprofitCasino"
                    >
                      International Casino Profit/Loss Report by Date
                    </NavDropdown.Item> */}

                          {/* <NavDropdown.Item
                      onClick={() => setExpanded(false)}
                      as={NavLink}
                      to="/ICasinoprofitAndLossDownlineNew"
                    >
                      International Casino P/L Downline Monthly
                    </NavDropdown.Item> */}
                        </NavDropdown>
                      </>
                    ))}
                  {user?.userType == "owner" ||
                  user?.userType == "sub_owner" ? (
                    <Nav.Link
                      as={NavLink}
                      onClick={() => setExpanded(false)}
                      to="/banner-list"
                      className={current_url === "banner-list" ? "active1" : ""}
                    >
                      Banner
                    </Nav.Link>
                  ) : (
                    ""
                  )}
                  <Nav.Link
                    as={NavLink}
                    onClick={() => setExpanded(false)}
                    to="/Betlist"
                    className={current_url === "Betlist" ? "active1" : ""}
                  >
                    BetList
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    onClick={() => setExpanded(false)}
                    to="/BetListLive"
                    className={current_url === "BetListLive" ? "active1" : ""}
                  >
                    BetListLive
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/RiskManagement"
                    onClick={() => setExpanded(false)}
                    className={
                      current_url === "RiskManagement" ? "active1" : ""
                    }
                  >
                    Risk Management
                  </Nav.Link>
                  {/* {user?.userType == "agent" && ( */}

                  {(user?.userType == "sub_owner" ||
                    user?.userType == "owner") && (
                    <NavDropdown
                      title="Banking Management"
                      id="basic-nav-dropdown"
                    >
                      {/* <NavDropdown.Item
                        onClick={() => setExpanded(false)}
                        as={NavLink}
                        to="/banking"
                      >
                        {" "}
                        Banking
                      </NavDropdown.Item> */}

                      <NavDropdown.Item
                        onClick={() => setExpanded(false)}
                        as={NavLink}
                        to="/banks"
                      >
                        {" "}
                        Banks
                      </NavDropdown.Item>
                    </NavDropdown>
                  )}
                  <NavDropdown title="Commission" id="basic-nav-dropdown">
                    {(user?.userType == "owner" ||
                      user?.userType == "sub_owner") && (
                        <NavDropdown.Item
                          onClick={() => setExpanded(false)}
                          as={NavLink}
                          to="/Withdraw_request"
                        >
                          {" "}
                          Withdraw Request
                        </NavDropdown.Item>
                      )}
                    <NavDropdown.Item
                      onClick={() => setExpanded(false)}
                      as={NavLink}
                      to="/commission-report"
                    >
                      {" "}
                      Commission Report
                    </NavDropdown.Item>
                    {user?.userType == "agent" &&
                    <NavDropdown.Item
                      onClick={() => setExpanded(false)}
                      as={NavLink}
                      to="/affiliate-kyc"
                    >
                      {" "}
                      Affiliate KYC
                    </NavDropdown.Item>}
                    {(user?.userType == "owner" ||
                      user?.userType == "sub_owner") && (
                      <NavDropdown.Item
                        onClick={() => setExpanded(false)}
                        as={NavLink}
                        to="/agent-withdraw-history"
                      >
                        {" "}
                        Agent Withdraw History
                      </NavDropdown.Item>
                    )}
                    {user?.userType == "owner" ||
                      user?.userType == "sub_owner" ||
                      (user?.userType == "super_admin" && (
                        <NavDropdown.Item
                          onClick={() => setExpanded(false)}
                          as={NavLink}
                          to="/Commission_setting"
                        >
                          {" "}
                          Commission Setting
                        </NavDropdown.Item>
                      ))}
                  </NavDropdown>
                  {(user?.userType == "sub_owner" ||
                    user?.userType == "owner") && (
                    <NavDropdown
                      title="Wallet Management"
                      id="basic-nav-dropdown"
                    >
                      <NavDropdown.Item
                        onClick={() => setExpanded(false)}
                        as={NavLink}
                        to="/wallet-deposit"
                      >
                        {" "}
                        Wallet Deposit
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        onClick={() => setExpanded(false)}
                        as={NavLink}
                        to="/wallet-withdrawal"
                      >
                        {" "}
                        Wallet Withdrawal
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        onClick={() => setExpanded(false)}
                        as={NavLink}
                        to="/deposit-history"
                      >
                        {" "}
                        Deposit History
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        onClick={() => setExpanded(false)}
                        as={NavLink}
                        to="/withdrawal-history"
                      >
                        {" "}
                        Withdrawal History
                      </NavDropdown.Item>
                    </NavDropdown>
                  )}

                  {user?.userType == "owner" ||
                    (user?.userType == "sub_owner" && (
                      <>
                      <NavDropdown.Item
                      onClick={() => setExpanded(false)}
                      as={NavLink}
                      to="/affiliate-kyc-list"
                    >
                      {" "}
                      Affiliate KYC List
                    </NavDropdown.Item>
                        <Nav.Link
                          as={NavLink}
                          onClick={() => setExpanded(false)}
                          to="/sms"
                          className={current_url === "sms" ? "active1" : ""}
                        >
                          Bkash SMS
                        </Nav.Link>
                        <Nav.Link
                          as={NavLink}
                          onClick={() => setExpanded(false)}
                          to="/nagad-sms"
                          className={current_url === "nagad-sms" ? "active1" : ""}
                        >
                          Nagad SMS
                        </Nav.Link>
                        <Nav.Link
                          as={NavLink}
                          onClick={() => setExpanded(false)}
                          to="/block-market"
                          className={
                            current_url === "block-market" ? "active1" : ""
                          }
                        >
                          Block Market
                        </Nav.Link>
                      </>
                    ))}
                  {user.userType === "owner" && (
                    <Nav.Link
                      as={NavLink}
                      onClick={() => setExpanded(false)}
                      to="/sport-setting"
                      className={
                        current_url === "sport-setting" ? "active1" : ""
                      }
                    >
                      Sport Setting
                    </Nav.Link>
                  )}
                  <Nav.Link
                    as={NavLink}
                    to="/general-setting"
                    onClick={() => setExpanded(false)}
                    className={
                      current_url === "general-setting" ||
                      current_url === "active-match" ||
                      current_url === "in-active-match" ||
                      current_url === "manage-links" ||
                      current_url === "WebsiteSetting"
                        ? "active1"
                        : ""
                    }
                  >
                    Admin Setting
                  </Nav.Link>
                  {user?.userType === "owner" ||
                  user?.userType === "sub_owner" ? (
                    <>
                      <Nav.Link
                        as={NavLink}
                        onClick={() => setExpanded(false)}
                        to="/result"
                        className={current_url === "result" ? "active1" : ""}
                      >
                        Result
                      </Nav.Link>
                      <Nav.Link
                        as={NavLink}
                        onClick={() => setExpanded(false)}
                        to="/add-match"
                        className={current_url === "add-match" ? "active1" : ""}
                      >
                        Add Match
                      </Nav.Link>
                    </>
                  ) : (
                    ""
                  )}
                </Nav>
              </Navbar.Collapse>

              <div className="main-header-time-zone">
                <ul className="list-unstyled  mb-0">
                  <li>
                    Time Zone : <span>GMT+5:30</span>
                  </li>
                  <li>
                    {isEmpty(user) ? (
                      <Link to="/login">
                        Login <i className="fa-solid fa-right-from-bracket"></i>
                      </Link>
                    ) : (
                      <a
                        style={{ cursor: "pointer" }}
                        as={NavLink}
                        to="#"
                        onClick={logoutUser}
                      >
                        Logout{" "}
                        <i className="fa-solid fa-right-from-bracket"></i>
                      </a>
                    )}
                  </li>
                </ul>
              </div>
            </Navbar>
          </Container>
        </div>
      </header>

      {/* <Button
        variant="primary"
        onClick={handleShow}
        className="color-picker-btn"
      >
        <i className="fa-solid fa-gear"></i>
      </Button> */}

      <Offcanvas show={show} onHide={handleClose} placement={"end"}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Change Your Theme</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="d-flex align-items-center justify-content-between">
              <div className="text-center">
                <Form.Label for="primary" className="form-label">
                  Primary Color
                </Form.Label>
                <Form.Control
                  type="color"
                  className="form-control-color m-auto"
                  id="primary"
                  value="#3db39e"
                  title="Choose your color"
                  {...register("primary_color", {
                    required: "Please select color",
                  })}
                />
              </div>

              <div className="text-center">
                <Form.Label for="secondary" className="form-label">
                  Secondary Color
                </Form.Label>
                <Form.Control
                  type="color"
                  className="form-control-color m-auto"
                  id="secondary"
                  value="#060316"
                  title="Choose your color"
                  {...register("secondary_color", {
                    required: "Please select color",
                  })}
                />
              </div>
            </div>
            <button className="btn" type="submit">
              Save
            </button>
            <button className="btn" type="button">
              Reset
            </button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Header;
