import React, { useState, useContext } from "react";
import { Button, Table } from "react-bootstrap";
import { FilterBar } from "../../components/FilterBar";
import helpers from "../../utils/helpers";
import AuthContext from "../../context/AuthContext";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

export const BettingProfitLossTab = ({
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
  redirectCasino,comission
}) => {
  let { user } = useContext(AuthContext);

  const [getProperty, setProperty] = useState("none");
  const showDetail = (event, id) => {
    const detailDiv = document.getElementById(id);
    if(detailDiv){
      if (detailDiv?.style?.display === "none") {
        detailDiv.style.setProperty("display", "contents");
        event.target.className = "fas fa-minus-square pe-2";
      } else {
        detailDiv.style.setProperty("display", "none");
        event.target.className = "fas fa-plus-square pe-2";
      }
    }
    
  };

  return (
    <div className="common-container">
      <FilterBar filter={filter} setFilter={setFilter} getData={getData} />
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
                  <th scope="col">Market</th>
                  <th scope="col">Profit / Loss</th>
                </tr>
              </thead>
              {data?.data && data?.data?.length > 0 ? (
                data?.data?.map((item, index) => {
                  // const resultTotalStake = item?.bets_list.reduce((a, v) => {
                  //   a = parseFloat(a) + parseFloat(v.amount);
                  //   return a;
                  // }, 0);

                  return (
                    <>
                      <tr
                        id="summary0"
                        style={{ display: "table-row" }}
                        key={index + 1}
                      >
                        <td id="title" className="align-L">
                          Casino
                          <span className="angle_unicode">▸</span>
                          <strong> {item?.casinoName}</strong>
                          <span className="angle_unicode">▸</span>
                          {helpers.dateFormat(item.timeInserted, user.timeZone)}
                        </td>
                        <td>
                        {item?.casinoName==="Auto-Roulette 1" ?
                          <>
                           {Math.sign(item?.transactions?.realCutAmount) === -1 ? (
                            <span className="text-danger">
                              ({helpers.currencyFormat(item?.transactions?.realCutAmount)})
                            </span>
                          ) : (
                            <span className="text-success">
                              (
                              {helpers.currencyFormat(Math.abs(item?.transactions?.realCutAmount))}
                              )
                            </span>
                          )}</>
                          :
                          Math.sign(item?.playerPL) === -1 ? (
                            
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
                          
                          <i
                            id={"icon_" + item?.platformTxId}
                            className="fas fa-plus-square"
                            onClick={(e) => showDetail(e, item?.platformTxId)}
                          ></i>
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
                                <th>Platform</th>
                                <th>Valid Turnover</th>
                                <th>Win/Loss</th>
                                <th>PT/Comm.</th>
                                <th>Profit / Loss</th>
                                <th>Action</th>
                              </tr>
                              <tr
                                id="txRow0"
                                style={{ display: "table-row" }}
                                className="even"
                              >
                                <td id="betID">
                                  <Button
                                    className="theme_dark_btn"
                                    onClick={() =>
                                      redirectCasino(
                                        item?.clientName,
                                        item?.platform,
                                        item?.platformTxId,
                                        1
                                      )
                                    }
                                  >
                                    {item.platform}
                                  </Button>
                                </td>
                                <td>0.00</td>
                                <td>{item?.playerPL}</td>
                                <td>0.00</td>
                                <td>{item?.playerPL}</td>
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
                              <tr className="casino-grand-total">
                                <td>Grand Total</td>
                                <td id="totalTurnover">0.00</td>
                                <td id="totalPayout">{item?.playerPL}</td>
                                <td id="totalTaxRebate">0.00</td>
                                <td id="totalBalance">{item?.playerPL}</td>
                                <td></td>
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
                  <th scope="col">Market</th>
                  <th scope="col"> Settled Date</th>
                  <th scope="col">Profit / Loss</th>
                </tr>
              </thead>

              {data?.data && data?.data?.length > 0 ? (
                data?.data?.map((item, index) => {
                  const resultTotalStake = item?.bets_list?.reduce((a, v) => {
                    a = parseFloat(a) + parseFloat(v.amount);
                    return a;
                  }, 0);
                  const backTotalProfitAmount = item?.bets_list?.reduce(
                    (a, v) => {
                      if (
                        v?.betType === "back" &&
                        v?.teamSelectionWin === v?.selectionId
                      ) {
                        a = parseFloat(a) + parseFloat(v.profitAmount);
                      }
                      return a;
                    },
                    0
                  );
                  
                  const backTotalLoseAmount = item?.bets_list?.reduce(
                    (a, v) => {
                      if (
                        v?.betType === "back" &&
                        v?.teamSelectionWin !== v?.selectionId
                      ) {
                        a = parseFloat(a) + parseFloat(v.loseAmount);
                      }
                      return a;
                    },
                    0
                  );
                  let backSubTotalresult =
                    backTotalProfitAmount > backTotalLoseAmount
                      ? backTotalProfitAmount - backTotalLoseAmount
                      : -(backTotalLoseAmount - backTotalProfitAmount);
                  const layTotalProfitAmount = item?.bets_list?.reduce(
                    (a, v) => {
                      if (
                        v?.betType === "lay" &&
                        v?.teamSelectionWin !== v?.selectionId
                      ) {
                        a = parseFloat(a) + parseFloat(v.profitAmount);
                      }
                      return a;
                    },
                    0
                  );
                  const layTotalLoseAmount = item?.bets_list?.reduce((a, v) => {
                    if (
                      v?.betType === "lay" &&
                      v?.teamSelectionWin === v?.selectionId
                    ) {
                      a = parseFloat(a) + parseFloat(v.loseAmount);
                    }
                    return a;
                  }, 0);
                  let laySubTotalresult =
                    layTotalProfitAmount > layTotalLoseAmount
                      ? layTotalProfitAmount - layTotalLoseAmount
                      : -(layTotalLoseAmount - layTotalProfitAmount);
                     
                  let marketSubTotal = backSubTotalresult + laySubTotalresult;
                  const yesTotalProfitAmount = item?.bets_list?.reduce(
                    (a, v) => {
                      if (v?.type == "Yes" && v?.decisionRun >= v?.betRun) {
                        a = parseFloat(a) + parseFloat(v.profitAmount);
                      }
                      return a;
                    },
                    0
                  );
                  

                  const yesTotalLoseAmount = item?.bets_list?.reduce((a, v) => {
                    if (v?.type == "Yes" && v?.decisionRun < v?.betRun) {
                      a = parseFloat(a) + parseFloat(v.loseAmount);
                    }
                    return a;
                  }, 0);
                  let yesSubTotalresult =
                    yesTotalProfitAmount > yesTotalLoseAmount
                      ? yesTotalProfitAmount - yesTotalLoseAmount
                      : -(yesTotalLoseAmount - yesTotalProfitAmount);
                  const noTotalProfitAmount = item?.bets_list?.reduce(
                    (a, v) => {
                      if (v?.type == "No" && v?.decisionRun < v?.betRun) {
                        a = parseFloat(a) + parseFloat(v.profitAmount);
                      }
                      return a;
                    },
                    0
                  );
                  const noTotalLoseAmount = item?.bets_list?.reduce((a, v) => {
                    if (v?.type == "No" && v?.decisionRun >= v?.betRun) {
                      a = parseFloat(a) + parseFloat(v.loseAmount);
                    }
                    return a;
                  }, 0);
                  let noSubTotalresult =
                    noTotalProfitAmount > noTotalLoseAmount
                      ? noTotalProfitAmount - noTotalLoseAmount
                      : -(noTotalLoseAmount - noTotalProfitAmount);
                  const resultCommission = item?.bets_list?.reduce((a, v) => {
                    a = parseFloat(a) + parseFloat(v.commission ? v.commission : 0);
                    return a;
                  }, 0);

                  let fancyMarketSubTotal =
                    yesSubTotalresult + noSubTotalresult;

                  let fancyNetAmount =fancyMarketSubTotal;
                  let netAmount=0
                  if(betType=="toss" || betType=="tie" ){
                     netAmount =
                    marketSubTotal;
                  }else{ netAmount =
                    marketSubTotal - (marketSubTotal * comission) / 100;}

                  
                    
                    
                  return (
                    <>
                      <tr
                        id="summary0"
                        style={{ display: "table-row" }}
                        key={index + 1}
                      >
                        {/* <td id="title" className="align-L">
                          {item?.gameType}
                          <span className="angle_unicode">▸</span>
                          <strong> {item?.eventName}</strong>
                          <span className="angle_unicode">▸</span>
                          Match Odds
                        </td> */}
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
                            :  item?.matchName?item?.matchName:item?.eventName}
                        </strong>
                        <span className="angle_unicode">▸</span>
                        {betType === "sportBook" && item?.fancyName}
                        {betType === "fancy" && item?.fancyName}{" "}
                        {betType === "casino" && item?.casinoType}{" "}
                        {betType === "toss" && "Toss"}{" "}
                        {betType === "tie" && "Tie"}{" "}
                      </td>

                        <td id="settledDate">
                          {" "}
                          {helpers.dateFormat(
                            item.eventDateTime,
                            user.timeZone
                          )}
                        </td>
                        <td>
                          <a id="pl0" className="expand-open" href="#">
                            {betType == "fancy" ? (
                              fancyNetAmount > 0 ? (
                                Math.abs(fancyNetAmount)
                              ) : (
                                <span className="red">
                                  (-{Math.abs(fancyNetAmount)})
                                </span>
                              )

                            ) : netAmount > 0 ? (
                              helpers.truncateDecimals(netAmount,2)
                            ) : (
                              <span className="red">
                                (-{Math.abs(helpers.truncateDecimals(netAmount,2))})
                              </span>
                            )}
                          </a>
                          <i
                            id={"icon_" + item?._id}
                            className="fas fa-plus-square"
                            onClick={(e) => showDetail(e, item?._id)}
                          ></i>
                        </td>
                      </tr>
                      {item?.bets_list?.length > 0 && (
                        <tr
                          className="expand"
                          id={item?._id}
                          style={{ display: getProperty }}
                          key={item?._id}
                        >
                          <td colSpan="4" className="expand_wrap">
                            <table className="table-commission">
                              <tbody>
                                <tr>
                                  <th>User Name</th>
                                  <th>Bet ID</th>
                                  <th>Selection</th>
                                  <th>Odds</th>
                                  <th>Stake</th>
                                  <th>Type</th>
                                  <th>Placed</th>
                                  <th>Profit/Loss</th>
                                </tr>
                                {item?.bets_list?.map((betData, i) => {
                                  return (
                                    <tr
                                      id="txRow0"
                                      style={{ display: "table-row" }}
                                      className="even"
                                      key={i + 1}
                                    >
                                      <td id="betID">{betData?.clientName}</td>
                                      <td id="betID">
                                        {betType == "fancy"
                                          ? betData?.sessionBetId
                                          : betData?.matchBetId}
                                      </td>
                                      <td id="matchSelection">
                                        {betType == "fancy"
                                          ? betData?.fancyName
                                          : betData?.teamName}
                                      </td>
                                      <td id="txOddsMatched">
                                        {betType == "fancy"
                                          ? betData?.betRun +
                                          "/" +
                                          betData?.bhav
                                          : betData?.bhav}

                                        { }
                                      </td>
                                      <td id="txStake"> {betData?.amount}</td>
                                      <td>
                                        {betType == "fancy" ? (
                                          <span
                                            id="matchType"
                                            className={
                                              betData?.type === "No"
                                                ? "lay"
                                                : "back"
                                            }
                                          >
                                            {betData?.type}
                                          </span>
                                        ) : (
                                          <span
                                            id="matchType"
                                            className={
                                              betData?.betType === "lay"
                                                ? "lay"
                                                : "back"
                                            }
                                          >
                                            {betData?.betType}
                                          </span>
                                        )}
                                      </td>
                                      <td id="placed">
                                        {" "}
                                        {helpers.dateFormat(
                                          betData?.createdAt,
                                          user.timeZone
                                        )}
                                      </td>
                                      {betType == "fancy" ? (
                                        <td id="txLiability">
                                          {betData?.type == "No" ? (
                                            betData?.decisionRun <
                                              betData?.betRun ? (
                                              <span>
                                                {helpers.truncateDecimals(betData?.profitAmount,2)}
                                              </span>
                                            ) : (
                                              <span className="red">
                                                (-{helpers.truncateDecimals(betData?.loseAmount,2)})
                                              </span>
                                            )
                                          ) : betData?.decisionRun >=
                                            betData?.betRun ? (
                                            <span>{helpers.truncateDecimals(betData?.profitAmount,2)}</span>
                                          ) : (
                                            <span className="red">
                                              (-{helpers.truncateDecimals(betData?.loseAmount,2)})
                                            </span>
                                          )}
                                        </td>
                                      ) : (betData?.teamSelectionWin ==
                                        betData?.selectionId &&
                                        betData?.betType == "back") ||
                                        (betData?.teamSelectionWin !=
                                          betData?.selectionId &&
                                          betData?.betType == "lay") ? (
                                        <td id="txLiability">
                                          {helpers.truncateDecimals(betData?.profitAmount,2)}
                                        </td>
                                      ) : (
                                        <td id="txLiability">
                                          <span className="red">
                                            (-{helpers.truncateDecimals(betData?.loseAmount,2)})
                                          </span>
                                        </td>
                                      )}
                                    </tr>
                                  );
                                })}

                                <tr className="sum-pl">
                                  <td colSpan="8">
                                    <dl>
                                      <dt>Total Stakes</dt>
                                      <dd id="totalStakes">
                                        {resultTotalStake}
                                      </dd>
                                      {betType == "fancy" ? (
                                        <>
                                          <dt id="backSubTotalTitle">
                                            Yes subtotal
                                          </dt>
                                          <dd id="backSubTotal">
                                            {" "}
                                            {yesSubTotalresult ? (
                                              yesTotalProfitAmount >
                                                yesTotalLoseAmount ? (
                                                Math.abs(helpers.truncateDecimals(yesSubTotalresult,2))
                                              ) : (
                                                <span className="red">
                                                  (-{" "}
                                                  {Math.abs(helpers.truncateDecimals(yesSubTotalresult,2))})
                                                </span>
                                              )
                                            ) : (
                                              Math.abs(helpers.truncateDecimals(yesSubTotalresult,2))
                                            )}
                                          </dd>

                                          <dt id="laySubTotalTitle">
                                            No subtotal
                                          </dt>
                                          <dd id="laySubTotal">
                                            {noSubTotalresult ? (
                                              noTotalProfitAmount >
                                                noTotalLoseAmount ? (
                                                Math.abs(helpers.truncateDecimals(noSubTotalresult,2))
                                              ) : (
                                                <span className="red">
                                                  (-{" "}
                                                  {Math.abs(helpers.truncateDecimals(noSubTotalresult,2))})
                                                </span>
                                              )
                                            ) : (
                                              Math.abs(helpers.truncateDecimals(noSubTotalresult,2))
                                            )}
                                          </dd>
                                        </>
                                      ) : (
                                        <>
                                          <dt id="backSubTotalTitle">
                                            Back subtotal
                                          </dt>
                                          <dd id="backSubTotal">
                                            {" "}
                                            {backSubTotalresult ? (
                                              backTotalProfitAmount >
                                                backTotalLoseAmount ? (
                                                Math.abs(helpers.truncateDecimals(backSubTotalresult,2))
                                              ) : (
                                                <span className="red">
                                                  (-{" "}
                                                  {Math.abs(helpers.truncateDecimals(backSubTotalresult,2))}
                                                  )
                                                </span>
                                              )
                                            ) : (
                                              Math.abs(helpers.truncateDecimals(backSubTotalresult,2))
                                            )}
                                          </dd>

                                          <dt id="laySubTotalTitle">
                                            Lay subtotal
                                          </dt>
                                          <dd id="laySubTotal">
                                            {" "}
                                            {layTotalProfitAmount >
                                              layTotalLoseAmount ? (
                                              Math.abs(helpers.truncateDecimals(laySubTotalresult,2))
                                            ) : (
                                              <span className="red">
                                                (-{Math.abs(helpers.truncateDecimals(laySubTotalresult,2))})
                                              </span>
                                            )}
                                          </dd>
                                        </>
                                      )}

                                      <dt>Market subtotal</dt>

                                      {betType == "fancy" ? (
                                        <dd id="marketTotal">
                                          {yesTotalProfitAmount >
                                            yesTotalLoseAmount ||
                                            noTotalProfitAmount >
                                            noTotalLoseAmount ? (
                                            Math.abs(helpers.truncateDecimals(fancyMarketSubTotal,2))
                                          ) : (
                                            <span className="red">
                                              (-{Math.abs(helpers.truncateDecimals(fancyMarketSubTotal,2))})
                                            </span>
                                          )}
                                        </dd>
                                      ) : (
                                        <>
                                          {/* <dd id="marketTotal">
                                            {backTotalProfitAmount >
                                              backTotalLoseAmount ||
                                            layTotalProfitAmount >
                                              layTotalLoseAmount ? (
                                              Math.abs(marketSubTotal)
                                            ) : (
                                              <span className="red">
                                                (-{Math.abs(marketSubTotal)})
                                              </span>
                                            )}
                                          </dd> */}
                                          <dd id="marketTotal">
                                            {marketSubTotal > 0 ? (
                                              Math.abs(helpers.truncateDecimals(marketSubTotal,2))
                                            ) : (
                                              <span className="red">
                                                (-{Math.abs(helpers.truncateDecimals(marketSubTotal,2))})
                                              </span>
                                            )}
                                          </dd>
                                        </>
                                      )}
                                    {betType != "fancy" &&
                                    <>
                                      <dt
                                        id="commissionTitle"
                                        style={{ display: "block" }}
                                      >
                                        Commission
                                      </dt>
                                      <dd
                                        id="commission"
                                        style={{ display: "block" }}
                                      >
                                        {betType == "fancy"
                                          ? fancyMarketSubTotal > 0
                                            ? (fancyMarketSubTotal *
                                              comission) /
                                            100
                                            : 0
                                          : marketSubTotal > 0
                                            ? (marketSubTotal * comission) / 100
                                            : 0}
                                            
                                      </dd></>}

                                      <dt className="net_total">
                                        Net Market Total
                                      </dt>
                                      {betType == "fancy" ? (
                                        <dd id="netTotal" className="net_total">
                                          {fancyNetAmount > 0 ? (
                                            fancyNetAmount
                                          ) : (
                                            <span className="red">
                                              (-{Math.abs(helpers.truncateDecimals(fancyNetAmount,2))})
                                            </span>
                                          )}
                                        </dd>
                                      ) : (
                                        <>
                                          <dd
                                            id="netTotal"
                                            className="net_total"
                                          >
                                            {netAmount > 0 ? (
                                              helpers.truncateDecimals(netAmount,2)
                                            ) : (
                                              <span className="red">
                                                (-{Math.abs(helpers.truncateDecimals(netAmount,2))})
                                              </span>
                                            )}
                                          </dd>
                                        </>
                                      )}
                                    </dl>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
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
