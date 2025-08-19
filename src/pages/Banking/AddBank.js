import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { toast } from "wc-toast";
import { useForm } from "react-hook-form";
import { apiPost, apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { isEmpty, pick, startCase } from "lodash";
import constants from "../../utils/constants";

const AddBank = ({ type, onClose, data, getData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      type: "withdrawal",
    },
  });

  const onSubmit = async (request) => {
    try {
      const { status, data: response_users } = await apiPost(
        apiPath.addEditBank,
        {
          bank_name: request?.bank_name,
          account_number:
            request?.type == "deposit" ? request?.account_number : "",
          account_name: request?.account_name,
          bankId: type == "edit" ? data?._id : "",
          type: request?.type,
          depositLimit: request?.depositLimit,
        }
      );
      if (status === 200) {
        if (response_users.success) {
          toast.success(response_users.message);
          getData();
          reset();
          onClose();
        } else {
          toast.error(response_users.message);
        }
      } else {
        toast.error(response_users.message);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    if (type == "edit" && !isEmpty(data)) {
      setValue("bank_name", data?.bank_name);
      setValue("account_number", data?.account_number);
      setValue("account_name", data?.account_name);
    }
  }, [type]);
  return (
    <div>
      <Modal show={true} onHide={onClose} className="super-admin-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="modal-title-status">
            {type == "add" ? "Add Bank" : "Edit Bank"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="super-admin-form" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm={12} className="mb-2 mb-md-3">
                <Form.Group className="row">
                  <Col md={4}>
                    <Form.Label>Bank Type</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Select {...register("type")}>
                      <option value="withdrawal">Withdrawal</option>{" "}
                      <option value="deposit">Deposit</option>
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={12} className="mb-2 mb-md-3">
                <Form.Group className="row">
                  <Col md={4}>
                    <Form.Label>Bank Name</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      placeholder="Enter Bank Name"
                      className={errors?.bank_name ? " is-invalid " : ""}
                      {...register("bank_name", {
                        required: "Please enter bank name",
                      })}
                    />
                    {errors?.bank_name && errors?.bank_name?.message && (
                      <label className="invalid-feedback text-left">
                        {errors?.bank_name?.message}
                      </label>
                    )}
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={12} className="mb-2 mb-md-3">
                <Form.Group className="row">
                  <Col md={4}>
                    <Form.Label>Account Name</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      placeholder="Enter account name"
                      className={errors?.account_name ? " is-invalid " : ""}
                      {...register("account_name", {
                        required: "Please enter account name",
                      })}
                    />
                    {errors?.account_name && errors?.account_name?.message && (
                      <label className="invalid-feedback text-left">
                        {errors?.account_name?.message}
                      </label>
                    )}
                  </Col>
                </Form.Group>
              </Col>
              {watch("type") == "deposit" && (
                <>
                <Col sm={12} className="mb-2 mb-md-3">
                  <Form.Group className="row">
                    <Col md={4}>
                      <Form.Label>Account Number</Form.Label>
                    </Col>
                    <Col md={8}>
                      <Form.Control
                        type="number"
                        placeholder="Enter account number"
                        className={errors?.account_number ? " is-invalid " : ""}
                        {...register("account_number", {
                          required: "Please enter account number",
                        })}
                      />
                      {errors?.account_number &&
                        errors?.account_number?.message && (
                          <label className="invalid-feedback text-left">
                            {errors?.account_number?.message}
                          </label>
                        )}
                    </Col>
                  </Form.Group>
                </Col>
                <Col sm={12} className="mb-2 mb-md-3">
                  <Form.Group className="row">
                    <Col md={4}>
                      <Form.Label>Deposit Limit</Form.Label>
                    </Col>
                    <Col md={8}>
                      <Form.Control
                        type="number"
                        placeholder="Enter deposit limit"
                        className={errors?.depositLimit ? " is-invalid " : ""}
                        {...register("depositLimit", {
                          required: "Please enter Deposit Limit",
                        })}
                      />
                      {errors?.depositLimit?.message && (
                        <label className="invalid-feedback text-left">
                          {errors?.depositLimit?.message}
                        </label>
                      )}
                    </Col>
                  </Form.Group>
                </Col>
                </>
              )}
            </Row>

            <Form.Group className="mt-3 text-center">
              <Button type="submit" className="theme_dark_btn px-5">
                {type == "add" ? "Add" : "Update"}
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddBank;
