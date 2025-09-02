import React, { useContext, useState } from "react";
import { Container, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const SurveillanceSetting = () => {

  let { user } = useContext(AuthContext);

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="setting_dashboard">
            <div className="setting_dashboard_block surveliance-setting-sec">
              <h2 className="common-heading">Surveillance Settings</h2>
              <ul>
              {user?.userType === 'owner' && user?.username === 'superjohndoe' && (
                <>
                <li>
                  <Link to="/LiveMatchBet">
                    {" "}
                    <figure>
                      {" "}
                      <img src="../assets/images/livemarketbet.png" />{" "}
                    </figure>{" "}
                  </Link>{" "}
                </li>
                </>)}
                <li>
                  <Link to="/BetLockUser">
                    {" "}
                    <figure>
                      {" "}
                      <img src="../assets/images/betlockuser.png" />{" "}
                    </figure>{" "}
                  </Link>{" "}
                </li>
                {/* <li>
                  <Link to="/BetCount">
                    {" "}
                    <figure>
                      {" "}
                      <img src="../assets/images/cheatbet.png" />{" "}
                    </figure>{" "}
                  </Link>{" "}
                </li> */}
                <li>
                  <Link to="/PlayerBalance">
                    {" "}
                    <figure>
                      {" "}
                      <img src="../assets/images/playerbalance.png" />{" "}
                    </figure>{" "}
                  </Link>{" "}
                </li>
                <li>
                  <Link to="/userProfitLoss">
                    {" "}
                    <figure>
                      {" "}
                      <img src="../assets/images/userpl.png" />{" "}
                    </figure>{" "}
                  </Link>{" "}
                </li>
                <li>
                  <Link to="/PreMatch">
                    {" "}
                    <figure>
                      {" "}
                      <img src="../assets/images/prematch.png" />{" "}
                    </figure>{" "}
                  </Link>{" "}
                </li>
                <li>
                  <Link to="/SearchMatch">
                    {" "}
                    <figure>
                      {" "}
                      <img src="../assets/images/searchmatch.png" />{" "}
                    </figure>{" "}
                  </Link>{" "}
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default SurveillanceSetting;
