import React from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";

const Amyaccount = () => {
  return (
    <div>
      <section className="py-4 main-inner-outer">
        <Container fluid>
          <div className="agent-path mb-4">
            <ul className="m-0 list-unstyled">
              <li>
                <a href="#">
                  <span>A</span>
                  <strong>admin</strong>
                </a>
              </li>
              <li>
                <a href="#">
                  <span className="sua">SUA</span>
                  <strong>test</strong>
                </a>
              </li>
            </ul>
          </div>
          <div className="accout_cols_outer">
            <div className="left_side">
              <Sidebar />
            </div>

            <div className="right_side">
              <div className="inner-wrapper">
                {/* account-summary */}

                <h2 className="common-heading">Account Summary</h2>

                <div className="bg-white  total-balance-summary">
                  <dt>Total Balance</dt>
                  <strong>
                    9,989,398,602.092 <sub>BDT</sub>
                  </strong>
                </div>

                {/* account-summary */}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Amyaccount;
