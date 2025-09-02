import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import MyAccountSidebar from "../components/MyAccountSidebar";
import { apiGet, apiPost, apiPut } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import { isEmpty, pick } from "lodash";
import ReactPaginate from "react-paginate";
import helpers from "../utils/helpers";
import classNames from "classnames";
import { startCase } from "lodash";
import { useForm } from "react-hook-form";
import { toast } from "wc-toast";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const SearchUser = () => {
  let { user,getCoins } = useContext(AuthContext);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);
  const [keyword, setKeyword] = useState();
  const [password_same, set_password_same] = useState(true);
  const [isLoader, setLoader] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const changePasswordToggle = () => setChangePassword(!changePassword);
  const [getStatus, setStatus] = useState("");
  const [changeStatus, setChangeStatus] = useState(false);
  const changeStatusToggle = (status) => {
    setChangeStatus(!changeStatus);
    setStatus(status);
  };

  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
  });

  const LogData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.searchUser,
      search_params
    );
    if (status === 200) {
      if (response_users.success) {
        setCurrentItems(response_users.results?.data || []);
      }
    }
  };
  const handlePageClick = (event) => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: event.selected + 1,
      };
    });
  };
  const handleClick = () => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        keyword: keyword,
      };
    });
  };

  useEffect(() => {
    setPageCount(currentItems?.totalPages || []);
  }, [currentItems]);

  useEffect(() => {
    if (search_params.keyword) {
      LogData();
    }
  }, [search_params]);

  // const handleDWChange = (DW, the_user) => {
  //   setCurrentItems((prevState) => {
  //     const newState = prevState.map((obj) => {
  //       if (obj._id === the_user._id) {
  //         return { ...obj, dw_type: DW };
  //       }
  //       return obj;
  //     });
  //     return newState;
  //   });
  // };
  // const handleAmountChange = (the_user, event) => {
  //   setCurrentItems((prevState) => {
  //     const newState = prevState.map((obj) => {
  //       if (obj._id === the_user._id) {
  //         return { ...obj, amount: event.target.value };
  //       }
  //       return obj;
  //     });
  //     return newState;
  //   });
  // };

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
          return { ...obj, amount: the_user.totalCoins.toFixed(2) ,minError: Number(the_user.totalCoins.toFixed(2)) >= 1 ? false : true};
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
          <button href="#" className="btn disabled theme_dark_btn">
            Full
          </button>
        ) : null}
        {isPlusOrMinus === "W" ? (
          <button
            href="#"
            onClick={handleFullClick.bind(this, the_user)}
            className="btn theme_dark_btn"
          >
            Full
          </button>
        ) : null}
      </>
    );
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
  const refreshList = () => {
    LogData();
  };

  const getSelectedCount = () => {
    const users_dw_q = currentItems.filter(
      (uq) => ["D", "W"].includes(uq?.dw_type) && uq?.amount > 0
    );
    return users_dw_q.length;
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});

  const onSubmit = async (request) => {
    setLoader(true);
    set_password_same(true);
    // console.log(currentItems[0]?._id);
    if (request.newPassword !== request.confirmPassword) {
      setLoader(false);
      set_password_same(false);
    } else {
      try {
        const { status, data: response_users } = await apiPost(
          apiPath.changePassword + "?user_id=" + currentItems[0]?._id +"&userType=user",
          pick(request, ["oldPassword", "newPassword"])
        );
        if (status === 200) {
          if (response_users.success) {
            setLoader(false);
            setChangePassword();
            toast.success(response_users.message);
            LogData();
            reset();
          } else {
            setLoader(false);
            toast.error(response_users.message);
          }
        }
      } catch (err) {
        setLoader(false);
        toast.error(err.response.data.message);
      }
    }
  };
  const [isLoading, setisLoading] = useState(false);
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
    reset: reset1,
  } = useForm({});
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
                LogData();
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
              LogData();
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
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
  } = useForm({});
  const onSubmit2 = async (request) => {
    if (getStatus) {
      setLoader(true);
      try {
        const { status, data: response_users } = await apiPut(
          apiPath.profileChangeStatus + "/" + currentItems[0]?._id,
          { status: getStatus, password: request.password }
        );
        if (status === 200) {
          if (response_users.success) {
            setLoader(false);
            toast.success(response_users.message);
            setChangeStatus();
            LogData();
            reset2();
          } else {
            setLoader(false);
            toast.error(response_users.message);
          }
        }
      } catch (err) {
        setLoader(false);
        toast.error(err?.response?.data?.message);
      }
    } else {
      toast.error("Please select status");
    }
  };

  const redirect = () => {

    if (currentItems[0]?.userType == "user") {
      window.location.href = "/transaction-history-2/" + currentItems[0]?._id + "/user"
    }
  };
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Search Users</h2>
          </div>

          <div className="find-member-sec">
            <Form className="mb-4">
              <Form.Group className="position-relative mb-2">
                <Form.Control
                  type="text"
                  className="small_form_control"
                  placeholder="Enter User Name..."
                  onChange={(e) => {
                    setKeyword(e.target.value);
                  }}
                />
                <i className="fas fa-search"></i>
              </Form.Group>
              <div className="d-flex flex-wrap block-search-sec">
                <Button
                  className="mb-2 mx-1 theme_light_btn"
                  onClick={handleClick}
                >
                  Search
                </Button>
                <Button className="mb-2 mx-1 theme_light_btn" onClick={redirect}
                >
                  Statement</Button>
                <Button className="mb-2 mx-1 theme_light_btn">
                  Block For Cheat
                </Button>
              </div>
            </Form>

            <div className="inner-wrapper">
              <div className="common-container">
                <div className="account-table batting-table">
                  <div className="responsive">
                    <Table className="banking_detail_table">
                      <thead>
                        <tr>
                          {user?.userType === "owner" && (
                            <th scope="col"> Sub Owner</th>
                          )}
                          <th scope="col">Super Admin</th>
                          <th scope="col">Admin </th>
                          <th scope="col">Sub Admin</th>
                          <th scope="col">Senior Super</th>
                          <th scope="col">Super Agent</th>
                          <th scope="col">Agent</th>
                          <th scope="col">User</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems &&
                          currentItems.map((item, key) => (
                            <tr key={key}>
                              {user?.userType === "owner" && (
                                <td>
                                  {item?.userType === "subwoner"
                                    ? item?.username
                                    : item?.sub_owner?.username
                                      ? item?.sub_owner?.username
                                      : "-"}
                                </td>
                              )}
                              <td>
                                {item?.userType === "super_admin"
                                  ? item?.username
                                  : item?.super_admin?.username
                                    ? item?.super_admin?.username
                                    : "-"}
                              </td>
                              <td>
                                {item?.userType === "admin"
                                  ? item?.username
                                  : item?.admin?.username
                                    ? item?.admin?.username
                                    : "-"}
                              </td>

                              <td>
                                {item?.userType === "sub_admin"
                                  ? item?.username
                                  : item?.sub_admin?.username
                                    ? item?.sub_admin?.username
                                    : "-"}
                              </td>
                              <td>
                                {item?.userType === "super_senior"
                                  ? item?.username
                                  : item?.super_senior?.username
                                    ? item?.super_senior?.username
                                    : "-"}
                              </td>
                              <td>
                                {item?.userType === "super_agent"
                                  ? item?.username
                                  : item?.super_agent?.username
                                    ? item?.super_agent?.username
                                    : "-"}
                              </td>
                              <td>
                                {item?.userType === "agent"
                                  ? item?.username
                                  : item?.agent?.username
                                    ? item?.agent?.username
                                    : "-"}
                              </td>
                              <td>
                                {item?.userType === "user"
                                  ? item?.username
                                  : "-"}
                                {item?.pwd ? "- Pass(" + item?.pwd + ")" : ""}
                              </td>
                            </tr>
                          ))}
                        {isEmpty(currentItems) ? (
                          <tr>
                            <td colSpan={9}>No records found</td>
                          </tr>
                        ) : null}
                      </tbody>
                    </Table>
                    <Table className="banking_detail_table">
                      <thead>
                        <tr>
                          <th scope="col">Username </th>
                          <th scope="col">Balance</th>
                          <th scope="col">Available D/W</th>
                          <th scope="col">Exposure</th>
                          <th scope="col">Status</th>
                          <th scope="col">Action</th>
                          <th scope="col">Deposit / Withdraw</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems?.length > 0 &&
                          currentItems?.map((u, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <span className="list_number"></span>
                                  {u?.username}
                                </td>
                                <td>{helpers.currencyFormat(u?.totalCoins +u?.exposure)}</td>
                                <td>
                                  {helpers.currencyFormat( u?.totalCoins )}
                                </td>
                                <td>{helpers.currencyFormat(u?.exposure)}</td>
                                <td>
                                  <strong
                                    className={classNames({
                                      "status-active": u?.status === "active",
                                      "status-suspend px-3":
                                        u?.status === "suspend",
                                      "status-locked px-3":
                                        u?.status === "locked",
                                    })}
                                  >
                                    {`${startCase(u?.status)}` || ""}
                                  </strong>
                                  {u.userType === "user" && (
                                    <Form.Group className="">
                                      <Form.Select
                                        aria-label="Default select example"
                                        className="search-user-change-status ms-0"
                                        onChange={(e) => {
                                          changeStatusToggle(e.target.value);
                                        }}
                                      >
                                        <option value="">Change Status</option>
                                        <option value="active">Active</option>
                                        <option value="suspend">Suspend</option>
                                        <option value="locked">Locked</option>
                                        {/* <option value="cheater">Cheater</option> */}
                                      </Form.Select>
                                    </Form.Group>
                                  )}
                                </td>

                                <td>
                                  <Link
                                    to="#"
                                    className="text-decoration-none search-user-change-pass"
                                    onClick={changePasswordToggle}
                                  >
                                    Change Password{" "}
                                    <i className="fas fa-pen text-white ps-1"></i>
                                  </Link>
                                </td>
                                {/* <td>
                                  <div className="deposite-withdraw">
                                    <div className="dw-toggle">
                                      <div className="tgl_btn">
                                        <input
                                          defaultChecked={u.dw_type === "D"}
                                          type="radio"
                                          name={`DW_${u._id}`}
                                          onChange={handleDWChange.bind(
                                            this,
                                            "D",
                                            u
                                          )}
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
                                          onChange={handleDWChange.bind(
                                            this,
                                            "W",
                                            u
                                          )}
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
                                        className="text-end"
                                        id={`user_${u._id}`}
                                        onChange={handleAmountChange.bind(
                                          this,
                                          u
                                        )}
                                      />
                                      {plusMinusIcon(u)}
                                    </div>
                                    {isDisabledForFull(u)}
                                     
                                    <Form>
                                      <Form.Control
                                        type="text"
                                        placeholder="Remark"
                                        onChange={handleRemarksChange.bind(
                                          this,
                                          u
                                        )}
                                      />
                                    </Form>
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
                                </td> */}
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>
                  <div className="paymoney d-flex align-items-center">
                    <Form
                      onSubmit={handleSubmit1(handleFormSubmit)}
                      className="paymoney_form justify-content-center"
                    >
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        className=""
                        {...register1("password", {
                          required: "Please enter password",
                        })}
                      />
                      <button
                        disabled={isLoading ? true : false}
                        type="submit"
                        className="btn green-btn"
                      >
                        Submit{" "}
                        <span className="payment_count">
                          {getSelectedCount()}
                        </span>
                        Payment
                      </button>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container >
      </section >
      <Modal
        show={changePassword}
        onHide={changePasswordToggle}
        className="change-status-modal p-0"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-status h4">
            Change Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="test-status border-0">
            <Form
              className="change-password-sec"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Form.Group className="d-flex  mb-2">
                <Form.Label>New Password</Form.Label>

                <Form.Control
                  type="password"
                  placeholder="Enter New Password"
                  className={errors.newPassword ? " is-invalid " : ""}
                  {...register("newPassword", {
                    required: "Please enter new password",
                  })}
                />
                {errors.newPassword && errors.newPassword.message && (
                  <label className="invalid-feedback text-left">
                    {errors.newPassword.message}
                  </label>
                )}
              </Form.Group>
              <Form.Group className="d-flex  mb-2">
                <Form.Label>New Password Confirm</Form.Label>

                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  className={
                    errors.confirmPassword || password_same === false
                      ? " is-invalid "
                      : ""
                  }
                  {...register("confirmPassword", {
                    required: "Please enter confirm password",
                  })}
                />
                {errors.confirmPassword && errors.confirmPassword.message && (
                  <label className="invalid-feedback text-left">
                    {errors.confirmPassword.message}
                  </label>
                )}
                {password_same === false && errors.confirmPassword !== "" && (
                  <label className="invalid-feedback text-left">
                    Password does not match.
                  </label>
                )}
              </Form.Group>

              <Form.Group className="d-flex  mb-2">
                <Form.Label>Your Password</Form.Label>

                <Form.Control
                  type="password"
                  placeholder="Enter Old Password"
                  className={errors.oldPassword ? " is-invalid " : ""}
                  {...register("oldPassword", {
                    required: "Please enter password",
                  })}
                />
                {errors.oldPassword && errors.oldPassword.message && (
                  <label className="invalid-feedback text-left">
                    {errors.oldPassword.message}
                  </label>
                )}
              </Form.Group>

              <div className="text-center mt-4">
                <Button type="submit" className="green-btn">
                  {isLoader ? "Loading..." : "Change"}
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={changeStatus}
        onHide={changeStatusToggle}
        className="change-status-modal p-0"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-status h4">
            Enter Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="test-status border-0">
            <Form
              className="change-password-sec"
              onSubmit={handleSubmit2(onSubmit2)}
            >
              <Form.Group className="d-flex  mb-2">
                <Form.Label> Password</Form.Label>

                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  className={errors2.password ? " is-invalid " : ""}
                  {...register2("password", {
                    required: "Please enter password",
                  })}
                />
                {errors2.password && errors2.password.message && (
                  <label className="invalid-feedback text-left">
                    {errors2.password.message}
                  </label>
                )}
              </Form.Group>

              <div className="text-center mt-4">
                <Button type="submit" className="green-btn">
                  {isLoader ? "Loading..." : "Submit"}
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </div >
  );
};

export default SearchUser;
