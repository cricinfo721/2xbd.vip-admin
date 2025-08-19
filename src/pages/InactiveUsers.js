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
const InactiveUsers = () => {
  //   const [showBet, setShowBet] = useState(true);
  const [changeStatus, setChangeStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [userData, setUserData] = useState({});
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
    status: "suspend",
    created_by: user_by_created,
  });

  const getUsers = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.profileList,
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
    getUsers();
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
            <h2 className="common-heading">In Active Users</h2>
          </div>

          <div className="inner-wrapper">
            <div className="common-container">
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Account</th>
                        <th scope="col">Credit Ref.</th>
                        <th scope="col">Balance</th>
                        <th scope="col">Exposure</th>
                        <th scope="col">Avail. bal. </th>
                        <th scope="col">Player Balance </th>
                        <th scope="col">Exposure Limit</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results?.data &&
                        results?.data.map((user, index) => {
                          return (
                            <tr key={index}>
                              <td className="text-start">
                                <Link to="#">
                                  <a href={"#"} className="text-primary">
                                    <span>
                                      {constants?.user_status[user?.userType || ""]}
                                    </span>
                                  </a>
                                  {user?.username || null}
                                </Link>
                              </td>
                              <td>
                                <Link to="#">
                                  {`${user?.creditReference}` || null}{" "}
                                  <i className="fas fa-pen text-white ps-1"></i>
                                </Link>
                              </td>
                              <td>
                                {`${user?.totalCoins}` || null}{" "}
                                <i className="fas fa-plus-square"></i>
                              </td>
                              <td>
                                {" "}
                                <Link to="#">
                                  <span className="status-suspend1">
                                    {`${user?.exposure}` || null}
                                  </span>
                                </Link>
                              </td>
                              <td>{`${user?.availableLimit}` || null}</td>
                              <td>{`${user?.playerBalance}` || null}</td>
                              <td>{`${user?.exposureLimit}` || null}</td>
                              <td>
                                {" "}
                                <strong
                                  className="status-suspend px-3"
                                  style={{ marginRight: "10px" }}
                                >
                                  {`${startCase(user?.status)}` || ""}
                                </strong>
                                <Button className="theme_dark_btn"
                                  style={{ color: "#fff" }}
                                  onClick={() => setChangeStatusToggle(user)}
                                >
                                  Update Status
                                </Button>
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

export default InactiveUsers;
