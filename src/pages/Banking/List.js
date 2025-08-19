import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Form, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { toast } from "wc-toast";
import helpers from "../../utils/helpers";
import apiPath from "../../utils/apiPath";
import { apiPost } from "../../utils/apiFetch";
import AuthContext from "../../context/AuthContext";
import { constant } from "lodash";
const List = (props) => {
  let { getCoins, user } = useContext(AuthContext);
  let { totalTable, getLimit } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [showBalance, setShowBalance] = useState(false);

  const handleDWChange = (DW, the_user) => {
    
    setCurrentItems((prevState) => {
      const newState = prevState.map((obj) => {
        if (obj._id === the_user._id) {
          return {
            ...obj,
            dw_type: DW,
            error:
              DW == "W"
                ? Number(the_user.totalCoins) < Number(the_user.amount)
                  ? true
                  : false
                : false,
            minError: Number(the_user.amount) >= 1 ? false : true,
            typeError: false,
          };
        }
        return obj;
      });
      return newState;
    });
  };

  const handleAmountChange = (the_user, event) => {
   
    setCurrentItems((prevState) => {
      const newState = prevState.map((obj) => {
        if (obj._id === the_user._id) {
          return {
            ...obj,
            amount: event.target.value,
            error:
              the_user.dw_type == "W"
                ? Number(the_user.totalCoins) < Number(event.target.value)
                  ? true
                  : false
                : false,
            minError: Number(event.target.value) >= 1 ? false : true,
            typeError:
              the_user.dw_type == "W" || the_user.dw_type == "D" ? false : true,
          };
        }
        return obj;
      });
      return newState;
    });
  };

  const handleFullClick = (the_user, event) => {
    setCurrentItems((prevState) => {
      const newState = prevState.map((obj) => {
        if (obj._id === the_user._id) {
          return { ...obj, amount: the_user.totalCoins.toFixed(2),minError: Number(the_user.totalCoins.toFixed(2)) >= 1 ? false : true };
        }
        return obj;
      });
      return newState;
    });
  };

  const handleRemarksChange = (the_user, event) => {
    setCurrentItems((prevState) => {
      const newState = prevState.map((obj) => {
        if (obj._id === the_user._id) {
          return { ...obj, remarks: event.target.value };
        }
        return obj;
      });
      return newState;
    });
  };

  const plusMinusIcon = (the_user = {}) => {
    const isPlusOrMinus = the_user?.dw_type || null;

    return (
      <>
        {isPlusOrMinus === "D" ? (
          <span className="dw-graph-position text-success"> + </span>
        ) : null}
        {isPlusOrMinus === "W" ? (
          <span className="dw-graph-position text-danger"> - </span>
        ) : null}
      </>
    );
  };

  const isDisabledForFull = (the_user = {}) => {
    const isPlusOrMinus = the_user?.dw_type || null;
    return (
      <>
        {isPlusOrMinus === "D" || isPlusOrMinus === null ? (
          <button href="#" className="btn disabled theme_light_btn">
            Full
          </button>
        ) : null}
        {isPlusOrMinus === "W" ? (
          <button
            href="#"
            onClick={handleFullClick.bind(this, the_user)}
            className="btn theme_light_btn"
          >
            Full
          </button>
        ) : null}
      </>
    );
  };
  const [isLoading, setisLoading] = useState(false);
  const handleFormSubmit = async (formData) => {
    const users_dw_cpy = [...currentItems];
    const users_with_dw = users_dw_cpy.filter(
      (uq) => ["D", "W"].includes(uq?.dw_type) || uq.creditCheck
    );
    const users_with_creditRefrence = users_dw_cpy.filter(
      (uq) => uq.creditCheck
    );
    let condition = users_with_dw?.filter((res) => res?.betsBlocked == "1");
    if (condition?.length == 0) {
      const insertObj = users_with_dw.map((d) => {
        return {
          user_id: d._id,
          dw_type: d.dw_type,
          amount: parseFloat(d.amount),
          remarks: d?.remarks || null,
          creditReference: parseFloat(
            d.creditRefrenceChange ? d.creditRefrenceChange : d.creditReference
          ),
        };
      });
      const insertObjCredit = users_with_creditRefrence.map((d) => {
        return {
          user_id: d._id,
          creditReference: parseFloat(d.creditRefrenceChange),
          amount: 0,
        };
      });
      const dataObj = {
        password: formData.password,
        transactionInsert:
          users_with_dw.length > 0 ? insertObj : insertObjCredit,
      };
      if ((users_with_dw.length > 0 ? insertObj : insertObjCredit).length > 0) {
        if (users_with_dw.length > 0) {
          if (
            users_with_dw.some(
              (res) => !res.error && !res.minError && !res.typeError
            )
          ) {
            setisLoading(true);
            const { data: response_data, status } = await apiPost(
              apiPath.bankingCreate,
              dataObj
            );
            if (status === 200) {
              if (response_data.success) {
                getCoins();
                if (response_data?.results?.errorResponse?.length > 0) {
                  toast.error(
                    `Transaction failed for ${response_data.results.errorResponse.map(
                      (res) => {
                        return `${res.username} `;
                      }
                    )}`
                  );
                  toast.success(
                    `Transaction successfully for ${response_data.results.successResponse.map(
                      (res) => {
                        return `${res.username} `;
                      }
                    )}`
                  );
                } else {
                  toast.success(response_data.message);
                }

                setCurrentItems([]);
                reset();
                props.refreshList();
                setisLoading(false);
              } else {
                setisLoading(false);
                toast.error(response_data.message);
              }
            } else {
              setisLoading(false);
              getCoins();
              toast.error(response_data.message);
            }
          }
        } else {
          setisLoading(true);
          const { data: response_data, status } = await apiPost(
            apiPath.bankingCreate,
            dataObj
          );
          if (status === 200) {
            if (response_data.success) {
              getCoins();
              toast.success(response_data.message);
              setCurrentItems([]);
              reset();
              props.refreshList();
              setisLoading(false);
            } else {
              setisLoading(false);
              toast.error(response_data.message);
            }
          } else {
            setisLoading(false);
            toast.error(response_data.message);
          }
        }
      } else {
        setisLoading(false);
        toast.error("Invalid Transaction is being performed.");
      }
    } else {
      setisLoading(false);
      toast.error(
        `${condition?.map((res) => {
          return `${res?.username}`;
        })} is Blocked For Cheat Bet You can't Deposit or Withdraw.`
      );
    }
  };

  const clearAll = () => {
    setCurrentItems([]);
    reset();
    props.refreshList();
  };

  const getSelectedCount = () => {
    const users_dw_q = currentItems.filter(
      (uq) => ["D", "W"].includes(uq?.dw_type) && uq?.amount > 0
    );
    return users_dw_q.length;
  };

  useEffect(() => {
    setCurrentItems(props?.results?.data || []);
    setPageCount(Math.ceil(props?.results?.totalPages) || 0);
  }, [props?.results?.data]);

  const changeCreditRefrence = (e, id) => {
    setCurrentItems((prevState) => {
      const newState = prevState.map((obj) => {
        if (obj._id == id) {
          return { ...obj, creditRefrenceChange: e };
        }
        return obj;
      });
      return newState;
    });
  };
  const handelChangeCredit = (e, type) => {
    setCurrentItems((prevState) => {
      const newState = prevState.map((obj) => {
        if (obj._id == e) {
          return { ...obj, creditCheck: type == "edit" ? true : false };
        }
        return obj;
      });
      return newState;
    });
  };
  const checkBalance = (e, type) => {
    setShowBalance(true);
  };
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
  const recallCasinoAmount = async (event, userId, casinoAmount) => {
    try {
      const { status, data: response_users } = await apiPost(
        apiPath.withdrawCasinoAmount,
        { userId: userId, amount: casinoAmount }
      );
      if (status === 200) {
        if (response_users.status) {
          if (response_users.data.status === "0000") {
            toast.success(response_users.message);
          } else {
            toast.error(response_users.data?.desc);
          }
        } else {
          toast.error(response_users.message);
        }
      }
    } catch (err) {
      toast.error(err.response.message);
    }
  };
  return (
    <div className="account-table batting-table banking-table">
      <div className="responsive">
        <Table className="banking_detail_table table-color">
          <thead>
            <tr>
              <th scope="col">UID </th>
              <th scope="col">Balance</th>
              <th scope="col">Available D/W</th>
              <th scope="col">Exposure</th>
              {user?.userType === "agent" && (
                <th scope="col" className="check_balance">
                  <a
                    className="checkBalanceBtn white_btn"
                    onClick={(e) => {
                      checkBalance(e);
                    }}
                  >
                    Check
                  </a>
                  {"   "}
                  Check Balance
                </th>
              )}

              <th scope="col">Deposit / Withdraw</th>
              <th scope="col">Credit Reference</th>
              <th scope="col">Reference P/L</th>
              <th scope="col">Remark</th>
              <th scope="col">
                <a
                  className="anchorLog"
                  onClick={(e) => {
                    javascript: window.open(
                      `/transaction-logs`,
                      "_blank",
                      "height=900,width=1200"
                    );
                  }}
                >
                  All Logs
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((u, index) => {
              // console.log(u.username == "User" && u, "uuu");
              // betsBlocked
              const balance = u?.userType == "user"
                  ? Math.sign(u?.totalCoins1 +Math.abs(u?.exposure)) === -1 ? (u?.totalCoins1 +Math.abs(u?.exposure)).toFixed(2):(u?.totalCoins1 +Math.abs(u?.exposure)).toFixed(2)
                  :   Math.sign(u?.totalCoins) === -1 ? u?.totalCoins.toFixed(2):u?.totalCoins.toFixed(2);
              return (
                <>
                  <tr key={index}>
                    <td>
                      <span className="list_number"></span>
                      {u?.username}
                    </td>
                    <td>
                     { u?.userType == "user"
                          ? Math.sign(u?.totalCoins1 +Math.abs(u?.exposure)) === -1 ? <p style={{color:`red`}}> {helpers.currencyFormat((u?.totalCoins1 +Math.abs(u?.exposure)).toFixed(2))}</p>:helpers.currencyFormat((u?.totalCoins1 +Math.abs(u?.exposure)).toFixed(2))
                          :   Math.sign(u?.totalCoins) === -1 ? <p style={{color:`red`}}> {helpers.currencyFormat(u?.totalCoins.toFixed(2))}</p>:`${helpers.currencyFormat(u?.totalCoins.toFixed(2))}`}
                      {/* {(u?.userType == "user")?helpers.currencyFormat(u?.totalCoins.toFixed(2)):helpers.currencyFormat((u?.totalCoins1 + Math.abs(u?.exposure)).toFixed(2))} */}
                      {/* {helpers.currencyFormat(u?.totalCoins1)} */}
                      {/* { u?.userType == "agent"
                          ? Math.sign(u?.totalCoins1 +Math.abs(u?.exposure)) === -1 ? <p style={{color:`red`}}> {helpers.currencyFormat((u?.totalCoins1 +Math.abs(u?.exposure)).toFixed(2))}</p>:helpers.currencyFormat((u?.totalCoins1 +Math.abs(u?.exposure)).toFixed(2))
                         : u?.userType == "user"
                          ? Math.sign(u?.totalCoins +Math.abs(u?.exposure)) === -1 ? <p style={{color:`red`}}> {helpers.currencyFormat((u?.totalCoins +Math.abs(u?.exposure)).toFixed(2))}</p>:helpers.currencyFormat((u?.totalCoins +Math.abs(u?.exposure)).toFixed(2))
                          :   Math.sign(u?.totalCoins1) === -1 ? <p style={{color:`red`}}> {helpers.currencyFormat(u?.totalCoins1.toFixed(2))}</p>:`${helpers.currencyFormat(u?.totalCoins1.toFixed(2))}`} */}
                      {u?.userType === "agent" && (
                        <i
                          id={"icon_" + u?._id}
                          className="fas fa-plus-square"
                          onClick={(e) => showDetail(e, u?._id)}
                        ></i>
                      )}
                    </td>
                    <td>
                        {u?.userType == "user"
                          ? 
                            Math.sign(helpers.currencyFormat((u?.totalCoins1))) === -1 ? <p style={{color:`red`}}> {helpers.currencyFormat(u?.totalCoins1.toFixed(2))}</p>:helpers.currencyFormat((u?.totalCoins1.toFixed(2)))
                          
                          : 
                          Math.sign(helpers.currencyFormat(u?.totalCoins - Math.abs(u?.exposure))) === -1 ? <p style={{color:`red`}}> {helpers.currencyFormat(u?.totalCoins - Math.abs(u?.exposure))}</p>:helpers.currencyFormat(u?.totalCoins- Math.abs(u?.exposure))
                          }
                    </td>
                    <td> {helpers.currencyFormat(u?.exposure) || "0.00"}</td>
                    {u?.userType === "agent" && (
                      <td className="check_date">
                        {showBalance === true && (
                          <>
                            <span>
                              {helpers.dateFormat(Date("Y-m-d h:i:s"))}
                            </span>

                            {parseFloat(
                              u?.transaction?.totalAmount
                                ? helpers.currencyFormat(
                                    u?.transaction?.totalAmount
                                  )
                                : 0
                            ) +
                              parseFloat(
                                u?.casino_transaction?.totalAmount
                                  ? helpers.currencyFormat(
                                      u?.casino_transaction?.totalAmount
                                    )
                                  : 0
                              )}
                          </>
                        )}
                      </td>
                    )}
                    <td className="border-x" width="320">
                      <div className="deposite-withdraw medium_width">
                        <div className="dw-toggle">
                          <div className="tgl_btn">
                            <input
                              defaultChecked={u.dw_type === "D"}
                              type="radio"
                              name={`DW_${u._id}`}
                              onChange={handleDWChange.bind(this, "D", u)}
                            />
                            <label
                              htmlFor={`deposit_${u._id}`}
                              className="bg-green"
                            >
                              {" "}
                              D
                            </label>
                          </div>

                          <div className="tgl_btn">
                            <input
                              defaultChecked={u.dw_type === "W"}
                              type="radio"
                              name={`DW_${u._id}`}
                              onChange={handleDWChange.bind(this, "W", u)}
                            />
                            <label
                              htmlFor={`withdraw_${u._id}`}
                              className="bg-red"
                            >
                              {" "}
                              W{" "}
                            </label>
                          </div>
                        </div>
                        <div className="dw-value_text_box">
                          <input
                            type="number"
                            defaultValue={u.amount}
                            min={1}
                            className="text-end form-control"
                            id={`user_${u._id}`}
                            onChange={handleAmountChange.bind(this, u)}
                          />
                          {plusMinusIcon(u)}
                        </div>
                        {isDisabledForFull(u)}
                      </div>
                      {u.typeError ? (
                        <span style={{ fontSize: "12px", color: "red" }}>
                          Please select transaction type
                        </span>
                      ) : u?.error ? (
                        <span style={{ fontSize: "12px", color: "red" }}>
                          Withdrawal amount should not greater than available
                          balance
                        </span>
                      ) : u?.minError ? (
                        <span style={{ fontSize: "12px", color: "red" }}>
                          Amount should be greater then 0
                        </span>
                      ) : (
                        ""
                      )}
                    </td>
                    <td>
                      {u.creditCheck ? (
                        <input
                          className="small_form_control"
                          style={{ marginRight: "10px" }}
                          type="number"
                          value={
                            u.creditRefrenceChange
                              ? u.creditRefrenceChange
                              : u.creditReference
                          }
                          onChange={(e) =>
                            changeCreditRefrence(e.target.value, u._id)
                          }
                        />
                      ) : (
                        <span style={{ marginRight: "10px" }}>
                          {helpers.currencyFormat(u?.creditReference)}
                        </span>
                      )}
                      {u.creditCheck ? (
                        <button
                          className="btn theme_light_btn"
                          onClick={() => handelChangeCredit(u._id, "cancel")}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handelChangeCredit(u._id, "edit");
                          }}
                          className="btn theme_light_btn"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                    <td className="border-x">
                        {(u.creditReference>0)?<>
                        <span
                          style={{
                            color:
                            u.creditReference - balance >= 0
                                ? "green"
                                : "red",
                          }}
                        >
                          {helpers.currencyFormat(u.creditReference - balance)}
                        </span>
                        </>:0}
                    </td>
                    <td>
                      <Form>
                        <Form.Control
                          type="text"
                          placeholder="Remark"
                          onChange={handleRemarksChange.bind(this, u)}
                        />
                      </Form>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={(e) => {
                          javascript: window.open(
                            `/transaction-logs/${u._id}`,
                            "_blank",
                            "height=900,width=1200"
                          );
                        }}
                        className="btn theme_light_btn"
                      >
                        Log
                      </button>
                    </td>
                  </tr>
                  <tr
                    id={u?._id}
                    style={{ display: getProperty }}
                    key={u?._id}
                    className="expand-balance light_blue"
                  >
                    <td></td>
                    <td colSpan={10} className="p-0 large_table_data">
                      <table className="inner_table">
                        <tbody>
                          <tr>
                            <th style={{ width: `9%` }}>Game</th>
                            <th style={{ width: `11%` }}>Balance</th>
                            <th style={{ width: `7%` }}>
                              <a
                                id="recallAll"
                                href="#"
                                onClick={(e) =>
                                  recallCasinoAmount(
                                    e,
                                    u?._id,
                                    u?.casino_transaction?.totalAmount
                                      ? u?.casino_transaction?.totalAmount
                                      : 0
                                  )
                                }
                              >
                                Recall All
                              </a>
                            </th>
                            <th></th>
                          </tr>
                          <tr>
                            <td>SABA</td>
                            <td>0</td>
                            <td>
                              <a href="#">Recall</a>
                            </td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Sky Trader</td>
                            <td>0</td>
                            <td>
                              <a href="#">Recall</a>
                            </td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Royal Gaming</td>
                            <td>0</td>
                            <td>
                              <a href="#">Recall</a>
                            </td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>BPoker</td>
                            <td>0</td>
                            <td>
                              <a href="#">Recall</a>
                            </td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Casino</td>
                            <td>
                              {u?.casino_transaction?.totalAmount
                                ? u?.casino_transaction?.totalAmount
                                : 0.0}
                            </td>
                            <td>
                              <a
                                href="#"
                                onClick={(e) =>
                                  u?.casino_transaction?.totalAmount
                                    ? recallCasinoAmount(
                                        e,
                                        u?._id,
                                        u?.casino_transaction?.totalAmount
                                          ? u?.casino_transaction?.totalAmount
                                          : 0
                                      )
                                    : ""
                                }
                              >
                                Recall
                              </a>
                            </td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </>
              );
            })}
            {currentItems?.length > 0 && (
              <tr style={{ fontWeight: "500" }}>
                <td>Total</td>
                <td>{helpers.currencyFormat(totalTable.Balance)}</td>
                <td>{helpers.currencyFormat(totalTable.Available)}</td>
                <td>{helpers.currencyFormat(totalTable.Exposure)}</td>
                <td></td>
                <td>{helpers.currencyFormat(totalTable.Credit_Reference)}</td>
                <td>{helpers.currencyFormat(totalTable.Reference)}</td>
                <td></td>
                <td></td>
              </tr>
            )}
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
      {getLimit?.status == "active" ? (
        <div className="paymoney d-flex align-items-center">
          <Form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="paymoney_form justify-content-center"
          >
            <button
              className="clear_btn btn"
              type={"button"}
              onClick={clearAll}
            >
              Clear All
            </button>
            <Form.Control
              type="password"
              placeholder="Password"
              className=""
              {...register("password", {
                required: "Please enter password",
              })}
            />
            <button
              disabled={isLoading ? true : false}
              type="submit"
              className="btn green-btn"
            >
              Submit <span className="payment_count">{getSelectedCount()}</span>
              Payment
            </button>
          </Form>
        </div>
      ) : (
        "Note :Deposit and Withdraw are locked please contact upper level"
      )}
    </div>
  );
};

export default List;
