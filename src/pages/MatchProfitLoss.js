import React, { useState, useEffect, useContext } from "react";
import { Container, Form, Table } from "react-bootstrap";
import { apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import "flatpickr/dist/themes/material_green.css";
import { Link, useParams } from "react-router-dom";
import helpers from "../utils/helpers";
import { startCase } from "lodash";
import AuthContext from "../context/AuthContext";
const MatchProfitLoss = () => {
  let { user } = useContext(AuthContext);
  const parmas = useParams();
  const [matchData, setMatchData] = useState("");
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    eventId: parmas?.id,
  });

  const getMatchData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.matchProfitLoss,
      search_params
    );
    if (status === 200) {
      if (response_users.success) {
        setMatchData(response_users.results);
      }
    }
  };

  useEffect(() => {
    getMatchData();
  }, [search_params]);
  console.log(matchData.position);
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Pre Match User Bet</h2>
          </div>

          <div className="inner-wrapper">
            <div className="common-container">
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Sr No.</th>
                        <th scope="col">Username</th>

                        {matchData?.match.jsonData &&
                          matchData?.match.jsonData.length > 0 &&
                          matchData?.match?.jsonData.map((item, index) => {
                            return <th scope="col">{item?.RunnerName}</th>;
                          })}

                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchData?.position &&
                      matchData?.position?.length > 0 ? (
                        matchData?.position?.map((item, index) => {
                          console.log("item", item);
                          return (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{item?.username ? item?.username : "N/A"}</td>
                              <td>
                                {item?.position[0]?.position
                                  ? item?.position[0]?.position
                                  : "N/A"}
                              </td>
                              <td>
                                {item?.position[1]?.position
                                  ? item?.position[1]?.position
                                  : "N/A"}
                              </td>
                              <td>
                                {item?.position[2]?.position
                                  ? item?.position[2]?.position
                                  : "N/A"}
                              </td>
                              <td>
                                <div className="d-flex flex-wrap align-items-center justify-content-center">
                                  <div>
                                    <Link
                                      to={
                                        "/ShowBetsCR/" +
                                        item?.eventId +
                                        "/" +
                                        item?._id
                                      }
                                      className="green-btn"
                                    >
                                      Show Bets
                                    </Link>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={12}>
                            <span>No record found.</span>
                          </td>
                        </tr>
                      )}
                    </tbody>
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

export default MatchProfitLoss;
