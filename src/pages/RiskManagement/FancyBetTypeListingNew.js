import { isEmpty } from "lodash";
import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import obj from "../../utils/constants";
import DropDown from "./DropDown";
import helpers from "../../utils/helpers";
import AuthContext from "../../context/AuthContext";
import { FancyListDropdown } from "./FancyListDropdown";
import { Link } from "react-router-dom";

const FancyBetTypeListingNew = ({
  title,
  data,
  socketOddsWork,
  getFancyData,
  fancyOdds,
  setFancyOddds,
}) => {
  const [showMatch, setShowMatch] = useState(false);
  let { user } = useContext(AuthContext);
  const [selectData, setSelectData] = useState([]);
  const [id, setId] = useState("");
  const [active, setActive] = useState({});
  useEffect(() => {
    if (showMatch && !isEmpty(active)) {
      let interval = setInterval(() => {
        getFancyData(active?.eventId, active?.selectionId);
      }, 10000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [showMatch, active]);

  return (
    <div className="risk-management-table">
      <h2 className="common-heading">{title}</h2>

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
                  return (
                    <>
                      <tr key={index + 1}>
                        <td className="text-center">
                          <p>{`${
                            res?.eventType === "4"
                              ? "Cricket"
                              : res?.eventType === "1"
                              ? "Soccer"
                              : res?.eventType === "2"
                              ? "Tennis"
                              : "Casino"
                          }`}</p>
                        </td>
                        <td className="text-center">
                          {helpers.dateFormat(res.timeInserted, user.timeZone)}{" "}
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
                                    socketOddsWork();
                                    setFancyOddds({});
                                    setActive({});
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
                                    setSelectData(res?.odds);
                                    socketOddsWork(
                                      res?.eventId,
                                      res?.selectionId
                                    );
                                    setActive({
                                      eventId: res?.eventId,
                                      selectionId: res?.selectionId,
                                    });
                                    getFancyData(
                                      res?.eventId,
                                      res?.selectionId
                                    );
                                  }}
                                  className={"angle-up down-up"}
                                >
                                  <i className="fas fa-angle-up"></i>
                                </Button>
                              )}
                            </>
                            <strong>{res?.matchName}</strong>{" "}
                            <span className="ms-3">{res?.fancyName} </span>
                          </a>
                        </td>
                        <td className="border-0 bg-yellow">
                          <p className="text-danger">
                            {res?.positionLoseAmount
                              ? "(-" + res?.positionLoseAmount + ")"
                              : 0}
                          </p>
                        </td>

                        <td className="border-0 bg-yellow"></td>

                        <td className="border-0 bg-yellow">
                          <p className="text-success">
                            {res?.positionProfitAmount
                              ? res?.positionProfitAmount
                              : 0}
                          </p>
                        </td>
                        <td className="border-right-0 text-center">
                          <Link
                            to={`/DownlinePnl-Fancy/${res?.fancyName}/${res?.eventId}/${res?.marketId}/${res?.selectionId}`}
                            target="_blank"
                            className="green-btn"
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
                          res={res}
                          title={title}
                          fancyOdds={
                            fancyOdds?.rt?.length > 0 &&
                            res?.selectionId == fancyOdds?.selectionId
                              ? fancyOdds?.rt
                              : []
                          }
                        />
                      ) : (
                        ""
                      )}
                    </>
                  );
                  //   }
                })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default FancyBetTypeListingNew;
