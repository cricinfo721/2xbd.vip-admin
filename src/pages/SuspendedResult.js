import React, { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
const SuspendedResult = () => {
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="setting_dashboard">
            <div className="setting_dashboard_block">
              <h2 className="common-heading">Suspended Result</h2>
              <ul>
                <li>
                  <Link to="/SuspendedFancyResult">
                    {" "}
                    <figure>
                      {" "}
                      <img src="../assets/images/susfancyres.png" />{" "}
                    </figure>{" "}
                  </Link>{" "}
                </li>
                <li>
                  <Link to="/SuspendedMarketResult">
                    {" "}
                    <figure>
                      {" "}
                      <img src="../assets/images/susmarketres.png" />{" "}
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

export default SuspendedResult;
