import React, { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
const Result = () => {
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="setting_dashboard">
            <div className="setting_dashboard_block">
              <h2 className="common-heading">Set Result</h2>
              <ul>
                <li>
                  <Link to="/FancyResult?eventType=4&status=in_play&eventId=&marketId=&eventName=&keyword=">
                    {" "}
                    <figure>
                      {" "}
                      <img src="../assets/images/setfancyres.png" />{" "}
                    </figure>{" "}
                  </Link>{" "}
                </li>
                <li>
                  <a href="/MarketResult">
                    {" "}
                    <figure>
                      {" "}
                      <img src="../assets/images/setmarketres.png" />{" "}
                    </figure>{" "}
                  </a>{" "}
                </li>
                
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Result;
