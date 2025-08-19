import React, { useState, useEffect, useMemo } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { toast } from "wc-toast";
import { useForm } from "react-hook-form";
import { apiPost, apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { debounce, pick, startCase } from "lodash";
import constants from "../../utils/constants";

const Add = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      timeZone: "Asia/Kolkata",
      commission: 0,
      exposureLimit: 1000,
    },
  });
  const [password_same, set_password_same] = useState();
  const [isLoader, setLoader] = useState(false);
  const [metaData, setMetaData] = useState();
  const onSubmit = async (request) => {
   
    
      let obj;
      if (props.slug === "agent") {
        obj = pick(request, [
          "website",
          "email",
          "username",
          "password",
          "userType",
          //"firstName",
          //"lastName",
          //"phone",
          "timeZone",
          "commission",
          // "amount",
          "exposureLimit",
        ]);
      } else {
        obj = pick(request, [
          "website",
          "email",
          "username",
          "password",
          "userType",
          "commission",
          //"firstName",
          //"lastName",
          //"phone",
          "timeZone",
        ]);
      }
      setLoader(true);
      set_password_same(true);

      if (request.password !== request.confirmPassword) {
        set_password_same(false);
      } else {
        /**
         * ! request.userType = "super_admin";
         * * This should be managed by Backend.
         */
        try {
          const { status, data: response_users } = await apiPost(
            apiPath.addProfile,
            { ...obj, createdBy: props.id }
          );
          if (status === 200) {
            if (response_users.success) {
              setLoader(false);
              props.setShowModel();
              props.refreshUsers();
              toast.success(response_users.message);
              reset();
            } else {
              setLoader(false);
              toast.error(response_users.message);
            }
          } else {
            setLoader(false);
            toast.error(response_users.message);
          }
        } catch (err) {
          setLoader(false);
          toast.error(err.response.data.message);
        }
      }
    
  };

  const getMetaData = async () => {
    const { status, data: response_users } = await apiGet(apiPath.metaData);
    if (status === 200) {
      if (response_users.success) {
        setMetaData(response_users.results);
      }
    }
  };

  useEffect(() => {
    getMetaData();
  }, []);

 
  return (
    <div>
      <Modal
        show={true}
        onHide={() => {
          props.setShowModel();
        }}
        className="super-admin-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="modal-title-status">
            Add {startCase(constants.user_next_status[props.slug])}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="super-admin-form" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              {constants.user_next_status[props.slug] == "sub_owner" && (
                <Col md={12} className="mb-2 mb-md-3">
                  <Form.Group className="row">
                    <Col md={4}>
                      <Form.Label>Select Website</Form.Label>
                    </Col>
                    <Col md={8}>
                      <Form.Select
                        aria-label="Default select example"
                        className={errors.website ? " is-invalid " : ""}
                        {...register("website", {
                          required: "Please select website",
                        })}
                      >
                        <option value="">Please select webiste</option>
                        {metaData &&
                          metaData["websiteList"] &&
                          metaData["websiteList"].map((item, key) => (
                            <option value={item.domain} key={key}>
                              {item.domain}
                            </option>
                          ))}
                      </Form.Select>
                      {errors.website && errors.website.message && (
                        <label className="invalid-feedback text-left">
                          {errors.website.message}
                        </label>
                      )}
                    </Col>
                  </Form.Group>
                </Col>
              )}
              <Col sm={12} className="mb-2 mb-md-3">
                <Form.Group className="row">
                  <Col md={4}>
                    <Form.Label>Email</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="email"
                      placeholder="Enter Email"
                      className={errors.email ? " is-invalid " : ""}
                      {...register("email", {
                        required: "Please enter email",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address.",
                        },
                      })}
                    />
                    {errors.email && errors.email.message && (
                      <label className="invalid-feedback text-left">
                        {errors.email.message}
                      </label>
                    )}
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={12} className="mb-2 mb-md-3">
                <Form.Group className="row d-flex">
                  <Col md={4}>
                    <Form.Label>Username</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      autoComplete={false}
                      className={errors.username ? " is-invalid " : ""}
                      {...register("username", {
                        required: "Please enter username",
                        minLength: {
                          value: 2,
                          message:
                            "Username should contain at least 2 characters.",
                        },
                        maxLength: {
                          value: 30,
                          message:
                            "Username should contain at least 30 characters.",
                        },
                       
                      })}
                    />
                    {errors.username && errors.username.message && (
                      <label className="invalid-feedback text-left">
                        {errors.username.message}
                      </label>
                    )}
                  </Col>
                  {/* <Col md={2}>
                    <Button className="theme_dark_btn">Check</Button>
                  </Col> */}
                </Form.Group>
              </Col>

              <Col sm={12} className="mb-2 mb-md-3">
                <Form.Group className="row">
                  <Col md={4}>
                    <Form.Label>Password</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="password"
                      placeholder="Enter Password"
                      className={errors.password ? " is-invalid " : ""}
                      {...register("password", {
                        required: "Please enter password",
                        minLength: {
                          value: 8,
                          message:
                            "Password should contain atleast 8 characters",
                        },
                        maxLength: {
                          value: 16,
                          message:
                            "Password should contain maximum 16 characters",
                        },
                        // pattern: {
                        //   value:
                        //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                        //   message:
                        //     "Your password should contain at-least 1 Uppercase, 1 Lowercase, 1 Numeric and 1 special character",
                        // },
                      })}
                    />
                    {errors.password && errors.password.message && (
                      <label className="invalid-feedback text-left">
                        {errors.password.message}
                      </label>
                    )}
                  </Col>
                </Form.Group>
              </Col>

              <Col sm={12} className="mb-2 mb-md-3">
                <Form.Group className="row">
                  <Col md={4}>
                    <Form.Label>Confirm Password</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      className={errors.confirmPassword ? " is-invalid " : ""}
                      {...register("confirmPassword", {
                        required: "Please enter confirm password",
                      })}
                    />
                    {errors.confirmPassword &&
                      errors.confirmPassword.message && (
                        <label className="invalid-feedback text-left">
                          {errors.confirmPassword.message}
                        </label>
                      )}
                    {password_same === false &&
                      errors.confirmPassword !== "" && (
                        <label className="invalid-feedback text-left">
                          Password does not match.
                        </label>
                      )}
                  </Col>
                </Form.Group>
              </Col>

              {/* <Col sm={12} className="mb-2 mb-md-3">
                <Form.Group className="row">
                  <Col md={4}>
                    <Form.Label>First Name</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      placeholder="Enter FirstName"
                      className={errors.firstName ? " is-invalid " : ""}
                      {...register("firstName", {
                        required: "Please enter first name",
                        minLength: {
                          value: 2,
                          message:
                            "Firstname should contain at least 2 characters.",
                        },
                        maxLength: {
                          value: 30,
                          message:
                            "Firstname should contain at least 30 characters.",
                        },
                      })}
                    />
                    {errors.firstName && errors.firstName.message && (
                      <label className="invalid-feedback text-left">
                        {errors.firstName.message}
                      </label>
                    )}
                  </Col>
                </Form.Group>
              </Col> */}

              {/* <Col sm={12} className="mb-2 mb-md-3">
                <Form.Group className="row">
                  <Col md={4}>
                    <Form.Label>Last Name</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      placeholder="Enter LastName"
                      className={errors.lastName ? " is-invalid " : ""}
                      {...register("lastName", {
                        required: "Please enter last name",
                        minLength: {
                          value: 2,
                          message:
                            "Lastname should contain at least 2 characters.",
                        },
                        maxLength: {
                          value: 30,
                          message:
                            "Lastname should contain at least 30 characters.",
                        },
                      })}
                    />
                    {errors.lastName && errors.lastName.message && (
                      <label className="invalid-feedback text-left">
                        {errors.lastName.message}
                      </label>
                    )}
                  </Col>
                </Form.Group>
              </Col> */}
              {/* <Col sm={12} className="mb-2 mb-md-3">
                <Form.Group className="row">
                  <Col md={4}>
                    <Form.Label>Phone</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      placeholder="Enter Phone Number"
                      className={errors.phone ? " is-invalid " : ""}
                      {...register("phone", {
                        required: "Please enter phone number",
                        minLength: {
                          value: 7,
                          message:
                            "Phone number should contain at least 7 digits.",
                        },
                        maxLength: {
                          value: 15,
                          message: "Phone number should not exceed 15 digits.",
                        },
                        pattern: {
                          value: /^[0-9\b]+$/i,
                          message: "Phone number format is invalid.",
                        },
                      })}
                    />
                    {errors.phone && errors.phone.message && (
                      <label className="invalid-feedback text-left">
                        {errors.phone.message}
                      </label>
                    )}
                  </Col>
                </Form.Group>
              </Col> */}
 {props.slug == "sub_owner" && (
                <Col sm={12} className="mb-2 mb-md-3">
                  <Form.Group className="row">
                    <Col md={4}>
                      <Form.Label>Commission (%)</Form.Label>
                    </Col>
                    <Col md={8}>
                      <Form.Control
                        type="number"
                        min="10"
                        max="100"
                        placeholder="Enter commission"
                        className={errors.commission ? " is-invalid " : ""}
                        {...register("commission", {
                          required: "Please enter commission",
                        })}
                      />
                      {errors.commission && errors.commission.message && (
                        <label className="invalid-feedback text-left">
                          {errors.commission.message}
                        </label>
                      )}
                    </Col>
                  </Form.Group>
                </Col>
              )}

             
              {(props.slug == "super_agent" || props.slug == "super_admin") && (
                <Col sm={12} className="mb-2 mb-md-3">
                  <Form.Group className="row">
                    <Col md={4}>
                      <Form.Label>Commission (%)</Form.Label>
                    </Col>
                    <Col md={8}>
                      <Form.Control
                        type="number"
                        min="10"
                        max={props?.user?.saCutShare}
                        autoComplete="off"
                        placeholder="Enter commission"
                        className={errors.commission ? " is-invalid " : ""}
                        {...register("commission", {
                          required: "Please enter commission",
                        })}
                      />
                      {errors.commission && errors.commission.message && (
                        <label className="invalid-feedback text-left">
                          {errors.commission.message}
                        </label>
                      )}
                    </Col>
                  </Form.Group>
                </Col>
              )}
              <Col sm={12} className="mb-2 mb-md-3">
                <Form.Group className="row">
                  <Col md={4}>
                    <Form.Label>Select Time Zone</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Select
                      aria-label="Default select example"
                      className={errors.timeZone ? " is-invalid " : ""}
                      {...register("timeZone", {
                        required: "Please select time zone",
                      })}
                    >
                      {/* <option value="">Please select time zone</option> */}
                      {metaData &&
                        metaData["timeZoneList"] &&
                        metaData["timeZoneList"].map((item, key) => (
                          <option value={item.tz} key={key}>
                            {item.tz}
                          </option>
                        ))}
                    </Form.Select>
                    {errors.timeZone && errors.timeZone.message && (
                      <label className="invalid-feedback text-left">
                        {errors.timeZone.message}
                      </label>
                    )}
                  </Col>
                </Form.Group>
              </Col>
              {props.slug === "agent" && (
                <>
                  
                  <Col sm={12} className="mb-2 mb-md-3">
                    <Form.Group className="row">
                      <Col md={4}>
                        <Form.Label>Exposure Limit</Form.Label>
                      </Col>
                      <Col md={8}>
                        <Form.Control
                          type="number"
                          placeholder="Enter Exposure Limit"
                          className={errors.exposureLimit ? " is-invalid " : ""}
                          {...register("exposureLimit", {
                            required: "Please enter Exposure Limit",
                          })}
                        />
                        {errors.exposureLimit &&
                          errors.exposureLimit.message && (
                            <label className="invalid-feedback text-left">
                              {errors.exposureLimit.message}
                            </label>
                          )}
                      </Col>
                    </Form.Group>
                  </Col>
                </>
              )}
            </Row>

            <Form.Group className="mt-3 text-center">
              <Button
                type="submit"
                disabled={isLoader ? true : false}
                className="theme_dark_btn px-5"
              >
                Create
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Add;
