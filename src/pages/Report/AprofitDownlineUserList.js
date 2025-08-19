import { compact, isEmpty, startCase } from "lodash";
import React, { useEffect, useState } from "react";
import { Form, Table, Button, Modal } from "react-bootstrap";
import constants from "../../utils/constants";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useForm } from "react-hook-form";
import { apiPut, apiPost, apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import helpers from "../../utils/helpers";
import { toast } from "wc-toast";
import UpdateStatusUser from "../../components/UpdateStatusUser";

const AprofitDownlineUserList = (props) => {
  const [currentItems, setCurrentItems] = useState([]);
  const location = useLocation();
  const user_params = compact(location.pathname.split("/"));
  const [pageCount, setPageCount] = useState(0);
  const [changeReference, setChangeReference] = useState(false);
  const setChangeReferenceToggle = () => setChangeReference(!changeReference);
  const [getUpdateId, setUpdateId] = useState("");
  const [exposureData, setExposureData] = useState("");
  const [exposure, setExposure] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);
  const [userData, setUserData] = useState({});
  const [getActiveClass, setActiveClass] = useState("");
  const [currentStatus, setCurrentStatus] = useState("downline");

  useEffect(() => {
    setCurrentItems(props?.results || []);
    setPageCount(Math.ceil(props?.results?.totalPages) || 0);
  }, [props]);

  const showDetail = (event, id) => {
    const detailDiv = document.getElementById(id);
    console.log(detailDiv.style.display);
    if (detailDiv.style.display === "none") {
      detailDiv.style.setProperty("display", "block");
    } else {
      detailDiv.style.setProperty("display", "none");
    }
  };
  return (
    <>
      <section className="account-table">
        <div className="responsive transaction-history">
          <Table>
            <thead>
              <tr>
                <th scope="col">UID</th>
                <th scope="col">Stake</th>
                <th scope="col">Downline P/L</th>
                <th scope="col">Player P/L</th>
                <th scope="col">Comm.</th>
                <th scope="col">Upline/Total P/L</th>
              </tr>
            </thead>
            <tbody>
              <>
                {currentItems && currentItems?.length > 0 ? (
                  currentItems?.map((item) => {
                    return (
                      <>
                        <tr>
                          <td className="text-start">
                            {item?.userType == "user" ? (
                              <>
                                <i className="fas fa-plus-square pe-2"></i>
                                <a href={"#"} className="text-primary">
                                <span>
                                  {constants?.user_status[item?.userType || ""]}
                                </span>
                              </a>
                                {item?.username || null}
                              </>
                            ) : (
                              <>
                                <i
                                  className="fas fa-plus-square pe-2"
                                  onClick={(e) => showDetail(e, item?._id)}
                                ></i>
                                <Link
                                  to={`/AprofitDownline/${item._id}/${item?.userType}`}
                                >
                                  <a href={"#"} className="text-primary">
                                    <span>
                                      {constants?.user_status[item?.userType || ""]}
                                    </span>
                                  </a>
                                  {item?.username || null}
                                </Link>
                              </>
                            )}
                          </td>
                          <td>{constants.betCheckObj[item.eventType]}</td>
                          <td>{item.clientName}</td>
                          <td>{item.reportType}</td>
                          <td>0</td>
                          <td>
                            {" "}
                            {item.transactionType == "credit" ? (
                              <span className="text-success">
                                {`( +${item.amount} )`}
                              </span>
                            ) : (
                              <span className="text-danger">
                                {`( -${item.amount} )`}
                              </span>
                            )}
                          </td>
                        </tr>
                        <tr id={item?._id} style={{ display: `none` }}>
                          <td>subownerjohndoe</td>
                          <td>subownerjohndoe</td>
                          <td>subownerjohndoe</td>
                          <td> subownerjohndoe</td>
                          <td>0</td>
                          <td>
                            {" "}
                            <span className="text-danger">( -undefined )</span>
                          </td>
                        </tr>
                      </>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <span>You have no bets in this time period.</span>
                    </td>
                  </tr>
                )}
              </>
            </tbody>
          </Table>
          <div className="bottom-pagination">
            <ReactPaginate
              breakLabel="..."
              nextLabel=" >"
              onPageChange={props.handlePageClick}
              pageRangeDisplayed={10}
              pageCount={pageCount}
              previousLabel="< "
              renderOnZeroPageCount={null}
              activeClassName="p-0"
              activeLinkClassName="pagintion-li"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default AprofitDownlineUserList;
