import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Col,
  Button,
  Row,
  Table,
  Modal,
  Form,
} from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import { apiGet, apiPost } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { isEmpty, pick, sum } from "lodash";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Breadcrumbs from "./Breadcrumbs";
import { toast } from "wc-toast";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import helpers from "../../utils/helpers";

const AccountSummary = () => {
  const params = useParams();
  let { user, setComission } = useContext(AuthContext);

  const [summaryData, setSummaryData] = useState("");
  const [password_same, set_password_same] = useState(true);
  const [isLoader, setLoader] = useState(false);
  const [changeType, setChangeType] = useState("");

  const [changePassword, setChangePassword] = useState(false);
  const changePasswordToggle = () => setChangePassword(!changePassword);
  const accountSummary = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.userProfile + "?user_id=" + params?.id
    );
    if (status === 200) {
      if (response_users.success) {
        setSummaryData(response_users.results);
        setComission(response_users.results.commission);
      }
    }
  };

  const {
    register: register2,
    unregister: unregister2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
  } = useForm({});
  const [change, setChange] = useState(false);
  const changeToggle = (type) => {
    setChange(!change);
    setChangeType(type);
    if (type === "exposure") {
      register2("exposureLimit", {
        required: "Please enter exposure",
      });
      unregister2("commission");
    } else {
      register2("commission", {
        required: "Please enter commission",
      });
      unregister2("exposureLimit");
    }
  };

  const onSubmit2 = async (request) => {
    setLoader(true);

    try {
      const requestData = {};
      requestData.user_id = params?.id;
      requestData.password = request.password;
      if (changeType === "exposure") {
        requestData.exposure_limit = request.exposureLimit;
      } else {
        requestData.commission = request.commission;
      }

      const { status, data: response_users } = await apiPost(
        changeType === "exposure"
          ? apiPath.updateExposure
          : apiPath.updateCommission,

        requestData
      );
      if (status === 200) {
        if (response_users.success) {
          setLoader(false);
          toast.success(response_users.message);
          reset2();
          changeToggle();
          accountSummary();
        } else {
          setLoader(false);
          toast.error(response_users.message);
        }
      }
    } catch (err) {
      setLoader(false);
      toast.error(err?.response?.data?.message);
    }
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

    if (request.newPassword !== request.confirmPassword) {
      setLoader(false);
      set_password_same(false);
    } else {
      try {
        const { status, data: response_users } = await apiPost(
          apiPath.changePassword + "?user_id=" + params?.id,
          pick(request, ["oldPassword", "newPassword"])
        );
        if (status === 200) {
          if (response_users.success) {
            setLoader(false);
            setChangePassword();
            toast.success(response_users.message);
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

  useEffect(() => {
    if (params?.id) {
      accountSummary();
    }
  }, [params?.id]);
  function copy(text) {
    toast.success("Link Copied!");
    return window.navigator.clipboard.writeText(text);
  }

  return (
    <div>
      <section className="py-4 main-inner-outer">
        <Container fluid>
          <Breadcrumbs user_id={params?.id} />

          <div className="accout_cols_outer">
            <div className="left_side">
              <Sidebar />
            </div>
            <div className="right_side">
              <div className="inner-wrapper">
                <h2 className="common-heading">Account Summary</h2>
                <div className="user-test mb-2">
                  <i className="fas fa-user"></i>{" "}
                  <strong> {summaryData?.firstName}</strong>
                </div>

                <section className="account-table">
                  <div className="responsive">
                    <Table>
                      <thead>
                        <tr>
                          <th scope="col">Wallet</th>
                          <th scope="col">Available to Bet </th>
                          <th scope="col">Funds available to withdraw </th>
                          <th scope="col">Current exposure</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Main wallet</td>
                          <td>{summaryData?.totalCoins}</td>
                          <td>{summaryData?.totalCoins}</td>
                          <td>{summaryData?.exposure}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>

                  <div className="profile-tab">
                    <Row>
                      <Col lg={12} md={12}>
                        <h2 className="common-heading">Profile</h2>
                        <Table>
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                colSpan="4"
                                className="text-start"
                              >
                                About You
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="text-start" width="25%">
                                First Name
                              </td>
                              <td className="text-start" colSpan="3">
                                {summaryData?.firstName}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start" width="25%">
                                Last Name
                              </td>
                              <td className="text-start" colSpan="3">
                                {summaryData?.lastName}
                              </td>
                            </tr>

                            <tr>
                              <td className="text-start" width="25%">
                                Birthday
                              </td>
                              <td className="text-start" colSpan="3">
                                -----
                              </td>
                            </tr>

                            <tr>
                              <td className="text-start" width="25%">
                                Email
                              </td>
                              <td className="text-start" colSpan="3">
                                {summaryData?.email}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start" width="25%">
                                Password
                              </td>
                              <td className="text-start">************</td>
                              
                              {user?.userType == "owner" || user?.userType == "sub_owner" && (
                                <td>
                                  <Link
                                    to="#"
                                    className="text-decoration-none text-primary btn theme_light_btn"
                                    onClick={changePasswordToggle}
                                  >
                                    Edit{" "}
                                    <i className="fas fa-pen text-primary ps-1"></i>
                                  </Link>
                                </td>
                              )}
                            </tr>
                            <tr>
                              <td className="text-start" width="25%">
                                Time Zone
                              </td>
                              <td className="text-start" colSpan="3">
                                {summaryData?.timeZone}
                              </td>
                            </tr>
                            {(summaryData?.userType == "agent" ||
                              summaryData?.userType == "super_agent") && (
                              <>
                                {!isEmpty(summaryData?.referalCode) &&
                                  params?.page !== "referral" && (
                                    <tr>
                                      <td className="text-start" width="25%">
                                        Referal Code
                                      </td>
                                      <td
                                        className="text-start"
                                        style={{
                                          cursor: "pointer",
                                          color: "blue",
                                        }}
                                        onClick={() => {
                                          copy(
                                            "https://"+helpers?.getDomain()+"/register?referral_code=" +
                                              summaryData?.referalCode
                                          );
                                        }}
                                        colSpan="3"
                                      >
                                        {"https://"+helpers?.getDomain()+"/register?referral_code=" +
                                          summaryData?.referalCode}
                                      </td>
                                    </tr>
                                  )}
                              </>
                            )}
                          </tbody>
                        </Table>
                        {/* contact-details */}

                        <Table>
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                colSpan="4"
                                className="text-start"
                              >
                                Contact Details
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="text-start">Primary Number</td>
                              <td className="text-start">
                                {summaryData?.phone}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                        {/* contact-details */}

                        {user?.userType == "owner" ||
                          (user?.userType == "sub_owner" && (
                            <Table>
                              <tbody>
                                {summaryData.userType == "user" && (
                                  <tr>
                                    <td className="text-start" width="25%">
                                      Exposure Limit
                                    </td>
                                    <td className="text-start" colSpan="3">
                                      {summaryData?.exposureLimit}
                                    </td>
                                    <td>
                                      <Link
                                        to="#"
                                        className="text-decoration-none text-primary btn theme_light_btn"
                                        onClick={(e) =>
                                          changeToggle("exposure")
                                        }
                                      >
                                        Edit{" "}
                                        <i className="fas fa-pen text-primary ps-1"></i>
                                      </Link>
                                    </td>
                                  </tr>
                                )}

                                {summaryData.userType != "user" && (
                                  <tr>
                                    <td className="text-start" width="25%">
                                      Commission
                                    </td>
                                    <td className="text-start" colSpan="3">
                                      {summaryData?.commission
                                        ? summaryData?.commission + "%"
                                        : 0}
                                    </td>
                                    <td>
                                      <Link
                                        to="#"
                                        className="text-decoration-none text-primary btn theme_light_btn"
                                        onClick={(e) =>
                                          changeToggle("commision")
                                        }
                                      >
                                        Edit{" "}
                                        <i className="fas fa-pen text-primary ps-1"></i>
                                      </Link>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                          ))}

                        {(user?.userType == "super_agent" ||
                          user?.userType == "super_admin") && (
                          <Table>
                            <tbody>
                              <tr>
                                <td className="text-start" width="25%">
                                  Commission
                                </td>
                                <td className="text-start" colSpan="3">
                                  {summaryData?.commission
                                    ? summaryData?.commission + "%"
                                    : 0}
                                </td>
                                <td>
                                  {/* <Link
                                    to="#"
                                    className="text-decoration-none text-primary btn theme_light_btn"
                                    onClick={(e) => changeToggle("commision")}
                                  >
                                    Edit{" "}
                                    <i className="fas fa-pen text-primary ps-1"></i>
                                  </Link> */}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        )}
                      </Col>
                      {/* {console.log('user?.userType',user?.userType)} */}
                    </Row>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Container>
      </section>
      {/* change-password-modal-start*/}
      <Modal
        show={changePassword}
        onHide={changePasswordToggle}
        className="change-status-modal p-0"
      >
        <Modal.Header closeButton className="p-0 pb-2">
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
                <Button
                  type="submit"
                  className="theme_dark_btn btn btn-primary"
                >
                  {isLoader ? "Loading..." : "Change"}
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
      {/* change-password-modal-end*/}
      {/* change-exposure-modal-start*/}
      <Modal
        show={change}
        onHide={changeToggle}
        className="change-status-modal p-0"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-status h4">
            {changeType === "exposure"
              ? "Change Exposure Limit"
              : "Change Commission"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="test-status border-0">
            <p>
              {" "}
              {changeType === "exposure" &&
                "Exposure Limit :" + summaryData?.exposureLimit}
            </p>
            <Form
              className="change-password-sec"
              onSubmit={handleSubmit2(onSubmit2)}
            >
              {changeType === "exposure" ? (
                <Form.Group className="d-flex  mb-2">
                  <Form.Label>Exposure</Form.Label>
                  <div className="common-form-sec">
                    <Form.Control
                      type="text"
                      placeholder="Enter Exposure"
                      className={errors2.exposureLimit ? " is-invalid " : ""}
                      {...register2("exposureLimit")}
                    />
                    {errors2.exposureLimit && errors2.exposureLimit.message && (
                      <label className="invalid-feedback text-left">
                        {errors2.exposureLimit.message}
                      </label>
                    )}
                  </div>
                </Form.Group>
              ) : (
                <>
                  {console.log(
                    "summaryData?.userType",
                    summaryData?.userType,
                    summaryData?.super_agent?.commission
                  )}
                  <Form.Group className="d-flex  mb-2">
                    <Form.Label>Commission (%)</Form.Label>
                    <div className="common-form-sec" style={{ width: "45%" }}>
                      <Form.Control
                        type="number"
                        min="0"
                        max={
                          summaryData?.userType == "agent"
                            ? summaryData?.super_agent?.commission || 100
                            : 100
                        }
                        placeholder="Enter Commission"
                        className={errors2.commission ? " is-invalid " : ""}
                        {...register2("commission")}
                      />
                      {errors2.commission && errors2.commission.message && (
                        <label className="invalid-feedback text-left">
                          {errors2.commission.message}
                        </label>
                      )}
                    </div>
                  </Form.Group>
                </>
              )}
              <Form.Group className="d-flex  mb-2">
                <Form.Label>Password</Form.Label>
                <div className="common-form-sec">
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
                </div>
              </Form.Group>

              <div className="text-center mt-4">
                <Button
                  type="submit"
                  className="green-btn"
                  disabled={isLoader ? true : false}
                >
                  {isLoader ? "Loading..." : "Change"}
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
      {/* change-exposure-modal-end*/}
    </div>
  );
};

export default AccountSummary;
