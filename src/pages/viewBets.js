import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import obj from "../utils/constants";
import { useParams } from "react-router-dom";

const BetListLive = () => {
  const [unmatched, setUnmatched] = useState("");
  const params = useParams();
  const [filter, setFilter] = useState({
    eventId: params.eventId,
    betType: "betfair",
  });

  const [data, setData] = useState([]);

  const getData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.eventsBets,
      filter
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
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Bet List</h2>
          </div>
          <div className="inner-wrapper">
            <div className="common-container">
              <Form className="bet_status bet-list-live">
                <div key={`inline-radio`} className="mb-2">
                  {obj.betCheckDataInner.map((type) => {
                    return (
                      <Form.Check
                        inline
                        label={type.value}
                        name={type.label}
                        type="radio"
                        checked={type.label === filter.betType ? true : false}
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            betType: e.target.name,
                          })
                        }
                        id={`inline-radio-1`}
                      />
                    );
                  })}
                </div>
              </Form>
              {filter.betType === "betfair" && (
                <div className="account-table">
                  <caption className="d-block text-start">UnMatched</caption>
                  <div className="responsive">
                    <Table>
                      <thead>
                        <tr>
                          <th scope="col">Match</th>
                          <th scope="col">Match ID</th>
                          <th scope="col"> Bet ID</th>
                          <th scope="col">Bet placed</th>
                          <th scope="col">IP Address </th>
                          <th scope="col">Market</th>
                          <th scope="col">Selection</th>
                          <th scope="col">Type</th>
                          <th scope="col">Odds req.</th>
                          <th scope="col">Stake </th>
                          <th scope="col">Liability</th>
                        </tr>
                      </thead>
                      {data?.BetFairBet?.unMatched.length > 0 ? (
                        data?.BetFairBet?.unMatched?.map((item) => {
                          return (
                            <tr>
                              <td>{item?.matchName || "N/A"}</td>
                              <td>{item?.eventId || "N/A"}</td>
                              <td> {item?.matchBetId || "N/A"}</td>
                              <td> {item?.betType || "N/A"}</td>
                              <td> {(item?.ipAddress) && item?.ipAddress.replace("::ffff:","") || "N/A"}</td>
                              <td> {item?.amount || "N/A"}</td>
                              <td> {item?.selectionId || "N/A"}</td>
                              <td> {item?.betType || "N/A"} </td>
                              <td> {item?.bhav || "N/A"} </td>
                              <td> {item?.amount || "N/A"} </td>
                              <td> {item?.loseAmount || "N/A"} </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={11}>
                            <span>You have no bets in this time period.</span>
                          </td>
                        </tr>
                      )}
                    </Table>
                  </div>
                </div>
              )}

              <div className="account-table batting-table">
                <caption className="d-block text-start">Matched</caption>
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Match</th>
                        <th scope="col">Match ID</th>
                        <th scope="col"> Bet ID</th>
                        <th scope="col">Bet placed</th>
                        <th scope="col">IP Address </th>
                        <th scope="col">Market</th>
                        <th scope="col">Selection</th>
                        <th scope="col">Type</th>
                        <th scope="col">Odds req.</th>
                        <th scope="col">Stake </th>
                        <th scope="col">Liability</th>
                      </tr>
                    </thead>
                    {filter.betType === "betfair" && (
                      <>
                        {data?.BetFairBet?.matched.length > 0 ? (
                          data?.BetFairBet?.matched?.map((item) => {
                            return (
                              <tr>
                                <td>{item?.matchName || "N/A"}</td>
                                <td>{item?.eventId || "N/A"}</td>
                                <td> {item?.matchBetId || "N/A"}</td>
                                <td> {item?.betType || "N/A"}</td>
                                <td> {(item?.ipAddress) && item?.ipAddress.replace("::ffff:","") || "N/A"}</td>
                                <td> {item?.amount || "N/A"}</td>
                                <td> {item?.selectionId || "N/A"}</td>
                                <td> {item?.betType || "N/A"} </td>
                                <td> {item?.bhav || "N/A"} </td>
                                <td> {item?.amount || "N/A"} </td>
                                <td> {item?.loseAmount || "N/A"} </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={10}>
                              <span>You have no bets in this time period.</span>
                            </td>
                          </tr>
                        )}
                      </>
                    )}

                    {filter.betType === "bookmaker" && (
                      <>
                        {data?.BookmakerBet.length > 0 ? (
                          data?.BookmakerBet?.map((item) => {
                            return (
                              <tr>
                                <td>{item?.matchName || "N/A"}</td>
                                <td>{item?.eventId || "N/A"}</td>
                                <td> {item?.matchBetId || "N/A"}</td>
                                <td> {item?.betType || "N/A"}</td>
                                <td>{(item?.ipAddress) && item?.ipAddress.replace("::ffff:","") || "N/A"}</td>
                                <td> {item?.amount || "N/A"}</td>
                                <td> {item?.selectionId || "N/A"}</td>
                                <td> {item?.betType || "N/A"} </td>
                                <td> {item?.bhav || "N/A"} </td>
                                <td> {item?.amount || "N/A"} </td>
                                <td> {item?.loseAmount || "N/A"} </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={10}>
                              <span>You have no bets in this time period.</span>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                    {filter.betType === "fancy" && (
                      <>
                        {data?.FancyBet.length > 0 ? (
                          data?.FancyBet?.map((item) => {
                            return (
                              <tr>
                                <td>{item?.matchName || "N/A"}</td>
                                <td>{item?.eventId || "N/A"}</td>
                                <td> {item?.matchBetId || "N/A"}</td>
                                <td> {item?.betType || "N/A"}</td>
                                <td> {(item?.ipAddress) && item?.ipAddress.replace("::ffff:","") || "N/A"}</td>
                                <td> {item?.amount || "N/A"}</td>
                                <td> {item?.selectionId || "N/A"}</td>
                                <td> {item?.betType || "N/A"} </td>
                                <td> {item?.bhav || "N/A"} </td>
                                <td> {item?.amount || "N/A"} </td>
                                <td> {item?.loseAmount || "N/A"} </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={10}>
                              <span>You have no bets in this time period.</span>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                    {filter.betType === "sportBook" && (
                      <>
                        {data?.SportBooksBet.length > 0 ? (
                          data?.SportBooksBet?.map((item) => {
                            return (
                              <tr>
                                <td>{item?.matchName || "N/A"}</td>
                                <td>{item?.eventId || "N/A"}</td>
                                <td> {item?.matchBetId || "N/A"}</td>
                                <td> {item?.betType || "N/A"}</td>
                                <td> {(item?.ipAddress) && item?.ipAddress.replace("::ffff:","") || "N/A"}</td>
                                <td> {item?.amount || "N/A"}</td>
                                <td> {item?.selectionId || "N/A"}</td>
                                <td> {item?.betType || "N/A"} </td>
                                <td> {item?.bhav || "N/A"} </td>
                                <td> {item?.amount || "N/A"} </td>
                                <td> {item?.loseAmount || "N/A"} </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={10}>
                              <span>You have no bets in this time period.</span>
                            </td>
                          </tr>
                        )}
                      </>
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

export default BetListLive;
