import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Table,
  Modal,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import Flatpickr from "react-flatpickr";
import { apiGet, apiPut, apiPost } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import { toast } from "wc-toast";
import { isEmpty } from "lodash";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
const HyperMessage = () => {
  let { user } = useContext(AuthContext);
  const [getDate, setDate] = useState("");
  const [getUpdatedDate, setUpdatedDate] = useState("");
  const [isLoader, setLoader] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    setValue: setValue1,
    formState: { errors: errors1 },
    reset: reset1,
  } = useForm({});
  const [messageData, setMessageData] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);
  const [mark, setMark] = useState(false);
  const setMarkToggle = () => setMark(!mark);
  const [getMsgData, setMsgData] = useState("");
  const [updateDate, setUpdateDate] = useState(false);
  const setUpdateDateToggle = () => setUpdateDate(!updateDate);
  const [getUpdateId, setUpdateId] = useState("");
  const [messageId, setMessageId] = useState([]);
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    type: "hyper",
  });

  const [getSelectedStatus, setSelectedStatus] = useState("");

  const setCheckBoxData = (msgId) => {
    const newMessageId = [...messageId];
    const index = newMessageId.indexOf(msgId);
    if (index === -1) {
      newMessageId.push(msgId);
    } else {
      newMessageId.splice(index, 1);
    }
    setMessageId(newMessageId);
  };

  const handleChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const updateStatusHandle = async () => {
    // console.log(messageId, getSelectedStatus);
    if (messageId.length > 0 && getSelectedStatus) {
      const { status, data: response_users } = await apiPut(
        apiPath.messageStatusUpdate,
        { messageId: messageId, status: getSelectedStatus }
      );
      if (status === 200) {
        if (response_users.success) {
          setMessageId([]);
          setSelectedStatus("");
          toast.success(response_users.message);
          getMessageData();
        }
      }
    }
  };

  const getMessageData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.userMessageList,
      search_params
    );
    if (status === 200) {
      if (response_users.success) {
        setMessageData(response_users.results);
      }
    }
  };

  const onSubmit = async (request) => {
    if (getDate) {
      setLoader(true);
      try {
        let hostname = window.location.hostname;
        hostname = hostname.replace(/^www\./, '');
        hostname = hostname.replace(/^ag\./, '');
        hostname = hostname || "sabaexch.com";
        const { status, data: response_users } = await apiPost(
          apiPath.userMessageCreate,
          {
            title: request.title,
            type: "hyper",
            msgDate: getDate,
            message: request.message,
            //domain: user?.userType === "owner" ? request.domain : hostname,
          }
        );
        if (status === 200) {
          if (response_users.success) {
            setLoader(false);
            setDate();
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
    } else {
      toast.error("Please select date");
    }
  };

  const handlePageClick = (event) => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: event.selected + 1,
      };
    });

    setViewPage(event.selected);
  };

  const setViewMessageData = async (msgId) => {
    const { status, data: response_users } = await apiGet(
      apiPath.userMessageDetail + "?messageId=" + msgId
    );
    if (status === 200) {
      if (response_users.success) {
        setMsgData(response_users.results);
      }
    }

    setMarkToggle();
  };

  const setDataForUpdateDate = (Id, updatedTitle, updatedMsg, updatedDate) => {
    setUpdateId(Id);
    setValue1("updatedTitle", updatedTitle);
    setValue1("updatedMessage", updatedMsg);
    setUpdatedDate(updatedDate);
    setUpdateDateToggle();
  };

  const onSubmit1 = async (request) => {
    setLoader(true);

    try {
      const { status, data: response_users } = await apiPut(
        apiPath.userMessageUpdate,
        {
          messageId: getUpdateId,
          title: request.updatedTitle,
          message: request.updatedMessage,
          msgDate: getUpdatedDate,
        }
      );
      if (status === 200) {
        if (response_users.success) {
          setLoader(false);
          toast.success(response_users.message);
          reset1();
          getMessageData();
          setUpdateDateToggle();
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
    setPageCount(messageData?.totalPages || []);
  }, [messageData]);

  useEffect(() => {
    getMessageData();
    setViewPage(search_params.page ? search_params.page - 1 : 0);
  }, [search_params]);

  const [websiteData, setWebsiteData] = useState("");

  // useEffect(() => {
  //   const getWebsiteData = async () => {
  //     const { status, data: response_users } = await apiGet(apiPath.listWebsite);
  //     if (status === 200) {
  //       if (response_users.success) {
  //         setWebsiteData(response_users.results?.data);
  //       }
  //     }
  //   };
  //   getWebsiteData();
  // }, []);
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="bet_status">
            <h2 className="common-heading">Set Message For Users</h2>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col lg={6}>
                  <Row className="">
                    <Col sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Title"
                          className={errors.title ? " is-invalid " : ""}
                          {...register("title", {
                            required: "Please enter title",
                          })}
                        />
                        {errors.title && errors.title.message && (
                          <label className="invalid-feedback text-left">
                            {errors.title.message}
                          </label>
                        )}
                      </Form.Group>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <Form.Group>
                        <Flatpickr
                          value={getDate}
                          onChange={([date]) => {
                            setDate(date);
                          }}
                          className="form-control"
                          placeholder="Select Date .."
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={12} className="mb-3">
                      <Form.Group>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="message"
                          placeholder="Enter Message"
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
                    </Col>
                    {/* {user?.userType === "owner" && (
                      <Col sm={12} className="mb-3">
                        <Form.Group>
                          <Form.Select
                            as="select"
                            name="domain"
                            className={errors.domain ? " is-invalid " : ""}
                            {...register("domain", {
                              required: "Please enter domain",
                            })}
                          >
                            <option value=""> Select Domain</option>;
                            {websiteData &&
                              websiteData.map((item, index) => {
                                return (
                                  <option value={item?.domain}>{item?.domain}</option>
                                );
                              })}
                          </Form.Select>
                          {errors.domain && errors.domain.message && (
                            <label className="invalid-feedback text-left">
                              {errors.domain.message}
                            </label>
                          )}
                        </Form.Group>
                      </Col>
                    )} */}
                    <div>
                      <Button type="submit" className="green-btn">
                        {isLoader ? "Loading..." : "Save Message"}
                      </Button>
                    </div>
                  </Row>
                </Col>
              </Row>
            </Form>
          </div>

          <div className="find-member-sec search_banking_detail mt-3">
            <Row>
              <Col xxl={4} xl={5} lg={6} md={7} xs={11}>
                <Form>
                  <Form.Group className="d-flex align-items-center mb-3 mb-sm-0 w-100">
                    <Form.Label className="pe-3 mb-0 w-50">
                      Message List:
                    </Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      value={getSelectedStatus ? getSelectedStatus : ""}
                      onChange={handleChange}
                    >
                      <option>Select Action</option>
                      <option value="lock">Lock Message </option>
                      <option value="open">Open Message</option>
                      <option value="delete">Delete Message</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group>
                    <Button
                      className="green-btn ms-2"
                      onClick={updateStatusHandle}
                    >
                      Action
                    </Button>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </div>
          <div className="account-table batting-table mt-4">
            <div className="responsive">
              <Table>
                <thead>
                  <tr>
                    <th scope="col" className="text-start">
                      S.No.
                    </th>
                    <th scope="col">Msg_ID </th>
                    {/* <th scope="col">Domain</th> */}
                    <th scope="col">Msg_Title </th>
                    <th scope="col">Msg_Date </th>
                    <th scope="col">IsLock</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {messageData?.data &&
                    messageData?.data.map((msgList, index) => {
                      return (
                        <tr key={index + 1}>
                          <td className="text-start">
                            {" "}
                            <Form.Check
                              key={index + 1}
                              name="check"
                              checked={messageId.includes(msgList?._id)}
                              value={msgList?._id}
                              aria-label="option 1"
                              label={index + 1}
                              onClick={() => setCheckBoxData(msgList?._id)}
                            />
                          </td>
                          <td>{msgList?._id}</td>
                          {/* <td>{msgList?.domain}</td> */}
                          <td>{msgList?.title}</td>
                          <td>
                            {helpers.msgDateFormat(
                              msgList?.msgDate,
                              user.timeZone
                            )}
                          </td>
                          <td>
                            {msgList?.status === "lock" ? "true" : "false"}
                          </td>
                          <td>
                            <Link
                              to="#"
                              className="green-btn"
                              onClick={function (e) {
                                setDataForUpdateDate(
                                  msgList._id,
                                  msgList?.title,
                                  msgList?.message,
                                  msgList?.msgDate
                                );
                              }}
                            >
                              Edit
                            </Link>
                            <Link
                              to="#"
                              className="green-btn"
                              onClick={function (e) {
                                setViewMessageData(msgList._id);
                              }}
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  {isEmpty(messageData?.data) ? (
                    <tr>
                      <td colSpan={9}>No records found</td>
                    </tr>
                  ) : null}
                </tbody>
              </Table>
              <div className="bottom-pagination">
                <ReactPaginate
                  breakLabel="..."
                  nextLabel=" >"
                  forcePage={viewpage}
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={10}
                  pageCount={pageCount}
                  previousLabel="< "
                  renderOnZeroPageCount={null}
                  activeClassName="p-1"
                  activeLinkClassName="pagintion-li"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
      {getMsgData && (
        <Modal show={mark} onHide={setMarkToggle} className="block-modal">
          <Modal.Header className="border-0">
            <Modal.Title className="modal-title-status">
              Message Detail
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-3">
            <div className="block-modal-content">
              <div className="account-table batting-table mt-4">
                <div className="responsive">
                  <table className="table">
                    <tr>
                      <td scope="col">Msg ID :</td>
                      <td>{getMsgData?._id}</td>
                    </tr>
                    <tr>
                      <td scope="col">Msg Title :</td>
                      <td>{getMsgData?.title}</td>
                    </tr>
                    <tr>
                      <td scope="col">Message :</td>
                      <td>{getMsgData?.message}</td>
                    </tr>
                    <tr>
                      <td scope="col">domain :</td>
                      <td>{getMsgData?.domain}</td>
                    </tr>
                    <tr>
                      <td scope="col">Msg Date :</td>
                      <td>
                        {helpers.dateFormat(getMsgData.msgDate, user.timeZone)}
                      </td>
                    </tr>
                    <tr>
                      <td scope="col">Status :</td>
                      <td>{getMsgData?.status}</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div className="text-center">
                <Button className="green-btn" onClick={setMarkToggle}>
                  Cancel{" "}
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
      <Modal
        show={updateDate}
        onHide={setUpdateDateToggle}
        className="block-modal"
      >
        <Modal.Header className="border-0">
          <Modal.Title className="modal-title-status">
            Update Message
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <div className="block-modal-content">
            <Form className="pb-4" onSubmit={handleSubmit1(onSubmit1)}>
              <Form.Group className=" mb-2">
                <Form.Control
                  type="text"
                  placeholder="Title"
                  className={errors1.updatedTitle ? " is-invalid " : ""}
                  {...register1("updatedTitle", {
                    required: "Please enter title",
                  })}
                />
                {errors1.updatedTitle && errors1.updatedTitle.message && (
                  <label className="invalid-feedback text-left">
                    {errors1.updatedTitle.message}
                  </label>
                )}
              </Form.Group>
              <Form.Group className=" mb-2">
                <Flatpickr
                  value={getUpdatedDate}
                  onChange={([date]) => {
                    setUpdatedDate(date);
                  }}
                  className="form-control"
                  placeholder="Select Date .."
                />
              </Form.Group>
              <Form.Group className=" mb-2">
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="updatedMessage"
                  placeholder="Enter Message"
                  className={errors1.updatedMessage ? " is-invalid " : ""}
                  {...register1("updatedMessage", {
                    required: "Please enter message",
                  })}
                />
                {errors1.updatedMessage && errors1.updatedMessage.message && (
                  <label className="invalid-feedback text-left">
                    {errors1.updatedMessage.message}
                  </label>
                )}
              </Form.Group>
              <div className="text-center mt-4">
                <Button type="submit" className="green-btn me-3">
                  {isLoader ? "Loading..." : "Confirm"}
                </Button>
                <Button className="green-btn" onClick={setUpdateDateToggle}>
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HyperMessage;
