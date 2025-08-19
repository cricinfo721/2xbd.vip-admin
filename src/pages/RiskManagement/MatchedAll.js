import React, { useState, useEffect, useContext } from "react";
import { Container, Form, Table, Button, Modal } from "react-bootstrap";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { isEmpty } from "lodash";
import ReactPaginate from "react-paginate";
import "flatpickr/dist/themes/material_green.css";
import helpers from "../../utils/helpers";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";

const MatchedAll = () => {
  let { user } = useContext(AuthContext);
  const [updateDate, setUpdateDate] = useState(false);
  const [matchData, setMatchData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    status: "active",
    gameType: "cricket",
  });

  const getMatchData = async () => {
    const { status, data: response_users } = await apiGet(apiPath.riskListAll, {
      userId: user._id,
      userType: user.userType,
    });
    if (status === 200) {
      if (response_users.success) {
        setMatchData(response_users.results);
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
    setViewPage(event.selected);
  };

  useEffect(() => {
    getMatchData();
  }, []);

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Matched Amount Player</h2>
          </div>
          <div className="inner-wrapper">
            <div className="common-container">
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th>UID</th>
                        <th>Exposure</th>
                        <th>Matched Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchData &&
                        matchData?.map((res, index) => {
                          return (
                            <tr key={index + 1}>
                              <td>
                                <Link
                                  to={`/currentBets/${res._id}/${res.userType}`}
                                >
                                  {index + 1} <a href="#">{res.username}</a>
                                </Link>
                              </td>
                              <td>
                                <strong className="text-danger">
                                  ( {helpers.currencyFormat(res.exposure)}){" "}
                                </strong>
                              </td>
                              <td>{helpers.currencyFormat(res.totalAmount)}</td>
                            </tr>
                          );
                        })}
                      {isEmpty(matchData) ? (
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
                      forcePage={viewpage}
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

export default MatchedAll;
