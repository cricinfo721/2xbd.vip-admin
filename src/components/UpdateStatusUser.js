import { startCase } from "lodash";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "wc-toast";
import { apiPut } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
const UpdateStatusUser = ({
  changeStatus,
  setChangeStatusToggle,
  userData,
  getActiveClass,
  setActiveClass,
  getUsers,
  currentStatus,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});
  const [isLoader, setLoader] = useState(false);
  const handleUserStatus = (status) => {
    setActiveClass(status);
  };
  const onSubmit = async (request) => {
    if (getActiveClass) {
      setLoader(true);
      try {
        const { status, data: response_users } = await apiPut(
          apiPath.profileChangeStatus + "/" + userData._id,
          { status: getActiveClass, password: request.password }
        );
        if (status === 200) {
          if (response_users.success) {
            setLoader(false);
            toast.success(response_users.message);
            setChangeStatusToggle();
            getUsers();
            reset();
          } else {
            setLoader(false);
            toast.error(response_users.message);
          }
        }
      } catch (err) {
        setLoader(false);
        toast.error(err?.response?.data?.message);
      }
    } else {
      toast.error("Please select status");
    }
  };
  return (
    <Modal
      show={changeStatus}
      onHide={setChangeStatusToggle}
      className="change-status-modal"
    >
      <Modal.Header closeButton className="border-0 p-0 pb-0">
        <Modal.Title className="modal-title-status">Change Status</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-0">
        <div className="test-status">
          <div className="status-row d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              <span>{userData?.userType}</span> {userData?.username}
            </h6>

            {currentStatus == "downline" && (
              <small>{startCase(userData?.status)}</small>
            )}
          </div>

          <div className="changestatus-option">
            <ul className="list-unstyled mb-0 justify-content-around">
              {currentStatus == "downline" ? (
                <li
                  className={getActiveClass === "active" ? "active" : ""}
                  onClick={() => {
                    handleUserStatus("active");
                  }}
                >
                  <a href="#">
                    <i className="far fa-check-circle"></i>
                    <span>Active</span>
                  </a>
                </li>
              ) : currentStatus !== "active" ? (
                <li
                  className={getActiveClass === "active" ? "active" : ""}
                  onClick={() => {
                    handleUserStatus("active");
                  }}
                >
                  <a href="#">
                    <i className="far fa-check-circle"></i>
                    <span>Active</span>
                  </a>
                </li>
              ) : (
                ""
              )}
              {currentStatus !== "suspend" && (
                <li
                  className={getActiveClass === "suspend" ? "suspended" : ""}
                  onClick={() => {
                    handleUserStatus("suspend");
                  }}
                >
                  <a href="#">
                    <i className="fas fa-ban"></i>
                    <span>Suspend</span>
                  </a>
                </li>
              )}
              {currentStatus !== "locked" && (
                <li
                  className={getActiveClass === "locked" ? "locked" : ""}
                  onClick={() => {
                    handleUserStatus("locked");
                  }}
                >
                  <a href="#">
                    <i className="fas fa-lock"></i>
                    <span>Locked</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="py-3 px-3 change-status-form">
          <Form
            className="d-flex align-items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Form.Group className="d-flex align-items-center f-group">
              <Form.Label className="pe-2 mb-0">Password</Form.Label>
              <div className="witherror">
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  className={errors.password ? " is-invalid " : ""}
                  {...register("password", {
                    required: "Please enter password",
                  })}
                />
                {errors.password && errors.password.message && (
                  <label className="invalid-feedback text-left">
                    {errors.password.message}
                  </label>
                )}
              </div>
            </Form.Group>

            <Button type="submit" className="btn theme_dark_btn">
              {isLoader ? "Loading..." : "Change"}
            </Button>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateStatusUser;
