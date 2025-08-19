import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import obj from "../utils/constants";
import helpers from "../utils/helpers";
import Sidebar from "../components/Sidebar";
import Breadcrumbs from "./Users/Breadcrumbs";

const InternationalCasionBets = () => {
  const [data, setData] = useState([]);
  const params = useParams();
//   console.log('type', params)
  const getData = async (type) => {
    // console.log('type', type)
    const { status, data: response_users } = await apiGet(
      apiPath.getInternationalCasinoBets,
      type
    );
    if (status === 200) {
      if (response_users.success) {
        setData(response_users.results);
      }
    }
  };

  useEffect(() => {
    getData({userId:params?.id});
  }, []);

  // console.log("getBetType", getBetType);
  return (
    <div>
      <section className="main-inner-outer py-4">
        
        <Container fluid>
            <Breadcrumbs user_id={params?.id} />
            <div className="accout_cols_outer">
                <div className="left_side">
                <Sidebar />
                </div>
                <div className="right_side">
                    <div className="db-sec d-flex justify-content-between align-items-center mb-2">
                        <h2 className="common-heading">
                            Casino Transactions
                        </h2>
                        {/* <Button className="green-btn" onClick={() => window.close()}>
                        Close
                        </Button> */}
                    </div>
                    <div className="find-member-sec">
                        <div className="account-table">
                        <div className="responsive">
                            <Table className="banking_detail_table">
                            <thead>
                                <tr>
                                <th scope="col">Casino Bet Id</th>
                                <th scope="col">Client</th>
                                <th scope="col">Casino Name</th>
                                <th scope="col">Stake</th>
                                <th scope="col">Place Time</th>
                                <th scope="col">Profit/Loss</th>
                                </tr>
                            </thead>
                            {data && data?.length > 0 ? (
                                    data?.map((item) => {
                                        let gameName;
                                        if(item?.gameCode !="1006")
                                        {
                                            const jdata = JSON.parse(item?.gameInfo);
                                            gameName = jdata?.gameName;
                                        }else{
                                            gameName = item?.gameInfo;
                                        }
                                        return (
                                            <tr>
                                                <td>{item?.casinoBetId || "N/A"}</td>
                                                <td> {item?.clientName || "N/A"}</td>
                                                <td> {`${item?.platform} | ${gameName}` || "N/A"}</td>
                                                <td> {item?.betAmount || "N/A"}</td>
                                                <td> {item?.timeInserted || "N/A"} </td>
                                                <td>
                                                    {item?.realCutAmount>0? (
                                                    <span className="text-success">
                                                        {helpers.currencyFormat(item?.realCutAmount)}
                                                    </span>
                                                    ) : (
                                                    <span className="text-danger">
                                                        {"(" +
                                                        helpers.currencyFormat(item?.realCutAmount) +
                                                        ")"}
                                                    </span>
                                                    )}
                                                </td>
                                                
                                            </tr>
                                        )})
                                    ) : (
                                        <tr>
                                        <td colSpan={10}>
                                            <span>You have no bets in this time period.</span>
                                        </td>
                                        </tr>
                                    )}
                            </Table>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
      </section>
    </div>
  );
};

export default InternationalCasionBets;