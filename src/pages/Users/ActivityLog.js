import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { useParams } from "react-router-dom";
import { isEmpty } from "lodash";
import ReactPaginate from "react-paginate";
import Breadcrumbs from "./Breadcrumbs";
import helpers from "../../utils/helpers";
import AuthContext from "../../context/AuthContext";
const ActivityLog = () => {
  let { user } = useContext(AuthContext);
  const [getLogData, setLogData] = useState("");
  const params = useParams();
  const [pageCount, setPageCount] = useState(0);
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    user_id: params.id,
  });
  const myLogData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.activityLog,
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
          <Breadcrumbs user_id={params?.id} />
          <div className="accout_cols_outer">
            <div className="left_side">
              <Sidebar />
            </div>

            <div className="right_side">
              <div className="inner-wrapper">
                <h2 className="common-heading">Activity Log</h2>

                <section className="account-table">
                  <div className="responsive transaction-history">
                    <Table>
                      <thead>
                        <tr>
                          <th scope="col">Login Date & Time</th>
                          <th scope="col">Login Status</th>
                          <th scope="col">IP Address</th>
                          <th scope="col">ISP</th>
                          <th scope="col">City/State/Country</th>
                          <th scope="col">User Agent Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getLogData.data &&
                          getLogData.data.map((item, key) => (
                            <tr key={key}>
                              <td>
                                {helpers.dateFormat(
                                  item.activityDate,
                                  user.timeZone
                                )}
                              </td>
                              <td>
                                {" "}
                                <span className="text-success">
                                  {item.activityStatus}
                                </span>
                              </td>
                              <td>{(item?.ip) && item?.ip.replace("::ffff:","") || "N/A"}</td>

                              <td>{item.isp || "N/A"}</td>
                              <td>{`${item.city}/${item.region}/${item.country}`}</td>
                              <td>{item.userAgent}</td>
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
                        activeClassName="p-0"
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

export default ActivityLog;
