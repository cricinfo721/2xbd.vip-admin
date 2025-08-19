import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import Breadcrumbs from "../Users/Breadcrumbs";
import { useLocation, useParams } from "react-router-dom";
import { UserBetListLiveTab } from "./UserBetListLiveTab";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import AuthContext from "../../context/AuthContext";
import { toast } from "wc-toast";
import moment from "moment";

const UserBetListLive = () => {
  const params = useParams();
  const location = useLocation();
  let { user } = useContext(AuthContext);
  const [key, setKey] = useState("Exchange");
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);
  var previousDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  var currentDate = moment().format("YYYY-MM-DD");
  const [filter, setFilter] = useState({
    toPeriod: currentDate,
    fromPeriod: previousDate,
    filterByDay: "",
    userType: params.type,
    id: params.id,
    page: 1,
    limit: 100,
    status: "completed",
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
    let path = apiPath.UserLiveBet;

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
    if (filter.filterByDay != "") {
      getData();
    }
  }, [filter.filterByDay]);
  useEffect(() => {
    setFilter({
      toPeriod: currentDate,
      fromPeriod: previousDate,
      filterByDay: "",
      userType: params.type,
      id: params.id,
      page: 1,
      limit: 100,
      status: "completed",
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
    setPageCount(data?.totalPages || []);
  }, [data]);
  useEffect(() => {
    getData();
    setViewPage(filter.page ? filter.page - 1 : 0);
  }, [filter]);

  const redirectCasino = async (userId, platform, platformTxId, type) => {
    const { status, data: response_users } = await apiGet(
      apiPath.casinoWalletHistory +
        "?userId=" +
        userId +
        "&platform=" +
        platform +
        "&platformTxId=" +
        platformTxId
    );
    //console.log(response_users, status);
    if (status === 200) {
      if (response_users.status) {
        if (response_users.data?.status === "0000") {
          if (type === 1) {
            javascript: window.open(
              response_users.data?.txnUrl,
              "_blank",
              "height=900,width=1200"
            );
          } else {
            javascript: window.open(
              response_users.data?.url,
              "_blank",
              "height=900,width=1200"
            );
          }
        } else {
          toast.error(response_users.data.desc);
        }
      } else {
        toast.error(response_users.data.desc);
      }
    } else {
      toast.error(response_users.data.desc);
    }
  };
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
                <h2 className="common-heading">
                  Bet List Live
                    
                </h2>
                <div className="common-tab">
                  <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => {
                      setKey(k);
                      setFilter({
                        page: 1,
                        limit: 100,
                        toPeriod: "",
                        fromPeriod: "",
                        filterByDay: "",
                        userType: params.type,
                        id: params.id,
                        status: "",
                      });
                    }}
                  >
                    <Tab eventKey="Exchange" title="Exchange">
                      {key === "Exchange" && (
                        <UserBetListLiveTab
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
                        <UserBetListLiveTab
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
                        <UserBetListLiveTab
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
                        <UserBetListLiveTab
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
                    <Tab eventKey="casino" title="Casino">
                      {key === "casino" && (
                        <UserBetListLiveTab
                          url={location.pathname.split("/")[1]}
                          title={key}
                          betType={"casino"}
                          setFilter={setFilter}
                          filter={filter}
                          data={data}
                          getData={getData}
                          viewpage={viewpage}
                          handlePageClick={handlePageClick}
                          pageCount={pageCount}
                          redirectCasino={redirectCasino}
                        />
                      )}
                    </Tab>
                    <Tab eventKey="Toss" title="Toss">
                      {key === "Toss" && (
                        <UserBetListLiveTab
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
                          redirectCasino={redirectCasino}
                        />
                      )}
                    </Tab>
                    <Tab eventKey="Tie" title="Tie">
                      {key === "Tie" && (
                        <UserBetListLiveTab
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
                          redirectCasino={redirectCasino}
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

export default UserBetListLive;
