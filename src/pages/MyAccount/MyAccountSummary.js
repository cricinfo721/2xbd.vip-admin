import React, { useContext } from "react";
import { Container, Col, Row } from "react-bootstrap";
import MyAccountSidebar from "../../components/MyAccountSidebar";
import helpers from "../../utils/helpers"
import AuthContext from '../../context/AuthContext'
import Breadcrumbs from './Breadcrumbs';
const MyAccountSummary = () => {

  let {user_coins } = useContext(AuthContext);
  return (
    <div>
      <section className="py-4 main-inner-outer">
        <Container fluid>
        <Breadcrumbs />

          <Row>
            <Col lg={3}>
              <MyAccountSidebar />
            </Col>
            <Col lg={9} md={12}>
              <div className="inner-wrapper">
                {/* account-summary */}

                <h2 className="common-heading">Account Summary</h2>

                <div className="bg-white py-2 px-3 total-balance-summary">
                  <div className="first_cols">
                  <dt>Total Balance</dt>
                  <strong>
                    {helpers.currencyFormat(user_coins)} <sub>BDT</sub>
                  </strong>
                  </div>
                </div>

                {/* account-summary */}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default MyAccountSummary;
