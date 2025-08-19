import React from "react";
import { Modal } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import OtpInput from "react18-input-otp";
import { Form, Button } from "react-bootstrap";
const EnterPassword = ({ open, onClose, onSubmit }) => {
  const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({});
  return (
    <Modal backdrop="static" size="md" centered show={open} onHide={onClose}>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="mb-2">Enter Your Password</h4>
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
          <Button
            style={{ fontSize: "15px" }}
            type="submit"
            className="green-btn mt-2 theme-btn"
          >
            Submit
            <span>
              <img src="assets/images/loginicon.svg" />
            </span>
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EnterPassword;
