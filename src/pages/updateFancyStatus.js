import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Col,
  Row,
  Container,
  Form,
  Table,
  Modal,
} from "react-bootstrap";
import { apiGet, apiPost, apiPut } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import AuthContext from "../context/AuthContext";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "wc-toast";

const FancyResult = () => {
  const [fancy, setFancy] = useState(false);
  const deleteFancyToggle = (selectionId) => {
    setSelectionId(selectionId);
    setFancy(!fancy);
  };
  let { user } = useContext(AuthContext);

  const [matchData, setMatchData] = useState([]);
  const [fancyData, setFancyData] = useState([]);
  const [eventId, setEventId] = useState("");
  const [selectionId, setSelectionId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [fancyStatus, setFancyStatus] = useState("");
  const [decision, setDecision] = useState("");

  const getMatchData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.matchFilterList,
      search_params
    );
    if (status === 200) {
      if (response_users.success) {
        if (response_users.results) {
          setMatchData(response_users.results);
        }
      }
    }
  };

  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    eventType: 4,
    status: "",
  });

  const handleEventType = (eventType) => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: 1,
        eventType: eventType,
      };
    });
  };

  const handleMatch = async (eventId) => {
    setEventId(eventId);
  };
  const handleKeyword = async (keyword) => {
    setKeyword(keyword);
  };
  const handleFancyStatus = async (fancyStatus) => {
    setFancyStatus(fancyStatus);
  };

  const handleSearch = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.fancyList +
        "?eventId=" +
        eventId +
        "&keyword=" +
        keyword +
        "&fancyStatus=" +
        fancyStatus
    );
    if (status === 200) {
      if (response_users.success) {
        if (response_users.results) {
          setFancyData(response_users.results);
        }
      }
    }
  };

  useEffect(() => {
    getMatchData();
  }, [search_params]);
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
    reset: reset1,
  } = useForm({});
  const [isLoader, setLoader] = useState(false);
  const onSubmit1 = async (request) => {
    setLoader(true);
    try {
      const { status, data: response_users } = await apiPost(
        apiPath.deleteFancy,
        { selectionId: selectionId, password: request.password }
      );
      if (status === 200) {
        if (response_users.success) {
          setLoader(false);
          setFancy();
          toast.success(response_users.message);
          reset1();
          handleSearch();
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
  const [mark, setMark] = useState(false);
  const setMarkToggle = () => setMark(!mark);
  const setData = (fancyStatus, eventID, selectionId) => {
    setFancyStatus(fancyStatus);
    setEventId(eventID);
    setSelectionId(selectionId);
    setMarkToggle();
  };
  const updateMatchStatus = async () => {
    setLoader(true);
    if (eventId && fancyStatus && selectionId) {
      try {
        const { status, data: response_users } = await apiPost(
          apiPath.updateFancyStatus,
          { status: fancyStatus, eventId: eventId, selectionId: selectionId }
        );
        if (status === 200) {
          if (response_users.success) {
            setMarkToggle();
            setLoader(false);
            handleSearch();
            toast.success(response_users.message);
          } else {
            setLoader(false);
            toast.error(response_users.message);
          }
        }
      } catch (err) {
        setLoader(false);
        toast.error(err.response.data.message);
      }
    }
  };
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="inner-wrapper">
            <div className="common-container">
              <Form className="bet_status bet-list-live">
                <Row className="justify-content-center">
                  <Col xl={10} lg={12} md={12}>
                    <Row className="justify-content-between">
                      <Col lg={2} sm={6} className="mb-3">
                        <div className="bet-sec">
                          <Form.Label className="pe-1">
                            Select Sport:
                          </Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            onChange={(e) => {
                              handleEventType(e.target.value);
                            }}
                          >
                            <option value="4">Cricket</option>
                            <option value="1">Soccer</option>
                            <option value="2">Tennis</option>
                          </Form.Select>
                        </div>
                      </Col>
                      <Col lg={2} sm={6} className="mb-3">
                        <div className="bet-sec">
                          <Form.Label className="pe-1">
                            Select Match:
                          </Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            onChange={(e) => {
                              handleMatch(e.target.value);
                            }}
                          >
                            <option>Select Match</option>

                            {matchData.length &&
                              matchData.map((matchList, index) => {
                                return (
                                  <option
                                    value={matchList.eventId}
                                    key={index + 1}
                                  >
                                    {matchList.eventName}
                                  </option>
                                );
                              })}
                          </Form.Select>
                        </div>
                      </Col>
                      <Col lg={2} md={4}>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            placeholder="Search By Fancy Name"
                            onChange={(e) => {
                              handleKeyword(e.target.value);
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={3} sm={6} className="mb-3">
                        <div className="bet-sec">
                          <Form.Label className="pe-1">
                            Select Fancy Status:
                          </Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            onChange={(e) => {
                              handleFancyStatus(e.target.value);
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                          </Form.Select>
                        </div>
                      </Col>
                      <Col lg={1} md={4} className="mb-3">
                        <Button
                          className="btn theme_dark_btn w-100 "
                          onClick={() => {
                            handleSearch();
                          }}
                        >
                          Search
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>

              {/* show-fancy-table */}

              <div className="account-table batting-table mt-3">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Fancy Name</th>
                        <th scope="col"> SelectionId </th>
                        <th scope="col"> Action </th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {!isEmpty(fancyData) ? (
                        <>
                          {fancyData.length &&
                            fancyData.map((matchList, index) => {
                              return (
                                <tr key={index + 1}>
                                  <td>{matchList.fancyName}</td>
                                  <td>{matchList.selectionId}</td>

                                  <td>
                                    {user?.userType === "owner" && (
                                      <>
                                        <Button
                                          onClick={(e) => {
                                            deleteFancyToggle(
                                              matchList.selectionId
                                            );
                                          }}
                                          className="bg-danger text-white border-danger"
                                        >
                                          Delete
                                        </Button>
                                        {matchList?.status === "open" ? (
                                          <Link
                                            to="#"
                                            className="green-btn btn cursor-pointer"
                                            onClick={function (e) {
                                              setData(
                                                "close",
                                                matchList.eventId,
                                                matchList.selectionId
                                              );
                                            }}
                                          >
                                            Close
                                          </Link>
                                        ) : (
                                          <Link
                                            to="#"
                                            className="green-btn btn cursor-pointer"
                                            onClick={function (e) {
                                              setData(
                                                "open",
                                                matchList.eventId,
                                                matchList.selectionId
                                              );
                                            }}
                                          >
                                            Open
                                          </Link>
                                        )}
                                      </>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={9}>No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>

              {/* show-fancy-table */}
            </div>
          </div>
        </Container>
      </section>
      <Modal
        show={fancy}
        onHide={deleteFancyToggle}
        className="change-status-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-status h4">
            Delete Fancy
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="test-status border-0">
            <Form
              className="change-password-sec"
              onSubmit={handleSubmit1(onSubmit1)}
            >
              <Form.Group className=" mb-2">
                <h4 className="modal-title-status h4 text-center mb-3">
                  Are you want to delete fancy?
                </h4>
              </Form.Group>
              <Form.Group className=" mb-2">
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  className={
                    errors1.password
                      ? " w-sm-50 m-auto is-invalid "
                      : "w-sm-50 m-auto"
                  }
                  {...register1("password", {
                    required: "Please enter password",
                  })}
                />
                {errors1.password && errors1.password.message && (
                  <label className="invalid-feedback text-left">
                    {errors1.password.message}
                  </label>
                )}
              </Form.Group>

              <div className="text-center mt-4">
                <Button type="submit" className="green-btn">
                  {isLoader ? "Loading..." : "Submit"}
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
      {/* mark-inactive-modal */}
      <Modal show={mark} onHide={setMarkToggle} className="block-modal">
        <Modal.Header className="border-0">
          <Modal.Title className="modal-title-status">
            {fancyStatus} - ({eventId})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <div className="block-modal-content">
            <h3>
              Are you sure you want to {fancyStatus} ({eventId}) ?
            </h3>
            <div className="text-center">
              <Button
                type="submit"
                className="green-btn me-3"
                onClick={() => updateMatchStatus()}
              >
                {isLoader ? "Loading..." : "Confirm"}
              </Button>
              <Button className="green-btn" onClick={setMarkToggle}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* mark-inactive-modal */}
    </div>
  );
};

export default FancyResult;
