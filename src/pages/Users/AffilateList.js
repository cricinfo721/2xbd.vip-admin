import { compact, isEmpty, startCase } from "lodash";
import React, { useEffect, useState } from "react";
import {
  Form,
  Table,
  Button,
  Modal,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import constants from "../../utils/constants";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useForm } from "react-hook-form";
import { apiPut, apiPost, apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import helpers from "../../utils/helpers";
import { toast } from "wc-toast";
import Search from "./Search";

const AffilateList = (props) => {
  const [changeStatus, setChangeStatus] = useState(false);
  const [userData, setUserData] = useState({});
  const [getActiveClass, setActiveClass] = useState("");
  const [result, setResults] = useState([]);
  useEffect(() => {
    getUsers();
  }, []);
  const [balance, setBalance] = useState({
    totalAvailableLimit: 0,
    totalAmount: 0,
    totalCoins: 0,
    playerBalance: 0,
    availableLimit: 0,
    exposure: 0,
  });
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    keyword: "",
    status: "active",
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
    getUsers({
      ...search_params,
      page: 1,
      keyword: params.keyword,
      status: params.status,
    });
  };
  const getUsers = async (obj) => {
    const { status, data: response_users } = await apiGet(
      apiPath.affelatList,
      !isEmpty(obj) ? obj : search_params
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
  };

  const availableBalance =
    (balance?.totalAmount &&
      Math.abs(balance?.totalAmount) - Math.abs(balance?.playerExposure)) ||
    0;
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Agent Referral List</h2>
          </div>

          <section className="find-member-sec py-3">
            <Container fluid>
              <Row>
                <Col xl={12} className="mb-md-0 mb-3">
                  <Row>
                    <Col xl={4} lg={6} md={12} className="">
                      <Search
                        onSubmit={onSubmit}
                        search_params={search_params}
                      />
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

          <section className="account-table">
            <div className="container-fluid">
              <div className="responsive table-color">
                <Table>
                  <thead>
                    <tr>
                      <th scope="col">Sr .No.</th>
                      <th scope="col">Account</th>
                      <th scope="col" className="text-end">
                        Balance
                      </th>
                      <th scope="col" className="text-end">
                        Avail. bal.{" "}
                      </th>
                      <th scope="col" className="text-end">
                        Commission's
                      </th>
                      <th scope="col" className="text-end">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result?.data?.map((user, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="text-start">
                            {/* {user?.userType == "user" ? (
                              <> */}
                            <a href={"#"} className="text-primary">
                              <span>
                                {constants?.user_status[user?.userType || ""]}
                              </span>
                            </a>
                            {user?.username || null}
                            {/* </>
                            ) : (
                              <Link
                                to={`/${user._id}/${user?.userType}`}
                                className="text-primary"
                              >
                                <span>
                                  {constants?.user_status[user?.userType || ""]}
                                </span>
                                {user?.username || null}
                              </Link>
                            )} */}
                          </td>
                          <td className="text-primary text-end">
                            {user?.userType == "user" ? (
                              Math.sign(
                                user?.totalCoins1 + Math.abs(user?.exposure)
                              ) === -1 ? (
                                <p style={{ color: `red` }}>
                                  {" "}
                                  {helpers.currencyFormat(
                                    (
                                      user?.totalCoins1 +
                                      Math.abs(user?.exposure)
                                    ).toFixed(2)
                                  )}
                                </p>
                              ) : (
                                helpers.currencyFormat(
                                  (
                                    user?.totalCoins1 + Math.abs(user?.exposure)
                                  ).toFixed(2)
                                )
                              )
                            ) : Math.sign(user?.totalCoins) === -1 ? (
                              <p style={{ color: `red` }}>
                                {" "}
                                {helpers.currencyFormat(
                                  user?.totalCoins.toFixed(2)
                                )}
                              </p>
                            ) : (
                              `${helpers.currencyFormat(
                                user?.totalCoins.toFixed(2)
                              )}`
                            )}
                          </td>
                          <td className="text-end">
                            {user?.userType == "user" ? (
                              Math.sign(
                                helpers.currencyFormat(user?.totalCoins1)
                              ) === -1 ? (
                                <p style={{ color: `red` }}>
                                  {" "}
                                  {helpers.currencyFormat(
                                    user?.totalCoins1.toFixed(2)
                                  )}
                                </p>
                              ) : (
                                helpers.currencyFormat(
                                  user?.totalCoins1.toFixed(2)
                                )
                              )
                            ) : Math.sign(
                                helpers.currencyFormat(
                                  user?.totalCoins - Math.abs(user?.exposure)
                                )
                              ) === -1 ? (
                              <p style={{ color: `red` }}>
                                {" "}
                                {helpers.currencyFormat(
                                  user?.totalCoins - Math.abs(user?.exposure)
                                )}
                              </p>
                            ) : (
                              helpers.currencyFormat(
                                user?.totalCoins - Math.abs(user?.exposure)
                              )
                            )}
                          </td>

                          <td className="text-end">
                            {helpers.currencyFormat(user?.commission || 0)}
                          </td>
                          <td className="action_link text-end">
                            <Link
                              title="Betting Profit Loss"
                              to={`/betting-profit-loss/${user?._id}/${user?.userType}`}
                              className="btn"
                            >
                              <i className="fas fa-exchange-alt swap-icon"></i>
                            </Link>
                            <Link
                              title="Betting History"
                              to={`/betting-history/${user?._id}/${user?.userType}`}
                              className="btn"
                            >
                              <i className="fas fa-th-list"></i>
                            </Link>
                            <Link
                              title="Account Summary"
                              to={`/account-summary/${user?._id}/${user?.userType}/referral`}
                              className="btn"
                            >
                              <i className="fas fa-user"></i>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                    {isEmpty(result?.data) ? (
                      <tr>
                        <td colSpan={10}>No records found</td>
                      </tr>
                    ) : null}
                  </tbody>
                </Table>
                <div className="bottom-pagination">
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel=" >"
                    onPageChange={props.handlePageClick}
                    pageRangeDisplayed={10}
                    pageCount={result?.data?.count || 0}
                    previousLabel="< "
                    renderOnZeroPageCount={null}
                    activeClassName="p-0"
                    activeLinkClassName="pagintion-li"
                  />
                </div>
              </div>
            </div>
          </section>
        </Container>
      </section>
    </div>
  );
};

export default AffilateList;
