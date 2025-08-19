import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { apiGet } from "../utils/apiFetch";
import obj from "../utils/constants";
import apiPath from "../utils/apiPath";
import ReactPaginate from "react-paginate";
import { Link, useParams } from "react-router-dom";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
const DisplayMatchBet = () => {
  let { user } = useContext(AuthContext);

  const [data, setData] = useState([]);
  const parmas = useParams();
  const getData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.preMatchEventsBets + "?eventId=" + parmas.eventId
    );
    if (status === 200) {
      if (response_users.success) {
        setData(response_users.results);
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Match Bet</h2>
          </div>
          <div className="inner-wrapper">
            <div className="common-container">
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Sr No.</th>
                        <th scope="col">Client</th>
                        <th scope="col">Rate </th>
                        <th scope="col">Team</th>
                        <th scope="col">Mode</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Date & Time</th>
                      </tr>
                    </thead>
                    {data && data?.length > 0 ? (
                      data?.map((item, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td> {item?.clientName}</td>
                            <td> {item?.bhav}</td>
                            <td> {item?.teamName}</td>
                            <td> {item?.betFaireType}</td>
                            <td> {item?.amount}</td>
                            <td>
                              {" "}
                              {helpers.dateFormat(
                                item.timeInserted,
                                user.timeZone
                              )}
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

export default DisplayMatchBet;
