import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import BetTypeListing from "./BetTypeListing";
import FancyBetTypeListing from "./FancyBetTypeListing";
import FancyBetTypeListingNew from "./FancyBetTypeListingNew";
import SportBookListing from "./SportBookListing";
import PremiumListing from "./PremiumListing";
import BinaryListing from "./BinaryListing";
import { apiGet, apiPost } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { useEffect } from "react";
import obj from "../../utils/constants";
import helpers from "../../utils/helpers";
import AuthContext from "../../context/AuthContext";
import io from "socket.io-client";
import { isEmpty } from "lodash";
const RiskManagement = () => {
  const [headerTab, setHeaderTab] = useState("amount");
  const [matchData, setMatchData] = useState([]);
  const [topData, setTopdata] = useState({});
  const [eventId, setEventId] = useState("");
  const [matchName, setMatchName] = useState("");
  const [detailsData, setDetailsData] = useState({});
  const [fancyCentralizedIdArray, setFancyCentralizedIdArray] = useState([]);
  const [fancyList, setFancyList] = useState([]);
  const [sportBookList, setSportBookList] = useState([]);
  const [premiumCricketList, setPremiumCricketList] = useState([]);
  const [back_odds, setBackOdds] = useState([]);
  const [lay_odds, setLayOdds] = useState([]);
  const [betFairData, setBetFairData] = useState([]);
  const [bookmakerData, setBookmakerData] = useState([]);
  const [betFairCentralizedIds, setBetFairCentralizedIds] = useState([]);
  const [bookmakerCentralizedIds, setBookMakerCentralizedIds] = useState([]);
  const [betFaireDataCheck, setBetFaireDataCheck] = useState(false);
  const [bookmakerDataCheck, setBookmakerDataCheck] = useState(false);
  const [fancyOdds, setFancyOddds] = useState({});
  const [search_params, setSearchParams] = useState({
    eventType: 4,
    status: "in_play",
  });
  const navigate = useNavigate();
  let { user } = useContext(AuthContext);
  // console.log(user, "user");
  const getMatchData = async (id) => {
    let obj = {};
    if (id) {
      obj = {
        eventType: id,
        status: "in_play",
      };
    } else {
      obj = { ...search_params };
    }
    const { status, data: response_users } = await apiGet(
      apiPath.matchFilterList,
      obj
    );
    if (status === 200) {
      if (response_users.success) {
        if (response_users.results) {
          setMatchData(response_users.results);
          setDetailsData({});
          setEventId("");
          setMatchName("");
        }
      }
    }
  };
  const getTopAmount = async () => {
    const { status, data: response_users } = await apiGet(apiPath.riskProfile);
    if (status === 200) {
      if (response_users.success) {
        if (response_users.results) {
          setTopdata(response_users.results);
        }
      }
    }
  };

  const [apiBetfairData, setApiBetfairData] = useState([]);
  const [apiBookmakerData, setApiBookamerData] = useState([]);
  const [apiFancyData, setApiFancyData] = useState([]);

  const getRiskData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.riskMatchList,
      {
        userId: user._id,
        userType: user.userType,
      }
    );
    if (status === 200) {
      if (response_users.success) {
        setBetFaireDataCheck(true);
        if (response_users.results) {
          // setMatchName(
          //   matchData?.filter((res) => res.eventId === eventId)[0]?.eventName
          // );
          const fancyCentralizedIdArr = response_users?.results.fancyList?.map(
            (rt) => rt.marketId
          );
          // let fancyListMain = response_users?.results?.fancyList?.filter(
          //   (res) => {
          //     return res.odds?.rt?.length > 0;
          //   }
          // );
          setFancyCentralizedIdArray(fancyCentralizedIdArr);
          setBetFairData(
            response_users?.results ? response_users?.results : []
          );
          let updated =
            response_users?.results?.length > 0
              ? response_users?.results?.filter((res) => {
                  return res?.status == "in_play";
                })
              : [];
          if (updated?.length > 0) {
            getOdds(
              updated?.map((res) => {
                return res?.marketId;
              })
            );
            setApiBetfairData(updated);
          }

          const betFairCentralizedIdsData =
            response_users?.results &&
            response_users?.results.length > 0 &&
            response_users?.results?.map((r) => r.marketId);

          if (betFairCentralizedIdsData && betFairCentralizedIdsData.length) {
            setBetFairCentralizedIds(betFairCentralizedIdsData);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (apiBetfairData?.length > 0) {
      let interval = setInterval(() => {
        getOdds(
          apiBetfairData?.map((res) => {
            return res?.marketId;
          })
        );
      }, 5000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [apiBetfairData]);

  useEffect(() => {
    if (apiBookmakerData?.length > 0) {
      let interval = setInterval(() => {
        getOddsBookmaker(
          apiBookmakerData?.map((res) => {
            return res?.eventId;
          })
        );
      }, 5000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [apiBookmakerData]);
  const getRiskDataBookmaker = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.riskMatchListBookmaker
    );
    if (status === 200) {
      if (response_users.success) {
        setBookmakerDataCheck(true);
        if (response_users?.results && response_users.results.length > 0) {
          setBookmakerData(response_users?.results);
          let updated = response_users?.results?.filter((res) => {
            return res?.status == "in_play";
          });
          if (updated?.length > 0) {
            getOddsBookmaker(
              updated?.map((res) => {
                return res?.eventId;
              })
            );
            setApiBookamerData(updated);
          }
          const bookMakerCentralizedIdsData = response_users?.results?.map(
            (r) => r.marketId
          );
          if (
            bookMakerCentralizedIdsData &&
            bookMakerCentralizedIdsData.length
          ) {
            setBookMakerCentralizedIds(bookMakerCentralizedIdsData);
          }
        }
      }
    }
  };

  const getDetails = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.riskManagementDetails + `?eventId=${eventId}`
    );
    if (status === 200) {
      if (response_users.success) {
        if (response_users.results) {
          setMatchName(
            matchData?.filter((res) => res.eventId === eventId)[0]?.eventName
          );
          const fancyCentralizedIdArr = response_users?.results.fancyList?.map(
            (rt) => rt.centralizedId
          );
          setDetailsData(response_users.results);
          // setFancyList(response_users?.results?.fancyList || []);
          setFancyCentralizedIdArray(fancyCentralizedIdArr);
        }
      }
    }
  };

  const getRiskFancyData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.riskManagementFancy
    );
    if (status === 200) {
      if (response_users.success) {
        setFancyList(response_users?.results || []);
      }
    }
  };

  const getFancyData = async (id, selectionId) => {
    const { status, data: message } = await apiGet(
      apiPath.getFancyOdds + `?eventId=${id}`
    );
    if (status === 200) {
      if (message.success) {
        if (message?.results?.length > 0) {
          let obj = message?.results?.find((res) => {
            return res?.selectionId == selectionId;
          });
          if (!isEmpty(obj)) {
            setFancyOddds(obj);
          }
        }
      }
    }
  };
  const getOdds = async (id) => {
    const { status, data: response_users } = await apiGet(
      apiPath.getMatchOdds + `?marketId=${id?.join(",")}&multi=true`
    );
    if (status === 200) {
      if (response_users.success) {
        if (response_users.results?.length > 0) {
          setBetFairData((current) =>
            current.map((obj) => {
              let newObj = response_users?.results?.find((res) => {
                return res?.mi == obj?.marketId;
              });
              if (obj?.marketId == newObj?.mi) {
                const back_odds = newObj.rt.filter((rt) => rt.ib) || [];
                const lay_odds = newObj.rt.filter((rt) => !rt.ib) || [];
                return { ...obj, back_odds: back_odds, lay_odds: lay_odds };
              }
              return obj;
            })
          );
        }
      }
    }
  };

  const getOddsBookmaker = async (id) => {
    const { status, data: response_users } = await apiGet(
      apiPath.getBookmakerOdds + `?eventId=${id?.join(",")}&multi=true`
    );
    if (status === 200) {
      if (response_users.success) {
        if (response_users.results?.length > 0) {
          setBookmakerData((current) =>
            current.map((obj) => {
              let newObj = response_users?.results?.find((res) => {
                return res?.mi == obj?.marketId;
              });
              if (obj?.marketId == newObj?.mi) {
                const back_odds = newObj.rt.filter((rt) => rt.ib) || [];
                const lay_odds = newObj.rt.filter((rt) => !rt.ib) || [];
                return { ...obj, back_odds: back_odds, lay_odds: lay_odds };
              }
              return obj;
            })
          );
        }
      }
    }
  };
  const getRiskPremiumData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.riskManagementPremium
    );
    if (status === 200) {
      // console.log('betx365.ca',response_users)
      if (response_users.success) {
        if (response_users.results) {
          // setFancyList(response_users?.results || []);
          setSportBookList(response_users?.results?.sportBook || []);
          setPremiumCricketList(response_users?.results?.premiumCricket || []);
        }
      }
    }
  };

  useEffect(() => {
    getMatchData();
    getTopAmount();
    getRiskData();
    getRiskFancyData();
    getRiskPremiumData();
    getRiskDataBookmaker();
  }, []);

  const socketOddsWork = async (eventId, selectionId) => {
    const newSocket = io(
      `${process.env.REACT_APP_API_BASE_URL1}?token=${user._id}&userType=front&eventId=${eventId}`,
      {
        transports: ["websocket"],
        forceNew: true,
      }
    );

    const listenBetfairOdds = (event) => {
      const socket_data =
        (event && event?.results?.find((item) => item.eventId == eventId)) ||
        [];
      if (
        socket_data &&
        socket_data?.eventId &&
        eventId == socket_data?.eventId
      ) {
        if (socket_data.rt?.length) {
          setBetFairData((current) =>
            current.map((obj) => {
              if (obj.eventId == eventId) {
                const back_odds = socket_data.rt.filter((rt) => rt.ib) || [];
                const lay_odds = socket_data.rt.filter((rt) => !rt.ib) || [];
                return { ...obj, back_odds: back_odds, lay_odds: lay_odds };
              }
              return obj;
            })
          );
        }
      }
    };

    const listenBookmakerData = (message) => {
      if (message?.results?.rt.length > 0) {
        setBookmakerData((current) => {
          if (current?.length > 0) {
            return current?.map((obj) => {
              //console.log("----------------------",obj?.eventId , message?.eventId);
              if (obj?.eventId == message?.eventId) {
                // console.log("----------------------");
                //if ("rt" in the_odd && the_odd?.rt?.length > 0) {
                const back_odds =
                  message?.results?.rt?.filter((rt) => rt.ib) || [];
                const lay_odds =
                  message?.results?.rt?.filter((rt) => !rt.ib) || [];
                return {
                  ...obj,
                  back_odds: back_odds,
                  lay_odds: lay_odds,
                };
                //}
              }
              return obj;
            });
          }
        });
      }
    };

    const listenDiamondFancy = (message) => {
      console.log("message?.results?", message?.results);
      setFancyList((current) => {
        if (current?.length > 0) {
          return current?.map((obj) => {
            const socket_data =
              (message?.results &&
                message?.results?.find(
                  (item) => item.selectionId == selectionId
                )) ||
              [];

            return {
              ...obj,
              odds: socket_data?.rt,
            };
          });
        }
      });
    };

    newSocket.on("listenDiamondFancy", listenDiamondFancy);
    newSocket.on("listenBetFairOdds", listenBetfairOdds);
    newSocket.on("listenBookmakerOdds", listenBookmakerData);

    return () => newSocket.close();
  };
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="inner-wrapper">
            <div className="common-container">
              {/* top_player-wrap */}
              <div className="top_player-wrap mb-4 w-80">
                <h2 className="common-heading">Risk Management Summary</h2>
                <div className="match-sec-sroller">
                  <ul className="p-0 mb-0">
                    <li
                      onClick={() => {
                        setHeaderTab("amount");
                      }}
                    >
                      <a
                        className={headerTab == "amount" ? "active" : ""}
                        style={{ cursor: "pointer" }}
                      >
                        Top 10 Matched Amount Player
                      </a>
                    </li>
                    <li
                      onClick={() => {
                        setHeaderTab("exposure");
                      }}
                    >
                      <a
                        className={headerTab == "exposure" ? "active" : ""}
                        style={{ cursor: "pointer" }}
                      >
                        Top 10 Exposure Player
                      </a>
                    </li>
                  </ul>

                  <Row className="gx-0">
                    <Col md={6}>
                      <div className="account-table bg-white h-100">
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
                              {(headerTab == "amount"
                                ? topData?.matched
                                : topData?.exposure
                              )?.length > 0 &&
                                (headerTab == "amount"
                                  ? topData?.matched
                                  : topData?.exposure
                                )
                                  ?.slice(0, 5)
                                  .map((res, index) => {
                                    return (
                                      <tr key={index + 1}>
                                        <td>
                                          <Link
                                            to={`/currentBets/${res._id}/${res.userType}`}
                                          >
                                            {index + 1}{" "}
                                            <a href="#">{res.username}</a>
                                          </Link>
                                        </td>
                                        <td>
                                          <strong className="text-danger">
                                            ({" "}
                                            {helpers.currencyFormat(
                                              res.exposure
                                            )}
                                            ){" "}
                                          </strong>
                                        </td>
                                        <td>
                                          {helpers.currencyFormat(
                                            res.totalAmount
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                              {isEmpty(
                                headerTab == "amount"
                                  ? topData?.matched
                                  : topData?.exposure
                              ) ? (
                                <tr>
                                  <td colSpan={9}>No records found</td>
                                </tr>
                              ) : null}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </Col>
                    {(headerTab == "amount"
                      ? topData?.matched
                      : topData?.exposure
                    )?.length > 6 && (
                      <Col md={6}>
                        <div className="account-table bg-white h-100 border_left">
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
                                {(headerTab == "amount"
                                  ? topData?.matched
                                  : topData?.exposure
                                )?.length > 0 &&
                                  (headerTab == "amount"
                                    ? topData?.matched
                                    : topData?.exposure
                                  )
                                    ?.slice(6, 12)
                                    ?.map((res, index) => {
                                      return (
                                        <tr key={index + 1}>
                                          <td>
                                            <Link
                                              to={`/currentBets/${res._id}/${res.userType}`}
                                            >
                                              {index + 6}{" "}
                                              <a href="#">{res.username}</a>
                                            </Link>
                                          </td>
                                          <td>
                                            <strong className="text-danger">
                                              (
                                              {helpers.currencyFormat(
                                                res.exposure
                                              )}
                                              ){" "}
                                            </strong>
                                          </td>
                                          <td>
                                            {helpers.currencyFormat(
                                              res.totalAmount
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                {isEmpty(
                                  headerTab == "amount"
                                    ? topData?.matched
                                    : topData?.exposure
                                ) ? (
                                  <tr>
                                    <td colSpan={9}>No records found</td>
                                  </tr>
                                ) : null}{" "}
                                {topData?.matched?.length >= 10 && (
                                  <tr>
                                    <Button
                                      onClick={() => navigate("/matchedAll")}
                                      className="green-btn mt-2 p-1"
                                    >
                                      View All
                                    </Button>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </div>
              </div>

              {/* top_player-wrap */}

              {betFaireDataCheck && bookmakerDataCheck ? (
                <>
                  {betFairData && betFairData?.length > 0 && (
                    <BetTypeListing
                      title={"Match Odds"}
                      data={betFairData}
                      socketOddsWork={socketOddsWork}
                    />
                  )}
                  {bookmakerData && bookmakerData?.length > 0 && (
                    <BetTypeListing
                      title={"Book Maker"}
                      data={bookmakerData}
                      socketOddsWork={socketOddsWork}
                    />
                  )}

                  {/* {fancyList?.length > 0 && ( */}
                  <FancyBetTypeListingNew
                    title={"Fancy Bet"}
                    data={fancyList ? fancyList : []}
                    socketOddsWork={socketOddsWork}
                    getFancyData={getFancyData}
                    fancyOdds={fancyOdds}
                    setFancyOddds={setFancyOddds}
                  />

                  {/* <FancyBetTypeListing
                    title={"Fancy Bet"}
                    data={fancyList ? fancyList : []}
                    matchName={matchName}
                    detailsData={detailsData}
                    getDetails={[]}
                    setEventId={setEventId}
                    matchData={matchData}
                    eventId={eventId}
                  /> */}
                  {/* )} */}
                </>
              ) : (
                <div
                  id="loader"
                  className="spinner"
                  style={{ display: `block` }}
                ></div>
              )}
              <SportBookListing
                title={"Sports Book"}
                data={sportBookList ? sportBookList : []}
              />
              <PremiumListing
                title={"Premium Cricket"}
                data={premiumCricketList ? premiumCricketList : []}
              />
              <BinaryListing
                title={"Binary"}
                data={fancyList ? fancyList : []}
                matchName={matchName}
                detailsData={detailsData}
              />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default RiskManagement;
