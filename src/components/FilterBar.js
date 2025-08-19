import React, { useState } from "react";
import { Col, Row, Form } from "react-bootstrap";
export const FilterBar = ({ filter, setFilter, getData }) => {
  return (
    <Form className="bet_status">
      <Row>
        <Col md={12}>
          <Row>
            <Col lg={4} sm={6} xs={12} className="mb-sm-0 mb-3">
              <div className="bet-sec">
                <Form.Label className="mt-2 me-2">Bet Status:</Form.Label>
                <Form.Select
                  className="small_select"
                  onChange={(e) =>
                    setFilter({ ...filter, status: e.target.value })
                  }
                  value={filter.status}
                  aria-label="Default select example"
                >
                  <option value="unmatched">Unmatched</option>
                  <option value="matched">Matched</option>
                  <option value="completed">Settled</option>
                  <option value="suspend">Cancelled</option>
                  <option value="voided">Voided</option>
                </Form.Select>
              </div>
            </Col>

            <Col lg={4} sm={6} xs={12} className="mb-sm-0 mb-3">
              <div className="bet-sec bet-period">
                <Form.Label>Period</Form.Label>
                <Form.Group className="form-group">
                  <Form.Control
                    type="date"
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        fromPeriod: e.target.value,
                        filterByDay: "",
                      })
                    }
                    max={new Date().toISOString().split("T")[0]}
                    value={filter.fromPeriod}
                  />
                  <Form.Control
                    className="small_form_control"
                    type="text"
                    placeholder="00:00"
                    disabled
                  />
                </Form.Group>
              </div>
            </Col>
            <Col lg={4} sm={6} xs={12} className="mb-sm-0 mb-3">
              <div className="bet-sec bet-period">
                <Form.Label>Period</Form.Label>
                <Form.Group className="form-group">
                  <Form.Control
                    type="date"
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        toPeriod: e.target.value,
                        filterByDay: "",
                      })
                    }
                    min={
                      filter?.fromPeriod
                        ? new Date(filter?.fromPeriod)
                            .toISOString()
                            .split("T")[0]
                        : new Date()
                    }
                    max={new Date().toISOString().split("T")[0]}
                    value={filter.toPeriod}
                  />
                  <Form.Control
                    className="small_form_control"
                    type="text"
                    placeholder="23:59"
                    disabled
                  />
                </Form.Group>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      <div className="history-btn mt-3">
        <ul className="list-unstyled mb-0">
          <li>
            <a
              onClick={(e) =>
                setFilter({
                  ...filter,
                  filterByDay: "today",
                })
              }
              style={{
                // background: filter.filterByDay === "today" ? "#ffa00c" : "",
                cursor: "pointer",
                // color: filter.filterByDay === "today" ? "#222" : "",
              }}
            >
              Just For Today
            </a>
          </li>
          <li>
            <a
              onClick={(e) =>
                setFilter({
                  ...filter,
                  filterByDay: "yesterday",
                })
              }
              style={{
                // background: filter.filterByDay === "yesterday" ? "#ffa00c" : "",
                cursor: "pointer",
                // color: filter.filterByDay === "yesterday" ? "#222" : "",
              }}
            >
              From Yesterday
            </a>
          </li>
          <li>
            <span
              className="btn theme_dark_btn cursor-pointer"
              style={{
                cursor: "pointer",
              }}
              onClick={() => getData()}
            >
              Get History
            </span>
          </li>
          <li>
            <span
              className="btn theme_dark_btn cursor-pointer"
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                setFilter({
                  ...filter,
                  toPeriod: "",
                  fromPeriod: "",
                  filterByDay: "",
                });
                getData("reset");
              }}
            >
              Reset
            </span>
          </li>
        </ul>
      </div>
    </Form>
  );
};
