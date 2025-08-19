import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import Breadcrumbs from "./Users/Breadcrumbs";
import { useLocation, useParams } from "react-router-dom";
import { BettingHistoryTab } from "./BettingHistory/BettingHistoryTab";
import { apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import AuthContext from "../context/AuthContext";
import { toast } from "wc-toast";
import moment from "moment";

const CurrentBets = () => {
  const params = useParams();
  const location = useLocation();
  let { user } = useContext(AuthContext);
  const [key, setKey] = useState("Exchange");
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);
  var previousDate = moment(new Date())
    .subtract(1, "days")
    .format("YYYY-MM-DD");
  var currentDate = moment(new Date()).format("YYYY-MM-DD");
  const [filter, setFilter] = useState({
    userType: params.type,
    id: params.id,
    status: "active",
  });
  const [data, setData] = useState([]);
  const getData = async (type = "search") => {
    if (filter.filterByDay != "") {
      if (filter.filterByDay == "today") {
        filter.fromPeriod = currentDate;
        filter.toPeriod = currentDate;
      }
      if (filter.filterByDay == "yesterday") {
        filter.fromPeriod = previousDate;
        filter.toPeriod = currentDate;
      }
    }
    let path = apiPath.betHistory;

    let obj;
    if (type !== "reset") {
      obj = {
        ...filter,
        betType:
          key == "Exchange"
            ? "betfair"
            : key == "FancyBet"
            ? "fancy"
            : key == "Sportsbook"
            ? "sportBook"
            : key == "BookMaker"
            ? "bookmaker"
            : key == "Toss"
            ? "toss"
            : key == "Tie"
            ? "tie"
            : "casino",
      };
    } else {
      obj = {
        toPeriod: "",
        fromPeriod: "",
        filterByDay: "",
        userType: params.type,
        id: params.id,
        betType:
          key == "Exchange"
            ? "betfair"
            : key == "FancyBet"
            ? "fancy"
            : key == "Sportsbook"
            ? "sportBook"
            : key == "BookMaker"
            ? "bookmaker"
            : key == "Toss"
            ? "toss"
            : key == "Tie"
            ? "tie"
            : "casino",
      };
    }

    const { status, data: response_users } = await apiGet(path, obj);
    if (status === 200) {
      if (response_users.success) {
        setData(response_users.results);
      }
    }
  };
  useEffect(() => {
    setFilter({
      userType: params.type,
      id: params.id,
      status: "active",
    });
    setKey("Exchange");
  }, [location, currentDate, previousDate]);

  const handlePageClick = (event) => {
    setFilter((prevState) => {
      return {
        ...prevState,
        page: event.selected + 1,
      };
    });
    setViewPage(event.selected);
  };
  useEffect(() => {
    getData();
  }, [filter]);
  console.log("key",key);
  return (
    <div>
      <section className="py-4 main-inner-outer">
        <Container fluid>
          <div className="accout_cols_outer">
            <div className="right_side">
              <div className="inner-wrapper">
                <h2 className="common-heading">Current Bets</h2>
                <div className="common-tab">
                  <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => {
                      setKey(k);
                      setFilter({
                        userType: params.type,
                        id: params.id,
                        status: "active",
                      });
                    }}
                  >
                    <Tab eventKey="Exchange" title="Exchange">
                      {key === "Exchange" && (
                        <BettingHistoryTab
                          url={location.pathname.split("/")[1]}
                          title={key}
                          betType={"betfair"}
                          setFilter={setFilter}
                          filter={filter}
                          data={data}
                          getData={getData}
                          viewpage={viewpage}
                          handlePageClick={handlePageClick}
                          pageCount={pageCount}
                        />
                      )}
                    </Tab>
                    <Tab eventKey="FancyBet" title="FancyBet">
                      {key === "FancyBet" && (
                        <BettingHistoryTab
                          url={location.pathname.split("/")[1]}
                          title={key}
                          betType={"fancy"}
                          setFilter={setFilter}
                          filter={filter}
                          data={data}
                          getData={getData}
                          viewpage={viewpage}
                          handlePageClick={handlePageClick}
                          pageCount={pageCount}
                        />
                      )}
                    </Tab>
                    <Tab eventKey="Sportsbook" title="Sportsbook">
                      {key === "Sportsbook" && (
                        <BettingHistoryTab
                          url={location.pathname.split("/")[1]}
                          title={key}
                          betType={"sportBook"}
                          setFilter={setFilter}
                          filter={filter}
                          data={data}
                          getData={getData}
                          viewpage={viewpage}
                          handlePageClick={handlePageClick}
                          pageCount={pageCount}
                        />
                      )}
                    </Tab>
                    <Tab eventKey="BookMaker" title="BookMaker">
                      {key === "BookMaker" && (
                        <BettingHistoryTab
                          url={location.pathname.split("/")[1]}
                          title={key}
                          betType={"bookmaker"}
                          setFilter={setFilter}
                          filter={filter}
                          data={data}
                          getData={getData}
                          viewpage={viewpage}
                          handlePageClick={handlePageClick}
                          pageCount={pageCount}
                        />
                      )}
                    </Tab>
                    <Tab eventKey="Toss" title="Toss">
                      {key === "Toss" && (
                        <BettingHistoryTab
                          url={location.pathname.split("/")[1]}
                          title={key}
                          betType={"toss"}
                          setFilter={setFilter}
                          filter={filter}
                          data={data}
                          getData={getData}
                          viewpage={viewpage}
                          handlePageClick={handlePageClick}
                          pageCount={pageCount}
                        />
                      )}
                    </Tab>
                    <Tab eventKey="Tie" title="Tie">
                      {key === "Tie" && (
                        <BettingHistoryTab
                          url={location.pathname.split("/")[1]}
                          title={key}
                          betType={"tie"}
                          setFilter={setFilter}
                          filter={filter}
                          data={data}
                          getData={getData}
                          viewpage={viewpage}
                          handlePageClick={handlePageClick}
                          pageCount={pageCount}
                        />
                      )}
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CurrentBets;
