import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { apiGet, apiPost, apiPut } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import { toast } from "wc-toast";

const ImportantMessage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({});
  const [isLoader, setLoader] = useState(false);
  const [messageData, setMessageData] = useState("");
  const [getIsImportant, setIsImportant] = useState("");

  const getMessageData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.importantMessage
    );
    if (status === 200) {
      if (response_users.success) {
        setMessageData(response_users.results);
        console.log(response_users, "ser");
        setValue("message", response_users?.results?.message);
      }
    }
  };

  const onSubmit = async (request) => {
    setLoader(true);
    try {
      const { status, data: response_users } = await apiPost(
        apiPath.userMessageCreate,
        {
          message: request.message,
          type: "important",
          isImportant: true,
        }
      );
      if (status === 200) {
        if (response_users.success) {
          setLoader(false);
          toast.success(response_users.message);
          reset();
          getMessageData();
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

  useEffect(() => {
    getMessageData();
  }, []);
  console.log(messageData, "===========");
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="bet_status">
            <h2 className="common-heading">Set Important Message</h2>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col lg={4}>
                  <Row className="">
                    <Col sm={12} className="mb-3">
                      <Form.Group>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="message"
                          className={errors.message ? " is-invalid " : ""}
                          {...register("message", {
                            required: "Please enter message",
                          })}
                        />
                        {errors.message && errors.message.message && (
                          <label className="invalid-feedback text-left">
                            {errors.message.message}
                          </label>
                        )}
                      </Form.Group>
                      <Form.Check
                        aria-label="option 1"
                        label="Is Important"
                        className="text-danger mt-3"
                        checked={true}
                        defaultChecked={messageData?.isImportant}
                        onChange={(e) => {
                          setIsImportant(e.target.checked);
                        }}
                      />
                    </Col>
                    <div className="mb-3">
                      <Button type="submit" className="green-btn">
                        {isLoader ? "Loading..." : "Set Message"}
                      </Button>
                    </div>
                    <div>
                      <strong>Current Message</strong>
                      <span className="d-block">
                        Current Message: {messageData?.message}
                      </span>
                    </div>
                  </Row>
                </Col>
              </Row>
            </Form>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default ImportantMessage;
