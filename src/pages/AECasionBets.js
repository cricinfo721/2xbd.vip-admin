import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Table,
  Button,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import obj from "../utils/constants";
import helpers from "../utils/helpers";
import Sidebar from "../components/Sidebar";
import Breadcrumbs from "./Users/Breadcrumbs";

import { isEmpty } from "lodash";
import ReactPaginate from "react-paginate";
import AuthContext from "../context/AuthContext";

const AECasionBets = () => {
  const params = useParams();
  let { user } = useContext(AuthContext);
  const [getLogData, setLogData] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
  });

  const myStatementData = async () => {
    search_params.userId = params?.id;
    const { status, data: response_users } = await apiGet(
      apiPath.getAECasinoBets,
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
      <section className="main-inner-outer py-4">
        
        <Container fluid>
            <Breadcrumbs user_id={params?.id} />
            <div className="accout_cols_outer">
                <div className="left_side">
                <Sidebar />
                </div>
                <div className="right_side">
                    <div className="db-sec d-flex justify-content-between align-items-center mb-2">
                        <h2 className="common-heading">
                            Casino Transactions
                        </h2>
                        {/* <Button className="green-btn" onClick={() => window.close()}>
                        Close
                        </Button> */}
                    </div>
                    <section className="account-table">
                      <div className="responsive transaction-history">
                      <Table>
                        <thead>
                          <tr>
                            <th scope="col">Date/Time</th>
                            <th scope="col">Profit</th>
                            <th scope="col"> Loss </th>
                            <th scope="col">Remark</th>
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
        </Container>
      </section>
    </div>
  );
};

export default AECasionBets;