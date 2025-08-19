import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Modal } from "react-bootstrap";
export const ResetPassword = ({
  changePassword,
  changePasswordToggle,
  onSubmit,
  isLoader,
  password_same,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({});
  const newPassword = useRef({});
  newPassword.current = watch("newPassword", "");
  return (
    <Modal
      show={changePassword}
      onHide={changePasswordToggle}
      className="change-status-modal p-0"
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-status h4">
          Change Password
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="test-status border-0">
          <Form
            className="change-password-sec"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Form.Group className="d-flex  mb-2">
              <Form.Label>Old Password</Form.Label>

              <Form.Control
                type="password"
                placeholder="Enter Old Password"
                className={errors.oldPassword ? " is-invalid " : ""}
                {...register("oldPassword", {
                  required: "Please enter old password",
                  // validate: (value) => {
                  //   if (value === "") {
                  //     return true;
                  //   }
                  //   var paswd =
                  //     "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})";
                  //   if (value.match(paswd)) {
                  //     return true;
                  //   } else {
                  //     return "Old password must have minimum 8 character with 1 lowercase, 1 uppercase, 1 numeric and 1 special character.";
                  //   }
                  // },
                })}
              />
              {errors.oldPassword && errors.oldPassword.message && (
                <label className="invalid-feedback text-left">
                  {errors.oldPassword.message}
                </label>
              )}

            </Form.Group>
            <Form.Group className="d-flex  mb-2">
              <Form.Label>New Password</Form.Label>

              <Form.Control
                type="password"
                placeholder="Enter New Password"
                className={errors.newPassword ? " is-invalid " : ""}
                {...register("newPassword", {
                  required: "Please enter new password",
                  // validate: (value) => {
                  //   if (value === "") {
                  //     return true;
                  //   }
                  //   var paswd =
                  //     "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})";
                  //   if (value.match(paswd)) {
                  //     return true;
                  //   } else {
                  //     return "New Password must have minimum 8 character with 1 lowercase, 1 uppercase, 1 numeric and 1 special character.";
                  //   }
                  // },
                })}
              />
              {errors.newPassword && errors.newPassword.message && (
                <label className="invalid-feedback text-left">
                  {errors.newPassword.message}
                </label>
              )}

            </Form.Group>
            <Form.Group className="d-flex  mb-2">
              <Form.Label>New Password Confirm</Form.Label>

              <Form.Control
                type="password"
                placeholder="Confirm Password"
                className={
                  errors.confirmPassword || password_same === false
                    ? " is-invalid "
                    : ""
                }
                {...register("confirmPassword", {
                  required: "Please enter confirm password",
                  validate: (value) => {
                    if (value === "") {
                      return true;
                    }
                    if (value !== newPassword.current)
                      return "Those passwords didn’t match.";
                  },
                })}
              />
              {errors.confirmPassword && errors.confirmPassword.message && (
                <label className="invalid-feedback text-left">
                  {errors.confirmPassword.message}
                </label>
              )}
              {password_same === false && errors.confirmPassword !== "" && (
                <label className="invalid-feedback text-left">
                  Password does not match.
                </label>
              )}

            </Form.Group>

            <div className="text-center mt-4">
              <Button type="submit" className="green-btn">
                {isLoader ? "Loading..." : "Change"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};
