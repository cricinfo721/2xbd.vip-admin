import { isEmpty } from "lodash";
import React, { useContext, useState } from "react";
import { Button, Table } from "react-bootstrap";
import obj from "../../utils/constants";
import DropDown from "./DropDown";
import helpers from "../../utils/helpers";
import AuthContext from "../../context/AuthContext";
import { FancyListDropdown } from "./FancyListDropdown";
import { Link } from "react-router-dom";
const BetTypeListing = ({ title, data,socketOddsWork }) => {
  const [showMatch, setShowMatch] = useState(false);
  let { user } = useContext(AuthContext);
  const [selectData, setSelectData] = useState("");
  const [id, setId] = useState("");
  //console.log("bookmakerData",data)

  return (
    <div className="risk-management-table">
      <h2 className="common-heading">{title}</h2>

      {/* {data.some((res) =>
        title == "Book Maker"
          ? res?.bookmakerRunners?.length == 3
          : res?.runners?.length == 3
      )} */}
      
      {data.some((res) =>
        title == "Book Maker"
          ? res?.bookmakerRunners?.length == 3
          : res?.runners?.length == 3
      ) && (
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
                    <strong>{title == "Fancy Bet" ? "Min" : "1"}</strong>
                  </td>

                  <td width="7%" className="bg-light-yellow border-0">
                    <strong>
                      {title == "Fancy Bet" ||
                      (data.length == 2 && title == "Match Odds")
                        ? ""
                        : "X"}
                    </strong>
                  </td>
                  <td width="7%" className="bg-light-yellow border-0">
                    <strong>{title == "Fancy Bet" ? "Max" : "2"}</strong>
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
                    if (
                      title == "Book Maker"
                        ? res?.bookmakerRunners?.length == 3
                        : res?.runners?.length == 3
                    ) {
                      
                      return (
                        <>
                          <tr key={index + 1}>
                            <td className="text-center">
                              <p>{res.gameType}</p>
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
                                        socketOddsWork(res?.eventId);
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
                                        socketOddsWork(res?.eventId);
                                      }}
                                      className={"angle-up down-up"}
                                    >
                                      <i className="fas fa-angle-up"></i>
                                    </Button>
                                  )}
                                </>
                                <strong>{res.eventName}</strong>{" "}
                                <span className="ms-3">{title} </span>
                              </a>
                            </td>

                            {res?.runners?.length>0 && res?.runners?.map((item,index) => {
                             let position=res?.position?.find(
                              (res) => res?.selectionId == item?.SelectionId
                            )?.position
                             return ( 
                              <>
                              <td className="border-0 bg-yellow">
                              <p
                                className={
                                  Math.sign(position) == -1
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                (
                                {Math.sign(position) == -1
                                  ? ""
                                  : "-"}{" "}
                                {Math.abs(position).toFixed(2)})
                              </p>
                            </td>
                            
                            </>
                            )
                            })}

                          {res?.bookmakerRunners?.length>0 && res?.bookmakerRunners?.map((item,index) => {
                             let position=res?.position?.find(
                              (res) => res?.selectionId == item?.selectionID
                            )?.position
                             return ( 
                              <>
                              <td className="border-0 bg-yellow">
                              <p
                                className={
                                  Math.sign(position) == -1
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                (
                                {Math.sign(position) == -1
                                  ? ""
                                  : "-"}{" "}
                                {position && position!==0?Math.abs(position).toFixed(2):0})
                              </p>
                            </td>
                            {index==0&&<td className="border-0 bg-yellow"></td>}
                            </>
                            )
                            })}
                            
                            {/* <td className="border-0 bg-yellow">
                              <p
                                className={
                                  Math.sign(res.position[0].position) == -1
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                (
                                {Math.sign(res.position[0].position) == -1
                                  ? ""
                                  : "-"}{" "}
                                {Math.abs(res.position[0].position || 0.0).toFixed(2)})
                              </p>
                            </td>

                            <td className="border-0 bg-yellow">
                              <p
                                className={
                                  Math.sign(res?.position[2]?.position) == -1
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                (
                                {Math.sign(res?.position[2]?.position) == -1
                                  ? ""
                                  : "-"}
                                {Math.abs(res?.position[2]?.position || 0.0).toFixed(
                                  2
                                )}
                                )
                              </p>
                            </td>

                            <td className="border-0 bg-yellow">
                              <p
                                className={
                                  Math.sign(res?.position[1]?.position) == -1
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                ({" "}
                                {Math.sign(res?.position[1]?.position) == -1
                                  ? ""
                                  : "-"}
                                {Math.abs(res?.position[1]?.position).toFixed(
                                  2
                                )}
                                )
                              </p>
                            </td> */}


                            <td className="border-right-0 text-center">
                              <Link
                                to={
                                  title == "Fancy Bet"
                                    ? `/DownlinePnl-Fancy/${res?.fancyName}/${res?.eventId}/${res?.marketId}/${res?.selectionId}`
                                    : `/DownlinePnl/${user._id}/${user.userType}/${res?.eventId}/${title}`
                                }
                                target="_blank"
                                className="green-btn"
                              >
                                {title == "Fancy Bet" ? "Book" : "View"}
                              </Link>
                            </td>
                          </tr>
                         
                          {index + 1 == id ? (
                            <DropDown
                              showMatch={showMatch}
                              title={title}
                              layData={res.lay_odds || []}
                              data={
                                title == "Book Maker"
                                  ? res?.bookmakerRunners
                                  : res?.runners
                              }
                              backData={res.back_odds || []}
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
      )}

      {data.some((res) =>
        title == "Book Maker"
          ? res?.bookmakerRunners?.length == 2
          : res?.runners?.length == 2
      ) && (
        <div className="account-table match-odd-table ">
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
                  <td
                    width="7%"
                    className="text-center bg-light-yellow border-0"
                  >
                    <strong>{title == "Fancy Bet" ? "Min" : "1"}</strong>
                  </td>

                  <td
                    width="7%"
                    className="text-center bg-light-yellow border-0"
                  ></td>
                  <td
                    width="7%"
                    className="text-center bg-light-yellow border-0"
                  >
                    <strong>{title == "Fancy Bet" ? "Max" : "2"}</strong>
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
                    if (
                      title == "Book Maker"
                        ? res?.bookmakerRunners?.length == 2
                        : res?.runners?.length == 2
                    ) {
                      return (
                        <>
                          <tr key={index + 1}>
                            <td className="text-center">
                              <p>{res.gameType}</p>
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
                                        socketOddsWork(res?.eventId);
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
                                        socketOddsWork(res?.eventId);
                                        
                                      }}
                                      className={"angle-up down-up"}
                                    >
                                      <i className="fas fa-angle-up"></i>
                                    </Button>
                                  )}
                                </>
                                <strong>{res.eventName}</strong>{" "}
                                <span className="ms-3">{title} </span>
                              </a>
                            </td>
                            
                            {res?.runners?.length>0 && res?.runners?.map((item,index) => {
                             let position=res?.position?.find(
                              (res) => res?.selectionId == item?.SelectionId
                            )?.position
                             return ( 
                              <>
                              <td className="border-0 bg-yellow">
                              <p
                                className={
                                  Math.sign(position) == -1
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                (
                                {Math.sign(position) == -1
                                  ? ""
                                  : "-"}{" "}
                                {Math.abs(position).toFixed(2)})
                              </p>
                            </td>
                            {index==0&&<td className="border-0 bg-yellow"></td>}
                            </>
                            )
                            })}

                          {res?.bookmakerRunners?.length>0 && res?.bookmakerRunners?.map((item,index) => {
                             let position=res?.position?.find(
                              (res) => res?.selectionId == item?.selectionID
                            )?.position
                             return ( 
                              <>
                              <td className="border-0 bg-yellow">
                              <p
                                className={
                                  Math.sign(position) == -1
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                (
                                {Math.sign(position) == -1
                                  ? ""
                                  : "-"}{" "}
                                {position && position!==0?Math.abs(position).toFixed(2):0})
                              </p>
                            </td>
                            {index==0&&<td className="border-0 bg-yellow"></td>}
                            </>
                            )
                            })}
                            

                            <td className="border-right-0 text-center">
                              <Link
                                to={
                                  title == "Fancy Bet"
                                    ? `/DownlinePnl-Fancy/${res?.fancyName}/${res?.eventId}/${res?.marketId}/${res?.selectionId}`
                                    : `/DownlinePnl/${user._id}/${user.userType}/${res?.eventId}/${title}`
                                }
                                target="_blank"
                                className="green-btn"
                              >
                                {title == "Fancy Bet" ? "Book" : "View"}
                              </Link>
                            </td>
                          </tr>
                          {index + 1 == id ? (
                            <DropDown
                              showMatch={showMatch}
                              layData={res.lay_odds || []}
                              data={
                                title == "Book Maker"
                                  ? res?.bookmakerRunners
                                  : res?.runners
                              }
                              title={title}
                              backData={res.back_odds || []}
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
      )}
    </div>
  );
};

export default BetTypeListing;
