import React, { useEffect, useState, useContext } from "react";
import { Container, Form, Button } from "react-bootstrap";

import AuthContext from "../../context/AuthContext";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import helpers from "../../utils/helpers";
import List from "./List";

const Banking = () => {
  let { user, user_coins } = useContext(AuthContext);
  let user_by_created = user.id;

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState();

  const [reset, setRest] = useState(false);
  const [results, setResults] = useState([]);
  const [getLimit, setLimit] = useState({});

  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    keyword: "",
    status: "active",
    created_by: user_by_created,
  });

  const getLimitData = async () => {
    const { status, data: response_users } = await apiGet(apiPath.checkLimit);
    if (status === 200) {
      if (response_users.success) {
        setLimit(response_users.results);
      }
    }
  };
  // console.log("getLimit", getLimit);

  const [balance, setBalance] = useState({
    totalAvailableLimit: 0,
    totalAmount: 100,
    totalCoins: 100,
    playerBalance: 0,
    availableLimit: 0,
    exposure: 0,
  });

  const handlePageClick = (event) => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: event.selected + 1,
      };
    });
  };

  const handleSubmit = () => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: 1,
        keyword,
        status,
      };
    });
  };

  const resetList = () => {
    setRest(true);
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: 1,
        page_size: 10,
        keyword: "",
        status: "active",
      };
    });

    document.getElementById("searchForm").reset();
    setKeyword("");
    setStatus("active");
  };
  const [totalTable, setTotalTable] = useState({
    Balance: 0,
    Available: 0,
    Exposure: 0,
    Credit_Reference: 0,
    Reference: 0,
  });
  const getUsers = async (keyword) => {
    search_params.keyword=search_params.keyword?search_params.keyword:keyword;
    const { status, data: response_users } = await apiGet(
      apiPath.profileList,
      search_params
    );
    if (status === 200) {
      if (response_users.success) {
        setResults(response_users?.results || []);
        console.log(response_users?.results?.data);
        if (response_users?.results?.data?.length > 0) {
          let total = response_users?.results?.data?.reduce((res, acc) => {
            return (acc?.userType == "user")?(res += acc.totalCoins):(res += acc.totalCoins1+ Math.abs(acc?.exposure));
          }, 0);
          let Available = response_users?.results?.data?.reduce((res, acc) => {
            return (res += Math.abs(acc?.totalCoins - acc?.exposure));
          }, 0);
          let Exposure = response_users?.results?.data?.reduce((res, acc) => {
            return (res += acc?.exposure);
          }, 0);
          let Reference = response_users?.results?.data?.reduce((res, acc) => {
            return (res += acc.totalCoins - acc.creditReference);
          }, 0);
          let creditReference = response_users?.results?.data?.reduce(
            (res, acc) => {
              return (res += acc.creditReference);
            },
            0
          );
          setTotalTable({
            Balance: total,
            Available: Available,
            Exposure: Exposure,
            Credit_Reference: creditReference,
            Reference: Reference,
          });
        }
        if ("balance" in response_users?.results) {
          setBalance((prevState) => {
            const balance_info = response_users?.results?.balance;
            return {
              ...prevState,
              totalAvailableLimit: balance_info.totalAvailableLimit,
              totalAmount: balance_info.totalAmount,
              totalCoins: balance_info.totalCoins,
              playerBalance: balance_info.playerBalance,
              availableLimit: balance_info.availableLimit,
              exposure: balance_info.exposure,
            };
          });
        }
      }
    }
    setRest(false);
  };

  
  const refreshList = () => {
    getUsers();
  };

  useEffect(() => {
    getUsers();
    getLimitData();
  }, [search_params]);
  useEffect(() => {
    if (keyword && keyword.length > 2) {
      getUsers(keyword);
    }
  }, [keyword]);
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Banking</h2>
          </div>

          <div className="find-member-sec search_banking_detail">
            <Form id={"searchForm"}>
              <Form.Group className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Find member..."
                  onChange={(e) => {
                    setKeyword(e.target.value.replace(/\s+$/, ""));
                  }}
                />
                <i className="fas fa-search"></i>
                <Button className="search-btn" onClick={handleSubmit}>
                  Search
                </Button>
              </Form.Group>
              <Form.Group className="d-flex align-items-center ps-3 mb-3 mb-sm-0">
                <Form.Label className="pe-3 mb-0">Status</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setSearchParams((prevState) => {
                      return {
                        ...prevState,
                        status: e.target.value,
                      };
                    });
                  }}
                >
                  <option value="active">Active</option>
                  <option value="suspend">Suspend</option>
                  <option value="locked">Locked</option>
                  <option value="">All</option>
                </Form.Select>
              </Form.Group>
              <button className="btn" type="button" onClick={resetList}>
                {" "}
                <i className="fas fa-redo-alt"></i>
              </button>
            </Form>

            <div className="inner-wrapper">
              <div className="common-container">
                <div className="bet_status bank_balance_detail d-sm-flex align-items-center my-1 my-sm-3">
                  <h6 className="mb-0">Your Balance </h6>
                  <strong>
                    <small>BDT</small>
                    {helpers.currencyFormat(user_coins)}
                  </strong>
                </div>

                <List
                  results={results}
                  handlePageClick={handlePageClick}
                  refreshList={refreshList}
                  totalTable={totalTable}
                  getLimit={getLimit}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Banking;
