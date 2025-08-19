import React, { useState, useContext } from "react";
import { Button, Table } from "react-bootstrap";
import { FilterBar } from "../../components/FilterBar";
import helpers from "../../utils/helpers";
import AuthContext from "../../context/AuthContext";
import ReactPaginate from "react-paginate";
export const BettingHistoryTab = ({
  filter,
  setFilter,
  data,
  title,
  getData,
  betType,
  url,
  viewpage,
  handlePageClick,
  pageCount,
  redirectCasino,
}) => {
  let { user } = useContext(AuthContext);
  console.log("betType", betType);
  const [getProperty, setProperty] = useState("none");
  const showDetail = (event, id) => {
    const detailDiv = document.getElementById(id);

    if (detailDiv.style.display === "none") {
      detailDiv.style.setProperty("display", "contents");
      event.target.className = "fas fa-minus-square pe-2";
    } else {
      detailDiv.style.setProperty("display", "none");
      event.target.className = "fas fa-plus-square pe-2";
    }
  };

  return (
    <div className="common-container">
      {/* <FilterBar filter={filter} setFilter={setFilter} getData={getData} /> */}
      <div className="batting-content">
        <p>
          Betting History enables you to review the bets you have placed.
          Specify the time period during which your bets were placed, the type
          of markets on which the bets were placed, and the sport.
        </p>
        <p>Betting History is available online for the past 30 days.</p>
      </div>
      <div className="account-table batting-table profit_loss_table">
        <div className="responsive">
          {betType === "casino" ? (
            <Table>
              <thead>
                <tr>
                  <th scope="col">Bet ID</th>
                  <th scope="col"> PL ID</th>
                  <th scope="col">Market</th>
                  {/* <th scope="col">Selection</th> */}
                  {/* <th scope="col">Type</th> */}
                  <th scope="col">Bet Placed</th>
                  {/* <th scope="col">Odds Req.</th> */}
                  <th scope="col">Stake</th>
                  {/* <th scope="col">Avg. odds Matched</th> */}
                  <th scope="col">Profit / Loss</th>
                </tr>
              </thead>
              {data?.data && data?.data?.length > 0 ? (
                data?.data?.map((item, index) => {
                  // const resultTotalStake = item?.bets_list.reduce((a, v) => {
                  //   a = parseInt(a) + parseInt(v.amount);
                  //   return a;
                  // }, 0);

                  return (
                    <>
                      <tr
                        id="summary0"
                        style={{ display: "table-row" }}
                        key={index + 1}
                      >
                        <td>
                          {" "}
                          <i
                            id={"icon_" + item?.platformTxId}
                            className="fas fa-plus-square"
                            onClick={(e) => showDetail(e, item?.platformTxId)}
                          ></i>{" "}
                          {item?.platformTxId}
                        </td>
                        <td>{item?.clientName}</td>
                        <td id="title" className="align-L">
                          Casino
                          <span className="angle_unicode">▸</span>
                          <strong> {item?.casinoName}</strong>
                          <span className="angle_unicode">▸</span>
                          {item?.gameCode}
                        </td>
                        {/* <td>null</td> */}
                        {/* <td>back</td> */}
                        <td id="settledDate">
                          {" "}
                          {helpers.dateFormat(item.timeInserted, user.timeZone)}
                        </td>
                        {/* <td>0.00</td> */}
                        <td>{item?.betAmount}</td>
                        {/* <td>0.00</td> */}
                        <td>
                          {Math.sign(item?.playerPL) === -1 ? (
                            <span className="text-danger">
                              ({helpers.currencyFormat(item?.playerPL)})
                            </span>
                          ) : (
                            <span className="text-success">
                              (
                              {helpers.currencyFormat(Math.abs(item?.playerPL))}
                              )
                            </span>
                          )}
                        </td>
                      </tr>

                      <tr
                        className="expand"
                        id={item?.platformTxId}
                        style={{ display: getProperty }}
                      >
                        <td colSpan="7" className="expand_wrap">
                          <table className="table-commission">
                            <tbody>
                              <tr>
                                <th>Bet Taken</th>
                                <th>Odds Req.</th>
                                <th>Stake</th>
                                <th>Liability</th>
                                <th>Odds Matched</th>
                                <th>Action</th>
                              </tr>
                              <tr
                                id="txRow0"
                                style={{ display: "table-row" }}
                                className="even"
                              >
                                <td id="betID">
                                  {" "}
                                  {helpers.dateFormat(
                                    item.timeInserted,
                                    user.timeZone
                                  )}
                                </td>
                                <td>0.00</td>
                                <td>{item?.betAmount}</td>
                                <td>
                                  {item?.loseAmount ? item?.loseAmount : "-"}
                                </td>
                                <td>0.00</td>
                                <td>
                                  <Button
                                    className="theme_dark_btn"
                                    onClick={() =>
                                      redirectCasino(
                                        item?.clientName,
                                        item?.platform,
                                        item?.platformTxId,
                                        2
                                      )
                                    }
                                  >
                                    Get Result
                                  </Button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10}>
                    <span>You have no bets in this time period.</span>
                  </td>
                </tr>
              )}
            </Table>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th scope="col">PL ID</th>
                  <th scope="col"> Bet ID</th>
                  <th scope="col">Bet placed</th>
                  <th scope="col">IP Address </th>
                  <th scope="col">Market</th>
                  <th scope="col">Selection</th>
                  <th scope="col">Type</th>
                  <th scope="col">Odds req.</th>
                  <th scope="col">Stake </th>
                  <th scope="col">Profit/Loss </th>
                </tr>
              </thead>
              {data?.data && data?.data?.length > 0 ? (
                data?.data?.map((item) => {
                  return (
                    <tr>
                      <td>{item?.clientName || "-"}</td>
                      <td> {betType == "fancy" ? item?.sessionBetId : item?.matchBetId || "N/A"}</td>
                      <td> {helpers.dateFormat(
                        item?.timeInserted,
                        user.timeZone
                      )}</td>
                      <td> {(item?.ipAddress) && item?.ipAddress.replace("::ffff:","") || "N/A"}</td>
                      <td className="text-start">
                      {`${
                                      item?.eventType === "4"
                                        ? "Cricket"
                                        : item?.eventType === "1"
                                        ? "Soccer"
                                        : item?.eventType === "2"
                                        ? "Tennis"
                                        : "Casino"
                                    }`}
                        
                        <span className="angle_unicode">▸</span>
                        <strong>
                          {betType === "casino"
                            ? item?.casinoName
                            : item?.matchName}
                        </strong>
                        <span className="angle_unicode">▸</span>
                        {betType === "sportBook" && item?.fancyName}
                        {betType === "fancy" && item?.fancyName}{" "}
                        {betType === "casino" && item?.casinoType}{" "}
                         {betType === "toss" && "Toss"}{" "}
                        {betType === "tie" && "Tie"}{" "}
                      </td>
                      <td>
                        {betType === "fancy" ? item?.betRun + "/" + item?.bhav : (betType === "sportBook") ? item?.runnerName : item?.teamName}


                      </td>
                      <td> {betType == "fancy" ? item?.type : item?.betType || "N/A"} </td>
                      <td> {item?.bhav || "N/A"} </td>
                      <td> {item?.amount || "N/A"} </td>
                      {item?.status!=="voided" ?
                     
                        betType == "betfair" || betType == "Bookmaker" ||  betType === "toss" || betType === "tie" ? (
                          <td>
                            {(item?.teamSelectionWin == item?.selectionId &&
                              item?.betType == "back") ||
                              (item?.teamSelectionWin != item?.selectionId &&
                                item?.betType == "lay") ? (
                              <span className="text-success">
                                {item?.profitAmount}
                              </span>
                            ) : (
                              <span className="text-danger">
                                -({item?.loseAmount})
                              </span>
                            )}
                          </td>
                        ) : betType === "sportBook" ? (
                          <td>
                            {item?.teamSelectionWin && item?.teamSelectionWin.split(',').includes(item?.fancySelectionId) ? (
                              <span className="text-success">
                                {item?.profitAmount}
                              </span>
                            ) : (
                              <span className="text-danger">
                                -({item?.loseAmount})
                              </span>
                            )}
                          </td>
                        ) : (
                          <td>
                            {item?.type == "No" ? (
                              item?.decisionRun < item?.betRun ? (
                                <span className="text-success">
                                  {item?.profitAmount}
                                </span>
                              ) : (
                                <span className="text-danger">
                                  -({item?.loseAmount})
                                </span>
                              )
                            ) : item?.decisionRun >= item?.betRun ? (
                              <span className="text-success">
                                {item?.profitAmount}
                              </span>
                            ) : (
                              <span className="text-danger">
                                -({item?.loseAmount})
                              </span>
                            )}
                          </td>
                        )
                       
                      : <td>0.00</td>}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10}>
                    <span>You have no bets in this time period.</span>
                  </td>
                </tr>
              )}
            </Table>
          )}

          <div className="bottom-pagination">
            <ReactPaginate
              breakLabel="..."
              nextLabel=" >"
              forcePage={viewpage}
              onPageChange={handlePageClick}
              pageRangeDisplayed={10}
              pageCount={pageCount}
              previousLabel="< "
              renderOnZeroPageCount={null}
              activeClassName="p-1"
              activeLinkClassName="pagintion-li"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
