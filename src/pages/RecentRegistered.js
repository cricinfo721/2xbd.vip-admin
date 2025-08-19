import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { apiGet } from "../utils/apiFetch";
import obj from "../utils/constants";
import apiPath from "../utils/apiPath";
import moment from "moment";
import ReactPaginate from "react-paginate";
import { useLocation } from "react-router-dom";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
const RecentRegistered = () => {
  let { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const location = useLocation();
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const getData = async (obj = filter) => {
    const { status, data: response_users } = await apiGet(
      apiPath.recentRegisteredUser,
      {
        page: obj?.page || 1,
        limit: obj?.limit,
      }
    );
    if (status === 200) {
      if (response_users.success) {
        setData(response_users?.results);
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handlePageClick = (event) => {
    let obj = {
      page: event.selected + 1,
      limit: filter?.limit,
    };
    setFilter(obj);
    getData(obj);
  };

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">New Registered Member ( Last 24 Hours )</h2>
          </div>
          <div className="inner-wrapper">
            <div className="common-container">
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th className="" scope="col">
                          Sr.
                        </th>
                        <th className="text-center" scope="col">
                          Login ID
                        </th>
                        <th className="text-center" scope="col">
                          Name
                        </th>
                        <th className="text-center" scope="col">
                          Registered Date
                        </th>
                      </tr>
                    </thead>
                    {data && data?.length > 0 ? (
                      data?.map((item, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.username}</td>
                            <td className="text-center">{item?.username}</td>
                            <td className="text-center">
                              {helpers.dateFormat(item?.createdAt)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={12}>
                          <span>You have no bets in this time period.</span>
                        </td>
                      </tr>
                    )}
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default RecentRegistered;
