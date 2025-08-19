import React, { useState, useEffect, useContext } from "react";
import { Button, Col, Row, Container, Form, Table } from "react-bootstrap";
import { apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import AuthContext from "../context/AuthContext";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";

const FancyResult = () => {
  const [fancy, setFancy] = useState(false);
  const deleteFancyToggle = (selectionId) => {
    setSelectionId(selectionId);
    setFancy(!fancy);
  };

  const [matchData, setMatchData] = useState([]);
  const [fancyData, setFancyData] = useState([]);
  const [eventId, setEventId] = useState("");
  const [selectionId, setSelectionId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [fancyStatus, setFancyStatus] = useState("");
  const [decision, setDecision] = useState("");

  const getMatchData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.matchFilterList,
      search_params
    );
    if (status === 200) {
      if (response_users.success) {
        if (response_users.results) {
          setMatchData(response_users.results);
        }
      }
    }
  };

  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    eventType: 4,
    status: "",
  });

  const handleEventType = (eventType) => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: 1,
        eventType: eventType,
      };
    });
  };

  const handleMatch = async (eventId) => {
    setEventId(eventId);
  };
  const handleKeyword = async (keyword) => {
    setKeyword(keyword);
  };
  const handleFancyStatus = async (fancyStatus) => {
    setFancyStatus(fancyStatus);
  };

  const handleSearch = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.fancyList +
        "?eventId=" +
        eventId +
        "&keyword=" +
        keyword +
        "&fancyStatus=" +
        fancyStatus
    );
    if (status === 200) {
      if (response_users.success) {
        if (response_users.results) {
          setFancyData(response_users.results);
        }
      }
    }
  };

  useEffect(() => {
    getMatchData();
  }, [search_params]);

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="inner-wrapper">
            <div className="common-container">
              <Form className="bet_status bet-list-live">
                <Row className="justify-content-center">
                  <Col xl={10} lg={12} md={12}>
                    <Row className="justify-content-between">
                      <Col lg={2} sm={6} className="mb-3">
                        <div className="bet-sec">
                          <Form.Label className="pe-1">
                            Select Sport:
                          </Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            onChange={(e) => {
                              handleEventType(e.target.value);
                            }}
                          >
                            <option value="4">Cricket</option>
                            <option value="1">Soccer</option>
                            <option value="2">Tennis</option>
                          </Form.Select>
                        </div>
                      </Col>
                      <Col lg={2} sm={6} className="mb-3">
                        <div className="bet-sec">
                          <Form.Label className="pe-1">
                            Select Match:
                          </Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            onChange={(e) => {
                              handleMatch(e.target.value);
                            }}
                          >
                            <option>Select Match</option>

                            {matchData.length &&
                              matchData.map((matchList, index) => {
                                return (
                                  <option
                                    value={matchList.eventId}
                                    key={index + 1}
                                  >
                                    {matchList.eventName}
                                  </option>
                                );
                              })}
                          </Form.Select>
                        </div>
                      </Col>
                      <Col lg={2} md={4}>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            placeholder="Search By Fancy Name"
                            onChange={(e) => {
                              handleKeyword(e.target.value);
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={3} sm={6} className="mb-3">
                        <div className="bet-sec">
                          <Form.Label className="pe-1">
                            Select Fancy Status:
                          </Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            onChange={(e) => {
                              handleFancyStatus(e.target.value);
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                          </Form.Select>
                        </div>
                      </Col>
                      <Col lg={1} md={4} className="mb-3">
                        <Button
                          className="btn theme_dark_btn w-100"
                          onClick={() => {
                            handleSearch();
                          }}
                        >
                          Search
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>

              {/* show-fancy-table */}

              <div className="account-table batting-table mt-3">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Fancy Name</th>
                        <th scope="col"> SelectionId </th>
                        <th scope="col"> Action </th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {!isEmpty(fancyData) ? (
                        <>
                          {fancyData.length &&
                            fancyData.map((matchList, index) => {
                              return (
                                <tr key={index + 1}>
                                  <td>{matchList.fancyName}</td>
                                  <td>{matchList.selectionId}</td>

                                  <td>
                                    <Link
                                      className="btn"
                                      to={"/viewBets/" + matchList?.eventId}
                                    >
                                      View
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={9}>No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>

              {/* show-fancy-table */}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default FancyResult;
