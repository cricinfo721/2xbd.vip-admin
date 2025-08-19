import { isEmpty } from "lodash";
import React, { useContext, useState } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import obj from "../../utils/constants";
import DropDown from "./DropDown";
import helpers from "../../utils/helpers";
import AuthContext from "../../context/AuthContext";
import { FancyListDropdown } from "./FancyListDropdown";
import { Link } from "react-router-dom";

const FancyBetTypeListing = ({
  title,
  data,
  matchName,
  detailsData,
  getDetails,
  setEventId,
  matchData,
  eventId,
}) => {
  const [showMatch, setShowMatch] = useState(false);
  let { user } = useContext(AuthContext);
  const [selectData, setSelectData] = useState("");
  const [id, setId] = useState("");
  console.log("data", data);
  return (
    <div className="risk-management-table">
      <h2 className="common-heading">{title}</h2>
      <Container fluid>
        {/* <Row>
          <Col lg={9} sm={6} className="mb-3">
            <h4>Fancy Filter</h4>
          </Col>
        </Row> */}
        <Row>
          {/* <Col lg={3} sm={6} className="mb-3">
                          <div className="bet-sec">
                            <Form.Label className="pe-1">Sports</Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              value={search_params.eventType}
                              onChange={(e) => {
                                setSearchParams({
                                  ...search_params,
                                  eventType: e.target.value,
                                });
                                getMatchData(e.target.value);
                              }}
                            >
                              <option>Select Sports</option>
                              {obj.betCheckData.map((matchList, index) => {
                                return (
                                  <option value={matchList.label} key={index + 1}>
                                    {matchList.value}
                                  </option>
                                );
                              })}
                            </Form.Select>
                          </div>
                        </Col> */}
          <Col lg={3} sm={6} className="mb-3">
            <div className="bet-sec">
              <Form.Label className="pe-1">Select Match</Form.Label>
              <Form.Select
                aria-label="Default select example"
                value={eventId}
                onChange={(e) => {
                  setEventId(e.target.value);
                }}
              >
                <option>Select Match</option>
                {matchData.length &&
                  matchData.map((matchList, index) => {
                    return (
                      <option value={matchList.eventId} key={index + 1}>
                        {matchList.eventName} - {matchList.eventId}
                      </option>
                    );
                  })}
              </Form.Select>
            </div>
          </Col>

          <Col lg={3} md={4} className="mb-3">
            <div className="bet-sec">
              <Form.Label className="pe-1">Sports</Form.Label>
              <Form.Control
                type="text"
                value={eventId}
                onChange={(e) => {
                  setEventId(e.target.value);
                }}
                placeholder="Search By Event Id"
              />
            </div>
          </Col>
          <Col
            lg={3}
            md={4}
            className="mb-3"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-end",
            }}
          >
            <Button
              className="green-btn p-1 w-50"
              onClick={() => {
                getDetails();
              }}
            >
              Search
            </Button>
          </Col>
        </Row>
      </Container>

      <div className="account-table match-odd-table">
        <div className="responsive">
          <Table>
            <tbody>
              <tr>
                <td width="10%" rowSpan="2">
                  <strong> Sports</strong>
                </td>
                <td width="10%" rowSpan="2">
                  <strong> Market Date</strong>
                </td>
                <td rowSpan="2">
                  <strong>Event/Market Name</strong>
                </td>
                <td
                  width="21%"
                  className="text-center border-l bg-light-yellow"
                  colSpan="3"
                >
                  <strong>Player P/L</strong>
                </td>
                <td width="6%" rowSpan="2" className="text-center">
                  <strong> Downline P/L</strong>
                </td>
              </tr>
              <tr>
                <td width="7%" className="bg-light-yellow border-0">
                  <strong> Min</strong>
                </td>

                <td width="7%" className="bg-light-yellow border-0"></td>
                <td width="7%" className="bg-light-yellow border-0">
                  <strong>{"Max"}</strong>
                </td>
              </tr>
            </tbody>
            <tbody className="match-tbody">
              {isEmpty(data) && (
                <tr>
                  <td colSpan={7}>No Record Found</td>
                </tr>
              )}

              {data?.length > 0 &&
                data.map((res, index) => {
                  if (res?.jsonData?.length > 0) {
                    return (
                      <>
                        <tr key={index + 1}>
                          <td className="text-center">
                            <p>{detailsData?.gameType}</p>
                          </td>
                          <td className="text-center">
                            {helpers.dateFormat(
                              res.eventDateTime,
                              user.timeZone
                            )}{" "}
                          </td>
                          <td className="bg-yellow border-0">
                            <a>
                              <>
                                {index + 1 == id ? (
                                  <Button
                                    onClick={() => {
                                      setShowMatch(false);
                                      setSelectData("");
                                      setId("");
                                    }}
                                    className={"angle-up"}
                                  >
                                    <i className="fas fa-angle-up"></i>
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() => {
                                      setShowMatch(true);
                                      setId(index + 1);

                                      setSelectData(res);
                                    }}
                                    className={"angle-up down-up"}
                                  >
                                    <i className="fas fa-angle-up"></i>
                                  </Button>
                                )}
                              </>
                              <strong>{matchName}</strong>{" "}
                              <span className="ms-3">{res?.fancyName} </span>
                            </a>
                          </td>
                          <td className="border-0 bg-yellow">
                            <p className="text-danger">{res?.positions?.positionLoseAmount ? "(-" + res?.positions?.positionLoseAmount + ")" : 0}</p>
                          </td>

                          <td className="border-0 bg-yellow"></td>

                          <td className="border-0 bg-yellow">
                            <p className="text-success">{res?.positions?.positionProfitAmount ? res?.positions?.positionProfitAmount : 0}</p>
                          </td>
                          <td className="border-right-0 text-center">
                            <Link
                              to={`/DownlinePnl-Fancy/${res?.fancyName}/${res?.eventId}/${res?.marketId}/${res?.selectionId}`}
                              target="_blank"
                              className="yellow-btn"
                            >
                              {"Book"}
                            </Link>
                          </td>
                        </tr>

                        {index + 1 == id ? (
                          <FancyListDropdown
                            showMatch={showMatch}
                            data={res?.jsonData}
                            selectData={selectData}
                          />
                        ) : (
                          ""
                        )}
                      </>
                    );
                  }
                })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default FancyBetTypeListing;
