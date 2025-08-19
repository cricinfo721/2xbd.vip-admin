import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import MyAccountSidebar from "../../components/MyAccountSidebar";
import { apiGet, apiPost } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { pick } from "lodash";
import { useForm } from "react-hook-form";
import Breadcrumbs from "./Breadcrumbs";
import { toast } from "wc-toast";
import { Link } from "react-router-dom";
import { ResetPassword } from "../../components/ResetPassword";
import AuthContext from "../../context/AuthContext";
import helpers from "../../utils/helpers";

const MyProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({});
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState("");
  const [password_same, set_password_same] = useState(true);
  const [isLoader, setLoader] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [code, setCode] = useState({
    status: false,
    item: "",
  });
  const changePasswordToggle = () => setChangePassword(!changePassword);
  const myProfile = async () => {
    const { status, data: response_users } = await apiGet(apiPath.userProfile);
    if (status === 200) {
      if (response_users.success) {
        setProfileData(response_users.results);
      }
    }
  };

  const onSubmit = async (request) => {
    setLoader(true);
    set_password_same(true);

    if (request.newPassword !== request.confirmPassword) {
      setLoader(false);
      set_password_same(false);
    } else {
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
    }
  };

  const updateRefrel = async (request) => {
    const { status, data: response_users } = await apiPost(
      apiPath.updateRefrelCode,
      { referalCode: request?.referalCode }
    );
    if (status === 200) {
      if (response_users.success) {
        toast.success(response_users.message);
        myProfile();
        setCode({ status: false });
        reset();
      } else {
        toast.error(response_users.message);
      }
    }
  };

  useEffect(() => {
    myProfile();
  }, []);
  function copy(text) {
    toast.success("Link Copied!");
    return window.navigator.clipboard.writeText(text);
  }
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
                <h2>profile</h2>
                <div className="account-table">
                  <div className="profile-tab table-color">
                    <Row>
                      <Col md={7}>
                        <Table>
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                colSpan="4"
                                className="text-start"
                              >
                                About You
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="text-start" width="25%">
                                First Name
                              </td>
                              <td className="text-start" colSpan="3">
                                {profileData.firstName}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start" width="25%">
                                Last Name
                              </td>
                              <td className="text-start" colSpan="3">
                                {profileData.lastName}
                              </td>
                            </tr>

                            <tr>
                              <td className="text-start" width="25%">
                                Birthday
                              </td>
                              <td className="text-start" colSpan="3">
                                -----
                              </td>
                            </tr>

                            <tr>
                              <td className="text-start" width="25%">
                                Email
                              </td>
                              <td className="text-start" colSpan="3">
                                {profileData.email}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start" width="25%">
                                Password
                              </td>
                              <td className="text-start">************</td>
                              <td>
                                <Link
                                  to="#"
                                  className="text-decoration-none text-primary btn theme_light_btn"
                                  onClick={changePasswordToggle}
                                >
                                  Edit{" "}
                                  <i className="fas fa-pen text-primary ps-1"></i>
                                </Link>
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start" width="25%">
                                Exposure
                              </td>
                              <td className="text-start" colSpan="3">
                                {profileData.exposure}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start" width="25%">
                                Time Zone
                              </td>
                              <td className="text-start" colSpan="3">
                                {profileData.timeZone}
                              </td>
                            </tr>

                            {user?.userType == "agent" && (
                              <tr>
                                <td className="text-start" width="25%">
                                Referal Code
                                </td>
                                <td
                                  style={{ cursor: "pointer", color: "blue" }}
                                  onClick={() => {
                                    copy(
                                      "https://"+helpers?.getDomain()+"/register?referral_code=" +
                                        profileData?.referalCode
                                    );
                                  }}
                                  className="text-start"
                                >
                                  {profileData?.referalCode
                                    ? "https://"+helpers?.getDomain()+"/register?referral_code=" +
                                      profileData?.referalCode
                                    : "-"}
                                </td>
                                <td>
                                  <Link
                                    to="#"
                                    className="text-decoration-none text-primary btn theme_light_btn"
                                    onClick={() => {
                                      setCode({ ...code, status: true });
                                      setValue(
                                        "referalCode",
                                        profileData?.referalCode
                                      );
                                    }}
                                  >
                                    Edit{" "}
                                    <i className="fas fa-pen text-primary ps-1"></i>
                                  </Link>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Col>

                      <Col md={5}>
                        <Table>
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                colSpan="4"
                                className="text-start"
                              >
                                Contact Details
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="text-start">Primary Number</td>
                              <td className="text-start">
                                {" "}
                                {profileData.phone}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                     
                    </Row>
                    
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <ResetPassword
        changePassword={changePassword}
        changePasswordToggle={changePasswordToggle}
        onSubmit={onSubmit}
        isLoader={isLoader}
        password_same={password_same}
      />

      <Modal
        show={code?.status}
        onHide={() => {
          setCode({ status: false });
        }}
        className="change-status-modal p-0"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-status h4">
            Update Referal Code
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="test-status border-0">
            <Form
              className="change-password-sec"
              onSubmit={handleSubmit(updateRefrel)}
            >
              <Form.Group className="d-flex  mb-2">
                <Form.Control
                  type="text"
                  maxLength={8}
                  placeholder="Referal Code"
                  className={errors.referalCode ? " is-invalid " : ""}
                  {...register("referalCode", {
                    required: "Please enter referal code",
                  })}
                />
                {errors.referalCode && errors.referalCode.message && (
                  <label
                    className="invalid-feedback align-leftt"
                  >
                    {errors.referalCode.message}
                  </label>
                )}
              </Form.Group>

              <div className="text-center mt-4">
                <Button type="submit" className="green-btn">
                  Update
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MyProfile;
