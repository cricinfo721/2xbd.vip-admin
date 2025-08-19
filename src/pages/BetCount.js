import React, { useState, useEffect, useContext } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { apiGet, apiPut } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";

const BetCount = () => {
  const [chetBeat, setChetBeat] = useState(false);
  const [bets, setBets] = useState(false);
  const [matchData, setMatchData] = useState("");
  
  // const [search_params, setSearchParams] = useState({
  //   page: 1,
  //   limit: 100,
  //   status: "active",
  //   gameType: "cricket",
  // });
  const getMatchData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.cheatMatchList,
      // search_params
    );
    if (status === 200) {
      if (response_users.success) {
        setMatchData(response_users.results);
      }
    }
  };
  useEffect(() => {
    getMatchData();
  }, []);
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Cheat Bets</h2>
          </div>

          <div className="inner-wrapper">
            <div className="common-container">
              <div className="account-table batting-table">
                {chetBeat ? (
                  <>
                    <div className="mb-3 text-end">
                      <Button
                        type="button"
                        className="green-btn"
                        onClick={() => setChetBeat(false)}
                      >
                        Back
                      </Button>
                    </div>

                    <div className="responsive">
                      <Table>
                        <thead>
                          <tr>
                            <th scope="col">SNo.</th>
                            <th scope="col"> User Id </th>
                            <th scope="col">Dealer</th>
                            <th scope="col"> Master</th>
                            <th scope="col">SST</th>
                            <th scope="col">Bet Count</th>
                            <th scope="col">Bunch Count</th>
                            <th scope="col">Show Bets</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>nurhosen9999</td>
                            <td>nasim7</td>
                            <td>nasid77</td>
                            <td>nasimbd777</td>
                            <td>21</td>
                            <td>2</td>
                            <td>
                              <a
                                href="#"
                                className="green-btn"
                                onClick={() => setBets(true)}
                              >
                                Bets
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="responsive">
                      <Table>
                        <thead>
                          <tr>
                            <th scope="col">SNo.</th>
                            <th scope="col"> Match Name </th>
                            <th scope="col">Sport</th>
                            <th scope="col">Match Date </th>
                            <th scope="col">User Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>
                              <a href="#" onClick={() => setChetBeat(true)}>
                                Ireland Women v Bangladesh Women
                              </a>
                            </td>
                            <td>Cricket</td>
                            <td>2022-09-25 20:30:00</td>
                            <td>1</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </>
                )}
              </div>

              {bets && (
                <>
                  <div className="mb-3 ">
                    <Button type="button" className="green-btn">
                      Back
                    </Button>
                  </div>

                  <div className="account-table batting-table">
                    <div className="responsive">
                      <Table>
                        <thead>
                          <tr>
                            <th scope="col">SNo.</th>
                            <th scope="col"> Member </th>
                            <th scope="col">Market</th>
                            <th scope="col"> Selection</th>
                            <th scope="col">Back/Lay</th>
                            <th scope="col">Odds</th>
                            <th scope="col">Stake</th>
                            <th scope="col">Pnl</th>
                            <th scope="col">Date</th>
                            <th scope="col">PlaceTime</th>
                            <th scope="col">MatchedTime</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>nurhosen9999</td>
                            <td>Match odds</td>
                            <td>Ireland Women</td>
                            <td>Back</td>
                            <td>3.4</td>
                            <td>1</td>
                            <td>3.4 </td>
                            <td>2022-09-25 </td>
                            <td>Sun Sep 25 22:40:39 IST 2022</td>
                            <td>Sun Sep 25 22:40:45 IST 2022</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default BetCount;
