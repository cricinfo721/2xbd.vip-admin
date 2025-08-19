import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import { useParams, Link } from "react-router-dom";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { isEmpty } from "lodash";
import ReactPaginate from "react-paginate";
import helpers from "../../utils/helpers";
import AuthContext from "../../context/AuthContext";
const TransactionHistory2 = () => {
  const params = useParams();
  let { user } = useContext(AuthContext);
  const [getLogData, setLogData] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
  });
  const myStatementData = async () => {
    search_params.user_id = params?.id;
    const { status, data: response_users } = await apiGet(
      apiPath.transactionBetLogs,
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
          <Breadcrumbs user_id={params?.id} />
          <div className="accout_cols_outer">
            <div className="left_side">
              <Sidebar />
            </div>
            <div className="right_side">
              <div className="inner-wrapper">
                <section className="account-table">
                  <div className="responsive transaction-history">
                    <Table>
                      <thead>
                        <tr>
                          <th scope="col">Date/Time</th>
                          <th scope="col">Deposit From Upline </th>
                          <th scope="col">Deposit to Downline </th>
                          <th scope="col"> WihtDraw By Upline </th>
                          <th scope="col"> WithDraw From Downline </th>
                          <th scope="col">Balance </th>
                          <th scope="col">Remark</th>
                          <th scope="col">From/To</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getLogData.data &&
                          getLogData.data.map((item, key) => (
                            <tr>
                              <td>
                                {helpers.dateFormat(
                                  item?.createdAt,
                                  user?.timeZone
                                )}
                              </td>
                              <td>
                                {item?.transactionType === "credit" ? (
                                  <span className="text-success">
                                    {helpers.currencyFormat(item?.amount)}
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>-</td>
                              <td>
                                {" "}
                                {item?.transactionType === "debit" ? (
                                  <span className="text-danger">
                                    {"(" +
                                      helpers.currencyFormat(item?.amount) +
                                      ")"}
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                {item?.betFaireType!="fancy" ? helpers.currencyFormat(item?.commission):"0.00"}
                              </td>
                              <td>
                                {helpers.currencyFormat(item?.newBalance)}
                              </td>
                              {/* {item?.runnerName=="status" ? `className="fas fa-arrow-right"`:} */}
                              <td>
                                  {(item?.status !=="voided" && !item?.isCallback)?
                                    ((item?.forBet != 0 || item?.forBet != "0") ?
                                    `${
                                      item?.eventType === "4"
                                        ? "Cricket"
                                        : item?.eventType === "1"
                                        ? "Soccer"
                                        : item?.eventType === "2"
                                        ? "Tennis"
                                        : "Casino"
                                    }
                                    ${item?.betFaireType=="toss"?"/ Toss /":(item?.betFaireType=="tie"?"/ Tie /":"/ Match /")}
                                    
                                    
                                    ${item?.matchName} / ${
                                      item?.eventId
                                    } / ${item?.runnerName} ${item?.gameType=="cricket" && item?.betFaireType=="betfair" && item?.eventId!="" ? "/ Match Odds" 
                                    : item?.gameType=="cricket" && item?.betFaireType=="boomaker" && item?.eventId!="" ?" /Bookmaker" : ""}`:`${item?.remark || ""}`)
                                  : (
                                  <>
                                    <div style={{"color": "red","fontWeight":"400"}}>
                                      {(item?.forBet != 0 || item?.forBet != "0") ?
                                        `${
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
                                        } / ${item?.runnerName} ${item?.gameType=="cricket" && item?.betFaireType=="betfair" && item?.eventId!="" ? "/ Match Odds" 
                                        : item?.gameType=="cricket" && item?.betFaireType=="boomaker" && item?.eventId!="" ?" /Bookmaker" : ""}`:`${item?.remark || ""}`}
                                    </div>
                                  </>)}
                              </td>
                              <td>
                                {item?.agentData?.username}{" "}
                                <span>
                                  <i className="fas fa-arrow-right"> </i>
                                </span>{" "}
                                {item?.forBet != 0 || item?.forBet != "0"
                                  ? "-->"
                                  : `Agent ->${item?.userData?.username}`}
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
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default TransactionHistory2;
