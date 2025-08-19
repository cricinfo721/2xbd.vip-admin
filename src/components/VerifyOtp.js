import React from "react";
import { Modal } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import OtpInput from "react18-input-otp";
import { Form, Button } from "react-bootstrap";
const VerifyOtp = ({ open, onClose, onSubmit,otpNumber }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({  defaultValues: {
    otp: otpNumber?otpNumber:"",
  },});
  return (
    <Modal backdrop="static" size="md" centered show={open} onHide={onClose}>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="mb-2">Verify OTP</h4>
          <Controller
            className="form-group d-flex"
            control={control}
            name="otp"
            rules={{
              required: "Please enter 4 digit OTP",
              validate: (value) => {
                if (value?.toString()?.length == 4) {
                  return true;
                } else {
                  return "Please enter 4 digit OTP";
                }
              },
            }}
            render={({ field: { ref, ...field } }) => (
              <OtpInput
                {...field}
                
                numInputs={4}
                isInputNum={true}
                inputExtraProps={{
                  ref,
                  required: true,
                  autoFocus: true,
                }}
                shouldAutoFocus={true}
                inputStyle={{
                  width: "88%",
                  height: "45px",
                  borderRadius: "7px",
                  border: "1px solid #ced4da",
                }}
                separator={<span> </span>}
              />
            )}
          />
          {errors?.otp?.message && (
            <div className="text-danger" style={{ marginTop: "5px" }}>
              {errors?.otp?.message}
            </div>
          )}
          <Button
            style={{ fontSize: "15px" }}
            type="submit"
            className="green-btn mt-2 theme-btn"
          >
            Verify
            <span>
              <img src="assets/images/loginicon.svg" />
            </span>
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default VerifyOtp;
