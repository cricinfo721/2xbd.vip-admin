import React, { useContext, useState, useEffect } from "react";
import { Container, Button, Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { apiPost } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import { pick } from "lodash";
import { Link } from "react-router-dom";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
import { toast } from "wc-toast";
import { ResetPassword } from "../components/ResetPassword";
import { DepositForm } from "../components/DepositForm";

const GeneralSetting = () => {
  let { user_coins, user, getCoins ,getProfileData,profileData } = useContext(AuthContext);
  const [user_coin_balance, setUserCoins] = useState(user_coins);
  const [changePassword, setChangePassword] = useState(false);
  const changePasswordToggle = () => setChangePassword(!changePassword);
  const [deposit, setDeposit] = useState(false);
  const changeDepositToggle = () => setDeposit(!deposit);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
    reset: reset1,
  } = useForm({});
  const [password_same, set_password_same] = useState(true);
  const [isLoader, setLoader] = useState(false);
  const [depositChip, setDepositChip] = useState(false);
  const depositChipToggle = () => setDepositChip(!depositChip);

  const onSubmit = async (request) => {
    setLoader(true);
    set_password_same(true);

    if (request.newPassword !== request.confirmPassword) {
      setLoader(false);
      set_password_same(false);
    } else {
      try {
        const { status, data: response_users } = await apiPost(
          apiPath.changePassword,
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

  const onSubmit1 = async (request) => {
    setLoader(true);

    try {
      const { status, data: response_users } = await apiPost(
        apiPath.depositChips,
        pick(request, ["coins", "mypassword"])
      );
      if (status === 200) {
        if (response_users.success) {
          setLoader(false);
          setDepositChip();
          getCoins();
          toast.success(response_users.message);
          reset1();
        } else {
          setLoader(false);
          toast.error(response_users.message);
        }
      }
    } catch (err) {
      setLoader(false);
      toast.error(err.response.data.message);
    }
  };
  useEffect(() => {
    setUserCoins(user_coins);
  }, [user_coins]);

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Admin Setting</h2>
          </div>
          <div className="setting_dashboard">
            <div className="setting_dashboard_block">
              <h2 className="common-heading">General Settings</h2>
              <ul>
                <li>
                  <Link to="#" onClick={changePasswordToggle}>
                    {" "}
                    <figure>
                      {" "}
                      <img
                        src="../assets/images/changepass.png"
                        alt="Change Password"
                      />{" "}
                    </figure>{" "}
                  </Link>{" "}
                </li>
                {user?.userType === "owner" && (
                  <li>
                    <Link to="#" onClick={depositChipToggle}>
                      {" "}
                      <figure>
                        {" "}
                        <img
                          src="../assets/images/depositMoney.png"
                          alt="Deposit Money"
                        />{" "}
                      </figure>{" "}
                    </Link>{" "}
                  </li>
                )}
                {user.userType == "owner" || user.userType == "sub_owner" ? (
                  <>
                  <li>
                    <Link to="/searchuser">
                      {" "}
                      <figure>
                        {" "}
                        <img
                          src="../assets/images/searchuser.png"
                          alt="Search User"
                        />{" "}
                      </figure>{" "}
                    </Link>{" "}
                  </li>

                  <li>
                    <Link to="/WebsiteSetting">
                      {" "}
                      <figure>
                        {" "}
                        <img
                          src="../assets/images/websitesetting.png"
                          alt="Website Setting"
                        />{" "}
                      </figure>{" "}
                    </Link>{" "}
                  </li>
                  </>
                ) : (
                  ""
                )}
                {user.userType == "owner" || user.userType == "sub_owner" ? (
                  <li>
                    <Link to={"/defaultsetting"}>
                      {" "}
                      <figure>
                        {" "}
                        <img
                          src="../assets/images/defaultsettings.jpg"
                          alt="Default Setting"
                        />{" "}
                      </figure>{" "}
                    </Link>{" "}
                  </li>
                ) : (
                  ""
                )}
                {user.userType == "owner" || user.userType == "sub_owner" && (
                <li>
                  <Link to="/SurveillanceSetting">
                    {" "}
                    <figure>
                      {" "}
                      <img
                        src="../assets/images/surveillance.png"
                        alt="Surveillance"
                      />{" "}
                    </figure>{" "}
                  </Link>{" "}
                </li>)
                }
                {user?.userType === "sub_owner" && (
                  <li>
                    <Link to="/defaultAgent">
                      {" "}
                      <figure>
                        {" "}
                        <img
                          src="../assets/images/default-agnet.jpg"
                          alt="Default Agent"
                        />{" "}
                      </figure>{" "}
                    </Link>{" "}
                  </li>
                )}
                {user?.userType === "sub_owner" && (
                  <li>
                    <Link to="/offer">
                      {" "}
                      <figure>
                        {" "}
                        <img
                          src="../assets/images/promotional.jpeg"
                          alt="Promotional"
                        />{" "}
                      </figure>{" "}
                    </Link>{" "}
                  </li>
                )}
                {user?.userType === "sub_owner" && (
                  <li>
                    <Link to="#" onClick={changeDepositToggle}>
                      {" "}
                      <figure>
                        {" "}
                        <img
                          src="../assets/images/dw-limit.png"
                          alt="DW Setting"
                        />{" "}
                      </figure>{" "}
                    </Link>{" "}
                  </li>
                )}
                {/* ) : (
                  ""
                )} */}
              </ul>
            </div>
            {user.userType == "owner" || user.userType == "sub_owner" && (
              <>
                <div className="setting_dashboard_block">
                  <h2 className="common-heading">Match And Bets</h2>
                  <ul>
                    <li>
                      <Link to="/active-match">
                        {" "}
                        <figure>
                          {" "}
                          <img
                            src="../assets/images/activelist-.png"
                            alt="active list"
                          />{" "}
                        </figure>{" "}
                      </Link>{" "}
                    </li>
                    <li>
                      <Link to="/in-active-match">
                        {" "}
                        <figure>
                          {" "}
                          <img
                            src="../assets/images/inactivelist.png"
                            alt="inactive list"
                          />{" "}
                        </figure>{" "}
                      </Link>{" "}
                    </li>
                    {user?.userType === "owner" && (
                      <li>
                        <Link to="/rejected-bets">
                          {" "}
                          <figure>
                            {" "}
                            <img
                              src="../assets/images/rejectbet.png"
                              alt="reject bet"
                            />{" "}
                          </figure>{" "}
                        </Link>{" "}
                      </li>
                    )}
                    <li>
                      <Link to="/updateFancyStatus">
                        {" "}
                        <figure>
                          {" "}
                          <img
                            src="../assets/images/updatestatus.png"
                            alt="update status"
                          />{" "}
                        </figure>{" "}
                      </Link>{" "}
                    </li>
                    <li>
                      <Link to="/SuspendedResult">
                        {" "}
                        <figure>
                          {" "}
                          <img
                            src="../assets/images/suspendresult.png"
                            alt="suspend result"
                          />{" "}
                        </figure>{" "}
                      </Link>{" "}
                    </li>
                  </ul>
                </div>
                {user.userType == "owner" ||
                user.userType == "sub_owner" ||
                user.userType == "agent" ? (
                  <>
                    <div className="setting_dashboard_block">
                      <h2 className="common-heading">Message Settings</h2>
                      <ul>
                        {/* user.userType == "super_admin" || */}
                        {user.userType == "owner" ||
                        user.userType == "sub_owner" ||
                        user.userType == "agent" ? (
                          <li>
                            <Link to="/user-message">
                              {" "}
                              <figure>
                                {" "}
                                <img
                                  src="../assets/images/usermessage.png"
                                  alt="user message"
                                />{" "}
                              </figure>{" "}
                            </Link>{" "}
                          </li>
                        ) : (
                          ""
                        )}
                        {user.userType == "owner" ? (
                          <li>
                            <Link to="/hyper-message">
                              {" "}
                              <figure>
                                {" "}
                                <img
                                  src="../assets/images/hypermessage.png"
                                  alt="hyper message"
                                />{" "}
                              </figure>{" "}
                            </Link>{" "}
                          </li>
                        ) : (
                          ""
                        )}
                        {user.userType == "owner" ? (
                          <li>
                            <Link to="/importantmessage">
                              {" "}
                              <figure>
                                {" "}
                                <img
                                  src="../assets/images/impmessage.png"
                                  alt="important message"
                                />{" "}
                              </figure>{" "}
                            </Link>{" "}
                          </li>
                        ) : (
                          ""
                        )}
                      </ul>
                    </div>
                  </>
                ) : (
                  ""
                )}

                {/* {(user.userType == "owner" || user.userType == "sub_owner" )&& ( */}
                <>
                  <div className="setting_dashboard_block">
                    <h2 className="common-heading">User Settings</h2>
                    <ul>
                      <li>
                        <Link to="/inactive-users">
                          {" "}
                          <figure>
                            {" "}
                            <img
                              src="../assets/images/inactiveusers.png"
                              alt="inactive users"
                            />{" "}
                          </figure>{" "}
                        </Link>{" "}
                      </li>
                      <li>
                        <Link to="/BetLockUser">
                          {" "}
                          <figure>
                            {" "}
                            <img
                              src="../assets/images/betlockuser.png"
                              alt="bet lock user"
                            />{" "}
                          </figure>{" "}
                        </Link>{" "}
                      </li>
                    </ul>
                  </div>
                </>
                {/* )} */}
              </>
            )}
          </div>
        </Container>
      </section>

      {/* change-password */}

      <ResetPassword
        changePassword={changePassword}
        changePasswordToggle={changePasswordToggle}
        onSubmit={onSubmit}
        isLoader={isLoader}
        password_same={password_same}
      />

      {/* change-password */}
      <DepositForm
        deposit={deposit}
        changeDepositToggle={changeDepositToggle}
        isLoader={isLoader}
        setLoader={setLoader}
        setDeposit={setDeposit}
        profileData={profileData}
        getProfileData={getProfileData}
      />
      {/* deposit-chip */}

      <Modal
        show={depositChip}
        onHide={depositChipToggle}
        className="change-status-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-status h4">
            Deposit Chips
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="test-status border-0">
            <Form
              className="change-password-sec"
              onSubmit={handleSubmit1(onSubmit1)}
            >
              <Form.Group className=" mb-2">
                <h4 className="modal-title-status h4 text-center mb-3">
                  Current Balance : {helpers.currencyFormat(user_coin_balance)}{" "}
                  BDT
                </h4>
                <Form.Control
                  type="number"
                  placeholder="Enter Coins"
                  className={
                    errors1.coins
                      ? " w-sm-50 m-auto is-invalid "
                      : "w-sm-50 m-auto"
                  }
                  {...register1("coins", {
                    required: "Please enter coins",
                    pattern: {
                      value: /^[1-9]\d*(\.\d+)?$/,
                      message: "Please enter valid number.",
                    },
                  })}
                />
                {errors1.coins && errors1.coins.message && (
                  <label className="invalid-feedback text-left">
                    {errors1.coins.message}
                  </label>
                )}
              </Form.Group>
              <Form.Group className=" mb-2">
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  className={
                    errors1.mypassword
                      ? " w-sm-50 m-auto is-invalid "
                      : "w-sm-50 m-auto"
                  }
                  {...register1("mypassword", {
                    required: "Please enter password",
                  })}
                />
                {errors1.mypassword && errors1.mypassword.message && (
                  <label className="invalid-feedback text-left">
                    {errors1.mypassword.message}
                  </label>
                )}
              </Form.Group>

              <div className="text-center mt-4">
                <Button type="submit" className="green-btn">
                  {isLoader ? "Loading..." : "Deposit"}
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>

      {/* deposit-chip */}
    </div>
  );
};

export default GeneralSetting;
