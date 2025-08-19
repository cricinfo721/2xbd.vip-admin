import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import constants from "../../utils/constants";
import { useEffect } from "react";
import obj from "../../utils/constants";
import { isEmpty } from "lodash";
import helpers from "../../utils/helpers";
const FancyBetDialog = () => {
  const { name, eventid, marketId, selectionId } = useParams();
  const [matchData, setMatchData] = useState([]);
  const [detailsData, setDetailsData] = useState([]);
  const [search_params, setSearchParams] = useState({
    eventId: eventid,
    selectionId: selectionId,
    marketId: marketId,
  });

  const getDetails = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.fancyPosition,
      search_params
    );
    if (status === 200) {
      if (response_users.success) {
        if (response_users.results) {
          setDetailsData(response_users.results);
        }
      }
    }
  };
  useEffect(() => {
    getDetails();
  }, [search_params]);
  return (
    <section className="main-inner-outer py-4">
      <section className="account-table">
        <div className="container-fluid">
          <div className="db-sec d-flex justify-content-between align-items-center mb-2">
            <h2 className="common-heading">{name} ( Fancy Bets )</h2>
            <Button className="green-btn" onClick={() => window.close()}>
              Close
            </Button>
          </div>
          <div className="responsive">
            <h2 className="common-heading">Run Position</h2>
            <Table>
              <thead>
                <tr>
                  <th scope="col">Run</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                {detailsData.length > 0 &&
                  detailsData.map((res, index) => {
                    return (
                      <>
                        <tr>
                          
                          <td style={res.position>=0?{ background: "#cde8fd"}:{ background: "#fae5eb"}}>
                            {res.betRun}
                          </td>
                          <td
                            style={res.position>=0?{ background: "#cde8fd"}:{ background: "#fae5eb", color: "#d0021b" }}>
                            {res.position>=0?`${helpers.currencyFormat(res.position)}`:`(${helpers.currencyFormat(res.position)})`}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                {isEmpty(detailsData) ? (
                  <tr>
                    <td colSpan={9}>No records found</td>
                  </tr>
                ) : null}
              </tbody>
            </Table>
          </div>
        </div>
      </section>
    </section>
  );
};

export default FancyBetDialog;
