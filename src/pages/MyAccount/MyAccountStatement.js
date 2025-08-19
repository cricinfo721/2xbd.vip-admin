import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import MyAccountSidebar from "../../components/MyAccountSidebar";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { isEmpty } from "lodash";
import ReactPaginate from "react-paginate";
import Breadcrumbs from "./Breadcrumbs";
import helpers from "../../utils/helpers";
import AuthContext from "../../context/AuthContext";

const MyAccountStatement = () => {
  let { user } = useContext(AuthContext);
  const [getLogData, setLogData] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
  });
  const myStatementData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.transactionLogs,
      search_params
    );
    if (status === 200) {
      if (response_users.success) {
        setLogData(response_users.results);
      }
    }
  };

  const handlePageClick = (event) => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: event.selected + 1,
      };
    });
  };

  useEffect(() => {
    setPageCount(getLogData?.totalPages || []);
  }, [getLogData]);

  useEffect(() => {
    myStatementData();
  }, [search_params]);
  return (
    <div>
      <section className="py-4 main-inner-outer">
        <Container fluid>
          <Breadcrumbs />
          <Row>
            <Col lg={3}>
              <MyAccountSidebar />
            </Col>

            <Col lg={9} md={12}>
              <div className="inner-wrapper">
                {/* acccount-statement */}

                <h2 className="common-heading">Account Statement</h2>

                <section className="account-table">
                  <div className="responsive transaction-history table-color">
                    <Table>
                      <thead>
                        <tr>
                          <th scope="col">Date/Time</th>
                          <th scope="col">Deposit From Upline</th>
                          <th scope="col">Deposit to Downline</th>
                          <th scope="col">WihtDraw By Upline </th>
                          <th scope="col">WithDraw From Downline </th>
                          <th scope="col">Balance</th>
                          <th scope="col">Remark</th>
                          <th scope="col">From/To</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getLogData.data &&
                          getLogData.data.map((item, key) => (
                            <tr key={key}>
                              <td>
                                {helpers.dateFormat(
                                  item?.createdAt,
                                  user?.timeZone
                                )}
                              </td>
                              <td>
                                {
                                  item?.depositFromUpline?(
                                    <span className="text-success">
                                    {helpers.currencyFormat(
                                      Math.abs(item?.depositFromUpline)
                                    )}
                                  </span>
                                  ):(
                                  "-"
                                  )
                                }

                                  </td>
                              <td>
                              {
                                  item?.depositToDownline?(
                                  <span className="text-success">
                                    {
                                      helpers.currencyFormat(
                                        Math.abs(item?.depositToDownline)
                                      ) }
                                  </span>
                                ):(
                                  "-"
                                  )
                                }

                              </td>
                              <td>
                              {
                                  item?.wihtDrawByUpline?(
                              (<span className="text-danger">
                                {helpers.currencyFormat(item?.wihtDrawByUpline)}
                                </span>)
                                ):(
                                  "-"
                                  )
                                }
                              </td>
                              <td>
                              {
                                  item?.withDrawFromDownline?(
                              (<span className="text-danger">{helpers.currencyFormat(item?.withDrawFromDownline)} </span>)
                              ):(
                                "-"
                                )
                              }</td>
                              <td>
                                {helpers.currencyFormat(item?.newBalance)}
                              </td>
                              <td>{item?.remark}</td>
                              <td>
                                {/* {item?.transactionType === "credit" ? (
                                    (item?.forBet != 0)?`${
                                      item?.eventType === "4"
                                        ? "Cricket"
                                        : item?.eventType === "1"
                                        ? "Soccer"
                                        : item?.eventType === "2"
                                        ? "Tennis"
                                        : "Casino"
                                    }
                                    / Match /
                                    ${item?.matchName} / ${
                                      item?.eventId
                                    } / ${item?.runnerName}`
                                    :`${item?.createdByData?.username || ""} > ${item?.userData?.username}`
                                  ) : (
                                  `${item?.userData?.username || ""} > ${item?.receiverData?.username || ""}`
                                  )} */}
                                  {
                                    (item?.forBet != 0)?`${
                                      item?.eventType === "4"
                                        ? "Cricket"
                                        : item?.eventType === "1"
                                        ? "Soccer"
                                        : item?.eventType === "2"
                                        ? "Tennis"
                                        : "Casino"
                                    }
                                    / Match /
                                    ${item?.matchName} / ${
                                      item?.eventId
                                    } / ${item?.runnerName}`
                                    :`${item?.formToData || ""}`
                                  }
                              </td>
                            </tr>
                          ))}
                        {isEmpty(getLogData.data) ? (
                          <tr>
                            <td colSpan={9}>No records found</td>
                          </tr>
                        ) : null}
                      </tbody>
                    </Table>
                    <div className="bottom-pagination">
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel=" >"
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
                </section>

                {/* acccount-statement */}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default MyAccountStatement;
