import React, { useState } from "react";
import { Container, Col, Row, Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiGet, apiPost } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import helpers from "../utils/helpers";
import { useForm } from "react-hook-form";
import { toast } from "wc-toast";
const PlayerBalance = () => {
  const [data, setData] = useState({});
  const [keyword, setKeyword] = useState("");
  const getData = async () => {
    const { status, data: response_users } = await apiGet(
      `${apiPath.userProfile}?user_id=${keyword}`
    );
    if (status === 200) {
      if (response_users.success) {
        setData(response_users?.results);
      }
    }
  };
  const [isLoading, setisLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});
  const handleFormSubmit = async (formData) => {
    setisLoading(true);
    let dataObj = { coins: formData?.amount, userId: data?._id };
    const { data: response_data, status } = await apiPost(
      apiPath.depositAmount,
      dataObj
    );
    if (status === 200) {
      if (response_data.success) {
        toast.success(response_data.message);
        reset();
        setisLoading(false);
      } else {
        setisLoading(false);
        toast.error(response_data.message);
      }
    } else {
      setisLoading(false);
      toast.error(response_data.message);
    }
  };
  return (
    <div>
      <section className="py-4 main-inner-outer">
        <Container fluid>
          <div className="inner-wrapper">
            <h2 className="common-heading">Balance Summary</h2>

            <div className="find-member-sec">
              <Form className="mb-4">
                <Form.Group className="position-relative mb-2">
                  <Form.Control
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Enter User Id..."
                  />
                  <i className="fas fa-search"></i>
                </Form.Group>
                <div className="d-flex flex-wrap block-search-sec">
                  <Button className="mb-2 mx-1 theme_dark_btn" onClick={getData}>
                    Search
                  </Button>
                  <Link to={`/statements/${keyword}`}>
                    {" "}
                    <Button className="mb-2 mx-1 theme_light_btn">Statement</Button>
                  </Link>
                </div>
              </Form>
            </div>

            <section className="account-table">
              <div className="profile-tab">
                <Row>
                  <Col lg={7} md={12}>
                    <h2 className="common-heading">Profile</h2>

                    <Table>
                      <thead>
                        <tr>
                          <th scope="col" colSpan="4" className="text-start">
                            About Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.userType === "user" && (
                          <tr>
                            <td className="text-start" width="25%">
                              Profile & Loss
                            </td>
                            <td className="text-start" colSpan="3">
                              {data.totalCoins ? (
                                <span
                                  style={{
                                    color:
                                      data.totalCoins - data.creditReference >=
                                      0
                                        ? "green"
                                        : "red",
                                  }}
                                >
                                  {helpers.currencyFormat(
                                    Math.abs(
                                      data.totalCoins - data.creditReference
                                    )
                                  )}
                                </span>
                              ) : (
                                <span>--</span>
                              )}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td className="text-start" width="25%">
                            Deposit
                          </td>
                          <td className="text-start" colSpan="3">
                            {data?.playerBalance
                              ? helpers.currencyFormat(data?.playerBalance)
                              : "--"}
                          </td>
                        </tr>

                        <tr>
                          <td className="text-start" width="25%">
                            Withdraw
                          </td>
                          <td className="text-start" colSpan="3">
                            {data?.playerBalance
                              ? helpers.currencyFormat(data?.playerBalance)
                              : "--"}
                          </td>
                        </tr>

                        <tr>
                          <td className="text-start" width="25%">
                            Balance
                          </td>
                          <td className="text-start" colSpan="3">
                            {data?.totalCoins
                              ? helpers.currencyFormat(data?.totalCoins)
                              : "--"}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                    {data?.userType === "user" && (
                      <Table>
                        <thead>
                          <tr>
                            <th scope="col" colSpan="4" className="text-start">
                              Liab Details
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-start" width="25%">
                              Liability
                            </td>
                            <td className="text-start" colSpan="3">
                              {data?.totalCoins
                                ? helpers.currencyFormat(data?.totalCoins)
                                : "--"}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-start" width="25%">
                              Final Balance
                            </td>
                            <td className="text-start" colSpan="3">
                              {data?.totalCoins
                                ? helpers.currencyFormat(data?.totalCoins)
                                : "--"}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    )}
                    <Table>
                      <thead>
                        <tr>
                          <th scope="col" colSpan="4" className="text-start">
                            Profile Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-start" width="25%">
                            Current Balance
                          </td>
                          <td className="text-start" colSpan="3">
                            {data?.totalCoins
                              ? helpers.currencyFormat(data?.totalCoins)
                              : "--"}
                          </td>
                        </tr>
                      </tbody>
                    </Table>

                    <Table>
                      <thead>
                        <tr>
                          <th scope="col" colSpan="4" className="text-start">
                            To Be Deposited
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-start" width="50%" colSpan="1">
                            <Form
                              onSubmit={handleSubmit(handleFormSubmit)}
                              className=""
                            >
                              <Form.Control
                                type="text"
                                disabled={true}
                                placeholder="Amount"
                                className={errors.amount ? " is-invalid " : ""}
                                {...register("amount", {
                                  required: "Please enter amount",
                                  min: {
                                    value: 1,
                                    message:
                                      " Amount should be greater then 0",
                                  },
                                })}
                              />
                              {errors.amount && errors.amount.message && (
                          <label className="invalid-feedback text-left">
                            {errors.amount.message}
                          </label>
                        )}
                              <button
                                disabled={true}
                                  // isLoading ? true : false}
                                type="submit"
                                className="btn theme_dark_btn mt-3"
                              >
                                Submit
                              </button>
                            </Form>
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
            </section>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default PlayerBalance;
