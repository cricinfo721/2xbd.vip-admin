import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { isEmpty } from "lodash";
import ReactPaginate from "react-paginate";
import helpers from "../../utils/helpers";
import AuthContext from "../../context/AuthContext";
const TransactionLogs = () => {
  const location_params = useParams();

  let { user } = useContext(AuthContext);
  const [getLogData, setLogData] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    user_id: "id" in location_params ? location_params?.id : undefined,
  });
  const myLogData = async () => {
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
    myLogData();
  }, [search_params]);

  return (
    <div>
      <section className="py-4 main-inner-outer">
        <Container fluid>
          <Row>
            <Col lg={12} md={12}>
              <div className="inner-wrapper">
                <h2 className="common-heading">Account Statement</h2>
                <section className="account-table">
                  <div className="responsive transaction-history">
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
                                )}{" "}
                              </td>
                              <td>
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
                                {helpers.currencyFormat(item?.newBalance)}
                              </td>
                              <td>{item?.remark}</td>
                              <td>
                                {item?.createdByData?.userType} >{" "}
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
                </section>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default TransactionLogs;
