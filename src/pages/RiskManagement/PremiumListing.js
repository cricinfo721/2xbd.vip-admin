import { isEmpty } from "lodash";
import React, { useContext, useState } from "react";
import { Button, Table } from "react-bootstrap";
import obj from "../../utils/constants";
import DropDown from "./DropDown";
import helpers from "../../utils/helpers";
import AuthContext from "../../context/AuthContext";
import { FancyListDropdown } from "./FancyListDropdown";
import { Link } from "react-router-dom";

const FancyBetTypeListing = ({ title, data }) => {
  const [showMatch, setShowMatch] = useState(false);
  let { user } = useContext(AuthContext);
  const [selectData, setSelectData] = useState("");
  const [id, setId] = useState("");
  //  console.log("data----ore", title);
  return (
    <div className="risk-management-table">
      <h2 className="common-heading">{title}</h2>

      {/* {data.some((res) => res?.jsonData?.length > 0) && ( */}
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
            </tbody>
            <tbody className="match-tbody">
              {data?.length > 0 &&
                data.map((res, index) => {
                    return (
                      <>
                        <tr>
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
                            {helpers.dateFormat(
                              res.timeInserted,
                              user.timeZone
                            )}{" "}
                          </td>
                          <td className="bg-yellow border-0">
                            <a>
                              <strong>{res?.matchName}</strong>{" "}
                              <span className="ms-3">{res?.fancyName} </span>
                            </a>
                          </td>
                          <td className="border-0 bg-yellow">
                            <p className="text-danger">{res?.positionLoseAmount ? "(-" + res?.positionLoseAmount + ")" : 0}</p>
                          </td>

                          <td className="border-0 bg-yellow"></td>

                          <td className="border-0 bg-yellow">
                            <p className="text-success">{res?.positionProfitAmount ? res?.positionProfitAmount : 0}</p>
                          </td>
                          <td className="border-right-0 text-center">
                            <Link
                              to={`/DownlinePnl-sport-premium/${res?.eventId}/${res?.selectionId}/${res?.marketId}/${user?.userType}/${user?._id}`}
                              target="_blank"
                              className="green-btn"
                            >
                              {"Book"}
                            </Link>
                          </td>
                        </tr>

                        {/* {index + 1 == id ? (
                          <FancyListDropdown
                            showMatch={showMatch}
                            data={res?.jsonData}
                            selectData={selectData}
                          />
                        ) : (
                          ""
                        )} */}
                      </>
                    );
                })}
            </tbody>
          </Table>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default FancyBetTypeListing;
