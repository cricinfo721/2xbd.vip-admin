import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import helpers from "../utils/helpers";
const Statements = () => {
  const { id } = useParams();
  const [getLogData, setLogData] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    user_id: id,
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
    myStatementData();
  }, [search_params]);

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec d-flex justify-content-between align-items-center mb-2">
            <h2 className="common-heading">Account Statement</h2>
            <Link to={`/PlayerBalance`} style={{ textDecoration: "none" }}>
              <span
                className="green-btn cursor-pointer"
                style={{
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                Back
              </span>
            </Link>
          </div>

          <div className="inner-wrapper">
            <div className="common-container">
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Date/Time</th>
                        <th scope="col">Deposit</th>
                        <th scope="col">Withdraw</th>
                        <th scope="col">Balance</th>
                        <th scope="col">Remark</th>
                        <th scope="col">From/To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getLogData.data &&
                        getLogData.data.map((item, key) => (
                          <tr key={key}>
                            <td>{helpers.dateFormat(item?.createdAt)}</td>
                            <td>
                              {item?.transactionType === "credit" ? (
                                <span className="text-success">
                                  {helpers.currencyFormat(
                                    Math.abs(item?.amount)
                                  )}
                                </span>
                              ) : (
                                "-"
                              )}{" "}
                            </td>
                            <td>
                              {item?.transactionType === "debit" ? (
                                <span className="text-danger">
                                  {"(" +
                                    helpers.currencyFormat(
                                      Math.abs(item?.amount)
                                    ) +
                                    ")"}
                                </span>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>{helpers.currencyFormat(item?.newBalance)}</td>
                            <td>{item?.remark}</td>
                            <td>
                              {item?.createdByData?.userType}{" "}
                              {item?.userData?.username}
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
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Statements;
