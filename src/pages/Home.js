import React, { useEffect, useState, useContext } from "react";
import AddUser from "./Users/Add";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import UserList from "./Users/UserList";
import Search from "./Users/Search";
import Hierarchy from "./Users/Hierarchy";
import helpers from "../utils/helpers";
import constants from "../utils/constants";
import { compact, isEmpty, startCase } from "lodash";

const Home = () => {
  const location = useLocation();
  const user_params = compact(location.pathname.split("/"));
  let { user } = useContext(AuthContext);
  let user_by_created = user.id;
  let userType = user.userType;
  if (!isEmpty(user_params[0])) {
    user_by_created = user_params[0];
  }
  if (!isEmpty(user_params[1])) {
    userType = user_params[1];
  }
  const [show_model, setShowModel] = useState(false);
  const [reset, setRest] = useState(false);
  const [results, setResults] = useState([]);
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    keyword: "",
    status: "active",
    created_by: user_by_created,
    userType: userType,
  });
  const [balance, setBalance] = useState({
    totalAvailableLimit: 0,
    totalAmount: 0,
    totalCoins: 0,
    playerBalance: 0,
    availableLimit: 0,
    exposure: 0,
  });

  const onSubmit = (params) => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: 1,
        keyword: params.keyword,
        status: params.status,
      };
    });
  };

  const handlePageClick = (event) => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: event.selected + 1,
      };
    });
  };

  const getUsers = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.downLineList,
      search_params
    );
    if (status === 200) {
      if (response_users.success) {
        setResults(response_users?.results || []);
        if ("balance" in response_users?.results) {
          setBalance((prevState) => {
            const balance_info = response_users?.results?.balance;
            return {
              ...prevState,
              totalAvailableLimit: balance_info.totalAvailableLimit,
              totalAmount: balance_info.totalAmount,
              totalCoins: balance_info.totalCoins,
              playerBalance: balance_info.playerBalance,
              availableLimit: balance_info.availableLimit,
              exposure: balance_info.exposure,
              playerExposure: balance_info.playerExposure,
            };
          });
        }
      }
    }
    setRest(false);
  };

  const resetList = () => {
    setRest(true);
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: 1,
        page_size: 10,
        keyword: "",
        status: "active",
      };
    });
  };

  const refreshUsers = () => {
    getUsers();
  };

  useEffect(() => {
    const user_params = compact(location.pathname.split("/"));
    let user_by_created = user.id;
    if (!isEmpty(user_params[0])) {
      user_by_created = user_params[0];
      setSearchParams((prevState) => {
        return {
          ...prevState,
          page: 1,
          page_size: 10,
          keyword: "",
          status: "active",
          created_by: user_by_created,
          userType: userType,
        };
      });
    } else {
      setSearchParams((prevState) => {
        return {
          ...prevState,
          page: 1,
          page_size: 10,
          keyword: "",
          status: "active",
          created_by: user.id,
          userType: user?.userType,
        };
      });
    }
  }, [location]);

  useEffect(() => {
    getUsers();
  }, [
    search_params?.page,
    search_params?.keyword,
    search_params?.status,
    search_params?.created_by,
    search_params?.userType,
  ]);

  const [message, setMessage] = useState([]);
  const messageList = async () => {
    let hostname = window.location.hostname;
    hostname = hostname.replace(/^www\./, "");
    hostname = hostname.replace(/^ag\./, "");
    hostname = hostname || "sabaexch.com";
    const { status, data: response_users } = await apiGet(
      apiPath.messageList + "&domain=" + hostname
    );
    if (status === 200) {
      if (response_users.success) {
        setMessage(response_users.results);
      }
    }
  };
  useEffect(() => {
    messageList();
  }, []);

  const availableBalance =
    (balance?.totalAmount &&
      Math.abs(balance?.totalAmount) - Math.abs(balance?.playerExposure)) ||
    0;
  // console.log('balance?.totalAmount',balance?.totalAmount, balance)
  // console.log('results----------------',results)
  return (
    <div class="right-with-gap">
      <section className="breadcum-sec">
        <Container fluid>
          <div className="bredcum-sec-main">
            <h5 className="mb-0">
              <i className="fa-solid fa-microphone"></i> News
            </h5>

            <marquee width="50%">
              {message.map((res) => {
                return (
                  <a href="#" style={{ marginRight: "10px" }}>
                    <span>
                      {helpers.msgDateFormat(res.msgDate, user.timeZone)}
                    </span>
                    {res.title} - {res.message}
                  </a>
                );
              })}
            </marquee>
          </div>
        </Container>
      </section>

      <section className="find-member-sec py-3">
        <Container fluid>
          <Row>
            <Col xl={12} className="mb-md-0 mb-3">
              <Row>
                <Col xl={4} lg={6} md={12} className="">
                  <Search
                    onSubmit={onSubmit}
                    search_params={search_params}
                    reset={reset}
                  />
                </Col>
                <Col xl={8} lg={6} md={12}>
                  <div className="d-flex flex-wrap justify-content-between">
                    <Hierarchy results={results} />
                    <div className="find-member-director text-xl-end ">
                      <a
                        href="#"
                        className="btn"
                        onClick={() => {
                          setShowModel(!show_model);
                        }}
                      >
                        <i className="fas fa-user-plus pe-1"></i> Add{" "}
                        {startCase(
                          constants.user_next_status[
                            user_params[1] !== undefined &&
                            user_params[0] !== ""
                              ? user_params[1]
                              : user?.userType
                          ]
                        )}
                      </a>
                      <a href="#" className="btn" onClick={resetList}>
                        {" "}
                        <i className="fas fa-redo-alt"></i>
                      </a>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="total-balance-sec">
        <Container fluid>
          <ul className="list-unstyled">
            <li>
              <dt>Total Balance</dt>
              <strong>
                BDT {`${helpers.currencyFormat(balance?.totalAmount)}`}
              </strong>
            </li>
            <li>
              <dt>Total Exposure</dt>
              <strong>
                BDT{" "}
                <span>{`${helpers.currencyFormat(
                  balance?.playerExposure
                )}`}</span>
              </strong>
            </li>

            <li>
              <dt>Total Avail. bal.</dt>
              <strong>
                BDT {`${helpers.currencyFormat(availableBalance)}`}
              </strong>
            </li>

            <li>
              <dt>Balance</dt>
              <strong>
                BDT {`${helpers.currencyFormat(balance?.totalCoins)}`}
              </strong>
            </li>

            <li>
              <dt>Available Balance</dt>
              <strong>
                BDT{" "}
                {`${helpers.currencyFormat(
                  Math.abs(availableBalance) + balance?.totalCoins
                )}`}
              </strong>
            </li>

            <li>
              <dt>Total Player Balance</dt>
              <strong>
                BDT {`${helpers.currencyFormat(balance?.playerBalance)}`}
              </strong>
            </li>
          </ul>
        </Container>
      </section>

      <UserList
        results={results}
        handlePageClick={handlePageClick}
        getUsers={getUsers}
        data={user.userType}
      />
      {show_model ? (
        <AddUser
        user={user}
          refreshUsers={refreshUsers}
          id={user_params[0] ? user_params[0] : user._id}
          slug={user_params[1] ? user_params[1] : user.userType}
          setShowModel={() => {
            setShowModel(!show_model);
          }}
        />
      ) : null}
    </div>
  );
};

export default Home;
