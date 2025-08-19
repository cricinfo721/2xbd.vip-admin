import React, { useState, useEffect, useContext } from "react";
import { Container, Form, Table, Button, Modal } from "react-bootstrap";
import { apiGet, apiPut } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import { isEmpty } from "lodash";
import ReactPaginate from "react-paginate";
import { useForm } from "react-hook-form";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import { toast } from "wc-toast";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
const InActiveMatch = () => {
  let { user } = useContext(AuthContext);
  const [mark, setMark] = useState(false);
  const setMarkToggle = () => setMark(!mark);
  const { handleSubmit, reset } = useForm({});
  // update-date-modal//

  const [updateDate, setUpdateDate] = useState(false);
  const setUpdateDateToggle = () => setUpdateDate(!updateDate);

  //update-date-modal//
  const [isLoader, setLoader] = useState(false);
  const [matchData, setMatchData] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    status: "suspend",
    gameType: "cricket",
  });
  const getMatchData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.matchList,
      search_params
    );
    if (status === 200) {
      if (response_users.success) {
        setMatchData(response_users.results);
      }
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

  const handleSearch = (keyword) => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        keyword: keyword,
      };
    });
  };
  const [getUpdateId, setUpdateId] = useState("");
  const [getMatchStatus, setMatchStatus] = useState("");
  const [getEventID, setEventId] = useState("");
  const [getEventName, setEventName] = useState("");
  const setData = (matchStatus, Id, eventID, eventName) => {
    setMatchStatus(matchStatus);
    setUpdateId(Id);
    setEventId(eventID);
    setEventName(eventName);
    setMarkToggle();
  };

  const updateMatchStatus = async () => {
    setLoader(true);
    if (getUpdateId && getMatchStatus) {
      try {
        const { status, data: response_users } = await apiPut(
          apiPath.updateMatchStatus + "/" + getUpdateId,
          { status: getMatchStatus }
        );
        if (status === 200) {
          if (response_users.success) {
            //setMatchData(response_users.results);
            setMarkToggle();
            setLoader(false);
            getMatchData();
            toast.success(response_users.message);
          } else {
            toast.error(response_users.message);
            setLoader(false);
          }
        }
      } catch (err) {
        setLoader(false);
        toast.error(err.response.data.message);
      }
    }
  };

  useEffect(() => {
    setPageCount(matchData?.totalPages || []);
  }, [matchData]);

  useEffect(() => {
    getMatchData();
    setViewPage(search_params.page ? search_params.page - 1 : 0);
  }, [search_params]);

  const setDataForUpdateDate = (matchStatus, Id, eventID, eventName) => {
    setMatchStatus(matchStatus);
    setUpdateId(Id);
    setEventId(eventID);
    setEventName(eventName);
    setUpdateDateToggle();
  };

  const [getDate, setDate] = useState("");
  const onSubmit = async (request) => {
    if (getDate) {
      setLoader(true);
      try {
        const { status, data: response_users } = await apiPut(
          apiPath.updateMatchStatus + "/" + getUpdateId,
          { status: "update", date_time: getDate }
        );
        if (status === 200) {
          if (response_users.success) {
            setUpdateDateToggle();
            setLoader(false);
            setDate();
            getMatchData();
            toast.success(response_users.message);
            reset();
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
      toast.error("Please enter date time");
    }
  };

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">In Active Matches</h2>
          </div>

          <div className="find-member-sec">
            <Form className="mb-4">
              <Form.Group
                className="position-relative mb-2"
                style={{ marginRight: "10px" }}
              >
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                />
                <i className="fas fa-search"></i>
              </Form.Group>
              <Form.Select
                value={search_params.gameType}
                onChange={(e) => {
                  setSearchParams({
                    ...search_params,
                    gameType: e.target.value,
                    page: 1,
                  });
                  setViewPage(0);
                }}
                aria-label="Default select example"
                className="mb-2 w-25"
              >
                <option value="cricket">Cricket</option>
                <option value="tennis">Tennis</option>
                <option value="soccer">Soccer</option>
                <option value="casino">Casino</option>
              </Form.Select>
            </Form>
          </div>

          <div className="inner-wrapper">
            <div className="common-container">
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Sport</th>
                        <th scope="col"> Event Id </th>
                        <th scope="col">Market Id</th>
                        <th scope="col">Match</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchData?.data &&
                        matchData?.data.map((matchList, index) => {
                          return (
                            <tr key={index}>
                              <td>{matchList.gameType}</td>
                              <td>{matchList.eventId}</td>
                              <td>{matchList.marketId}</td>
                              <td>{matchList.eventName}</td>
                              <td>
                                {helpers.dateFormat(
                                  matchList.eventDateTime,
                                  user.timeZone
                                )}
                              </td>
                              <td>{matchList.status}</td>
                              <td>
                              {(user?.userType == 'owner' || user?.userType == 'sub_owner') && (
                                <>
                                <Link
                                  to="#"
                                  className="green-btn cursor-pointer"
                                  // onClick={setMarkToggle}
                                  onClick={function (e) {
                                    setData(
                                      "active",
                                      matchList._id,
                                      matchList.eventId,
                                      matchList.eventName
                                    );
                                  }}
                                >
                                  Mark Active
                                </Link>
                                {/* <a
                                  className="green-btn cursor-pointer"
                                  onClick={setMarkToggle}

                                >
                                  Suspend Match
                                </a> */}
                                <Link
                                  to="#"
                                  className="green-btn cursor-pointer"
                                  onClick={function (e) {
                                    setDataForUpdateDate(
                                      "update",
                                      matchList._id,
                                      matchList.eventId,
                                      matchList.eventName
                                    );
                                  }}
                                >
                                  Update Date
                                </Link>
                                </>
                              )}
                              </td>
                            </tr>
                          );
                        })}
                      {isEmpty(matchData?.data) ? (
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
            </div>
          </div>
        </Container>
      </section>

      {/* mark-inactive-modal */}

      <Modal show={mark} onHide={setMarkToggle} className="block-modal">
        <Modal.Header className="border-0">
          <Modal.Title className="modal-title-status">
            {getMatchStatus} - {getEventName} ({getEventID})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <div className="block-modal-content">
            <h3>
              Are you sure you want to {getMatchStatus} {getEventName} (
              {getEventID}) ?
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

      {/* update-date-modal */}

      <Modal
        show={updateDate}
        onHide={setUpdateDateToggle}
        className="block-modal"
      >
        <Modal.Header className="border-0">
          <Modal.Title className="modal-title-status">
            Change Date Of -{getEventName} ({getEventID})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <div className="block-modal-content">
            <Form className="py-4 px-4" onSubmit={handleSubmit(onSubmit)}>
              <Form.Group>
                <Flatpickr
                  data-enable-time
                  value={getDate}
                  onChange={([date]) => {
                    setDate(date);
                  }}
                  className="form-control"
                  placeholder="Select Date .."
                />
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

      {/* update-date-modal */}
    </div>
  );
};

export default InActiveMatch;
