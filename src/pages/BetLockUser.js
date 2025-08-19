import React, { useState, useEffect, useContext } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import AuthContext from "../context/AuthContext";
import ReactPaginate from "react-paginate";
import { isEmpty, startCase } from "lodash";
import constants from "../utils/constants";
import { Link } from "react-router-dom";
import UpdateStatusUser from "../components/UpdateStatusUser";
const BetLockUser = () => {
  //   const [showBet, setShowBet] = useState(true);
  const [changeStatus, setChangeStatus] = useState(false);
  const [userData, setUserData] = useState({});
  const [currentStatus, setCurrentStatus] = useState("");
  const [getActiveClass, setActiveClass] = useState("");
  const setChangeStatusToggle = (item) => {
    if (item) {
      setChangeStatus(!changeStatus);
      setUserData(item);
      setActiveClass(item.status);
      setCurrentStatus(item.status);
    } else {
      setChangeStatus(!changeStatus);
    }
  };
  const [results, setResults] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);
  let { user } = useContext(AuthContext);
  let user_by_created = user.id;
  const [search_params, setSearchParams] = useState({
    page: 1,
    page_size: 10,
    status: "locked",
    created_by: user_by_created,
  });

  const getUsers = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.lockedUserList,
      search_params
    );
    if (status === 200) {
      if (response_users.success) {
        setResults(response_users?.results || []);
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
    setPageCount(results?.totalPages || []);
  }, [results]);

  useEffect(() => {
    // getUsers();
    setViewPage(search_params.page ? search_params.page - 1 : 0);
  }, [search_params]);
  useEffect(() => {
    getUsers();
  }, [search_params]);

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Bet Locked Users</h2>
          </div>

          <div className="inner-wrapper">
            <div className="common-container">
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">User</th>
                        <th scope="col">Reason</th>
                        <th scope="col"> Super Admin</th>
                        <th scope="col">Admin </th>
                        <th scope="col">Sub Admin</th>
                        <th scope="col">Senior Super</th>
                        <th scope="col">Super Agent</th>
                        <th scope="col">Agent</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results?.data &&
                        results?.data?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{item?.username ? item?.username : "-"}</td>
                              <td>{item?.reason ? item?.reason : "-"}</td>
                              <td>
                                {item?.super_admin?.username
                                  ? item?.super_admin?.username
                                  : "-"}
                              </td>
                              <td>
                                {item?.admin?.username
                                  ? item?.admin?.username
                                  : "-"}
                              </td>
                              <td>
                                {item?.sub_admin?.username
                                  ? item?.sub_admin?.username
                                  : "-"}
                              </td>
                              <td>
                                {item?.super_senior?.username
                                  ? item?.super_senior?.username
                                  : "-"}
                              </td>
                              <td>
                                {item?.super_agent?.username
                                  ? item?.super_agent?.username
                                  : "-"}
                              </td>
                              <td>
                                {item?.agent?.username
                                  ? item?.agent?.username
                                  : "-"}
                              </td>
                              <td>
                              {(user?.userType === "sub_owner" || user?.userType === "owner") && (
                                <>
                                <Button
                                  style={{ color: "#fff" }}
                                  onClick={() => setChangeStatusToggle(item)}
                                >
                                  Update Status
                                </Button>
                                <Link
                                  title="Betting History"
                                  to={`/betting-history/${item?._id}/undefined`}
                                  className="btn"
                                >
                                  Show Bets
                                </Link>
                                </>
                              )}
                              </td>
                            </tr>
                          );
                        })}
                      {isEmpty(results?.data) ? (
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
      <UpdateStatusUser
        changeStatus={changeStatus}
        setChangeStatusToggle={setChangeStatusToggle}
        userData={userData}
        getActiveClass={getActiveClass}
        setActiveClass={setActiveClass}
        getUsers={getUsers}
        currentStatus={currentStatus}
      />
    </div>
  );
};

export default BetLockUser;
