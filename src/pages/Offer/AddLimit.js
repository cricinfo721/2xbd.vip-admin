import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { apiPost, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
const AddLimit = ({ onClose, id, object, getData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  const onSubmit = async (body) => {
    const { status, data: response_users } = await apiPut(
      `${apiPath.editProfile}/${id}`,
      { limitSetting: [body] }
    );
    if (status == 200) {
      if (response_users.success) {
        getData();
        onClose();
      }
    }
  };
  useEffect(() => {
    if (object?.length > 0) {
      setValue("minDeposit", object[0]?.minDeposit);
      setValue("maxDeposit", object[0]?.maxDeposit);
      setValue("minWithdraw", object[0]?.minWithdraw);
      setValue("maxWithdraw", object[0]?.maxWithdraw);
    }
  }, [object]);

  return (
    <Modal size="lg" show={true} onHide={onClose}>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="modal-title-status">
          Set Deposit / Withdraw Limit
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              {" "}
              <Col sm={12} lg={6} md={6} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Min Deposit
                    </span>
                    <Form.Control
                      type="number"
                      placeholder="Min Deposit"
                      className={
                        errors.minDeposit ? " is-invalid mt-1" : "mt-1"
                      }
                      {...register("minDeposit", {
                        required: "Please enter Min Deposit",
                      })}
                    />
                    {errors.minDeposit && errors.minDeposit.message && (
                      <label className="invalid-feedback text-left">
                        {errors.minDeposit.message}
                      </label>
                    )}
                  </div>
                </Form.Group>
              </Col>{" "}
              <Col sm={12} lg={6} md={6} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Max Deposit
                    </span>
                    <Form.Control
                      type="number"
                      placeholder="Max Deposit"
                      className={
                        errors.maxDeposit ? " is-invalid mt-1" : "mt-1"
                      }
                      {...register("maxDeposit", {
                        required: "Please enter Max Deposit",
                      })}
                    />
                    {errors.maxDeposit && errors.maxDeposit.message && (
                      <label className="invalid-feedback text-left">
                        {errors.maxDeposit.message}
                      </label>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col sm={12} lg={6} md={6} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Min Withdraw
                    </span>
                    <Form.Control
                      type="number"
                      placeholder="Min Withdraw"
                      className={
                        errors.minWithdraw ? " is-invalid mt-1" : "mt-1"
                      }
                      {...register("minWithdraw", {
                        required: "Please enter Min Withdraw",
                      })}
                    />
                    {errors.minWithdraw && errors.minWithdraw.message && (
                      <label className="invalid-feedback text-left">
                        {errors.minWithdraw.message}
                      </label>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col sm={12} lg={6} md={6} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Max Withdraw
                    </span>
                    <Form.Control
                      type="number"
                      placeholder="Max Withdraw"
                      className={
                        errors.maxWithdraw ? " is-invalid mt-1" : "mt-1"
                      }
                      {...register("maxWithdraw", {
                        required: "Please enter Max Withdraw",
                      })}
                    />
                    {errors.maxWithdraw && errors.maxWithdraw.message && (
                      <label className="invalid-feedback text-left">
                        {errors.maxWithdraw.message}
                      </label>
                    )}
                  </div>
                </Form.Group>
              </Col>
        
            </Row>

            <div className="d-flex justify-content-end align-items-center mt-1">
              <Button
                type="submit"
                className="green-btn"
                style={{ color: "black" }}
              >
                Submit
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                type="button"
                onClick={() => onClose()}
                className="theme_light_btn btn btn-primary"
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddLimit;
