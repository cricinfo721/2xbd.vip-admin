import React, { useRef,useContext,useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Modal, Col, Row } from "react-bootstrap";
import { apiPost,apiPut } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import { toast } from "wc-toast";
import { isEmpty, pick } from "lodash";

import AuthContext from "../context/AuthContext";

export const DepositForm = ({
  deposit,
  changeDepositToggle,
  isLoader,
  setLoader,setDeposit,
  profileData,getProfileData
}) => {


  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
    setValue:setValue2
  } = useForm({ 
     defaultValues: {}
  }
  );

  useEffect(() => {
    if (!isEmpty(profileData) && !isEmpty(profileData?.limitSetting) && profileData?.limitSetting?.length>0) {
      setValue2("minDeposit", profileData?.limitSetting.length>0 && profileData?.limitSetting[0]?.minDeposit)
      setValue2("maxDeposit", profileData?.limitSetting.length>0 && profileData?.limitSetting[0]?.maxDeposit)
      setValue2("minWithdraw", profileData?.limitSetting.length>0 && profileData?.limitSetting[0]?.minWithdraw)
      setValue2("maxWithdraw", profileData?.limitSetting.length>0 && profileData?.limitSetting[0]?.maxWithdraw)
    }
}, [deposit]);


  const onSubmit2 = async (request) => {
    setLoader(true);

    try {
      const { status, data: response_users } = await apiPut(
        apiPath.editProfile+"/"+profileData?._id,
       {
        "limitSetting":[{
          "minDeposit":request?.minDeposit,
          "maxDeposit":request?.maxDeposit,
          "minWithdraw":request?.minWithdraw,
          "maxWithdraw":request?.maxWithdraw
        }]
        
       }
      );
      if (status === 200) {
        if (response_users.success) {
          setLoader(false);
          setDeposit();
          toast.success(response_users.message);
          reset2();
          getProfileData();

        } else {
          setLoader(false);
          toast.error(response_users.message);
        }
      }
    } catch (err) {
      setLoader(false);
      toast.error(err.response.data.message);
    }
    
    };
    
  return (
    <Modal
      show={deposit}
      onHide={changeDepositToggle}
      className="d-w-modal p-0"
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-status h4">
          Set Deposit / Withdrawal Limit
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="test-status border-0">
          <Form
            className="change-password-sec"
            onSubmit={handleSubmit2(onSubmit2)}
          >
            <Row>
              <Col md={6} lg={6}>
                <Row>
                  <Col sm={12} className="mb-2 mb-md-3">
                    <Form.Group className="row">
                      <Col md={4}>
                        <Form.Label>Min Deposit <span class="must">＊</span></Form.Label>
                      </Col>
                      <Col md={8} style={{ position: `relative` }}>
                        <Form.Control
                          type="number"
                          min="0"
                           max="1000000"
                         
                           onWheel={(e) => e.target.blur()} 
                          placeholder="Min Deposit"
                          className={errors2.commission ? " is-invalid " : ""}
                          {...register2("minDeposit", {
                            required: "Please enter valid number",
                          })}
                        />
                        
                        {errors2.minDeposit && errors2.minDeposit.message && (
                          <label className="invalid-feedback text-left">
                            {errors2.minDeposit.message}
                          </label>
                        )}
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col md={6} lg={6}>
                <Row>
                  <Col sm={12} className="mb-2 mb-md-3">
                    <Form.Group className="row">
                      <Col md={4}>
                        <Form.Label>Max Deposit <span class="must">＊</span></Form.Label>
                      </Col>
                      <Col md={8} style={{ position: `relative` }}>
                        <Form.Control
                          type="number"
                          min="0"
                          max="1000000"
                          onWheel={(e) => e.target.blur()} 
                          placeholder="Max Deposit"
                          className={errors2.maxDeposit ? " is-invalid " : ""}
                          {...register2("maxDeposit", {
                            required: "Please enter valid number",
                          })}
                        />
                        
                        {errors2.maxDeposit && errors2.maxDeposit.message && (
                          <label className="invalid-feedback text-left">
                            {errors2.maxDeposit.message}
                          </label>
                        )}
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col md={6} lg={6}>
                <Row>
                  <Col sm={12} className="mb-2 mb-md-3">
                    <Form.Group className="row">
                      <Col md={4}>
                        <Form.Label>Min Withdrawal <span class="must">＊</span></Form.Label>
                      </Col>
                      <Col md={8} style={{ position: `relative` }}>
                        <Form.Control
                          type="number"
                          min="0"
                          max="1000000"
                         
                          onWheel={(e) => e.target.blur()} 
                          placeholder="Min Withdrawal"
                          className={errors2.commission ? " is-invalid " : ""}
                          {...register2("minWithdraw", {
                            required: "Please enter valid number",
                          })}
                        />
                        
                        {errors2.minWithdraw && errors2.minWithdraw.message && (
                          <label className="invalid-feedback text-left">
                            {errors2.minWithdraw.message}
                          </label>
                        )}
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col md={6} lg={6}>
                <Row>
                  <Col sm={12} className="mb-2 mb-md-3">
                    <Form.Group className="row">
                      <Col md={4}>
                        <Form.Label>Max Withdrawal <span class="must">＊</span></Form.Label>
                      </Col>
                      <Col md={8} style={{ position: `relative` }}>
                        <Form.Control
                          type="number"
                          min="0"
                          max="1000000"
                         
                          onWheel={(e) => e.target.blur()} 
                          placeholder="Max Withdrawal"
                          className={errors2.commission ? " is-invalid " : ""}
                          {...register2("maxWithdraw", {
                            required: "Please enter valid number",
                          })}
                        />
                        
                        {errors2.maxWithdraw && errors2.maxWithdraw.message && (
                          <label className="invalid-feedback text-left">
                            {errors2.maxWithdraw.message}
                          </label>
                        )}
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="text-center mt-4">
              <Button type="submit" className="green-btn">
                {isLoader ? "Loading..." : "Save"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};
