import React from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";

const SearchMatch = () => {
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Search Match</h2>
          </div>

          <div className="find-member-sec">
            <Form className="mb-4">
              <Form.Group className="position-relative mb-2">
                <Form.Control type="text" placeholder="Enter User Id..." />
                <i className="fas fa-search"></i>
              </Form.Group>
              <div className="d-flex flex-wrap block-search-sec">
                <Button className="mb-2 mx-1 theme_dark_btn">Search</Button>
                <Button className="mb-2 mx-1 theme_light_btn">
                  Live Report
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
                          <th scope="col">MarketId </th>
                          <th scope="col">Open Date</th>
                          <th scope="col">Name</th>
                          <th scope="col">Sport</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>--</td>
                          <td>--</td>
                          <td>--</td>
                          <td>--</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default SearchMatch;
