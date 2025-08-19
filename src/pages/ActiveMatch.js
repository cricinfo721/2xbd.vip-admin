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
import UpdateDialogBox from "../components/UpdateDialogBox";
import moment from "moment-timezone";

const ActiveMatch = () => {
  let { user } = useContext(AuthContext);
  const [mark, setMark] = useState(false);
  const setMarkToggle = () => setMark(!mark);
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState({
    type: "",
    id: "",
  });
  const setOpenToggle = () => {
    setOpen(!open);
    setModel({
      type: "",
      id: "",
    });
  };
  const { handleSubmit, reset } = useForm({});
  const [updateDate, setUpdateDate] = useState(false);
  const setUpdateDateToggle = () => setUpdateDate(!updateDate);
  const [isLoader, setLoader] = useState(false);
  const [matchData, setMatchData] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);
  const [getUpdateId, setUpdateId] = useState("");
  const [getMatchStatus, setMatchStatus] = useState("");
  const [getEventID, setEventId] = useState("");
  const [getEventName, setEventName] = useState("");
  const [getDate, setDate] = useState("");

  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    status: "active",
    gameType: "cricket",
  });

  const getMatchData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.resultsSetMarker,
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
        page: 1,
        keyword: keyword,
      };
    });
  };

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
            setMarkToggle();
            setLoader(false);
            getMatchData();
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

  const setDataForUpdateDate = (matchStatus, Id, eventID, eventName,eventDateTime) => {
    setMatchStatus(matchStatus);
    setUpdateId(Id);
    setEventId(eventID);
    setEventName(eventName);
    let utcdate=moment(eventDateTime).utc();
    let istTime = moment(utcdate).tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm');
    setDate(istTime);
    setUpdateDateToggle();
  };



  const onSubmit = async (request) => {
   console.log(getDate);
  
  let isttime= moment(getDate).tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm')
  //  console.log(isttime);
   var utcDate = moment.tz(isttime, "YYYY-MM-DD HH:mm:ss", 'Asia/Kolkata').toISOString();
  //  console.log(utcDate);
      
   
    if (getDate) {
      setLoader(true);
      try {
        const { status, data: response_users } = await apiPut(
          apiPath.updateMatchStatus + "/" + getUpdateId,
          { status: "update", date_time: utcDate }
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

  useEffect(() => {
    setPageCount(matchData?.totalPages || []);
  }, [matchData]);

  useEffect(() => {
    getMatchData();
    setViewPage(search_params.page ? search_params.page - 1 : 0);
  }, [search_params]);

  let status = {
    in_play: "In Play",
    active: "Active",
  };

  const setfancy = async () => {
    let path;
    if (model.type == "fancy") {
      path = apiPath.setFancy;
    } else {
      path = apiPath.setBookmaker;
    }
    try {
      const { status, data: response_users } = await apiGet(
        path + `?eventId=${model.id}`
      );
      if (status === 200) {
        if (response_users.success) {
          getMatchData();
          setOpen(false);
          toast.success(response_users.message);
        } else {
          setOpen(false);
          toast.error(response_users.message);
        }
      }
    } catch (err) {
      setOpen(false);
      toast.error(err.response.data.message);
    }
  };
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Active Matches</h2>
          </div>
          <div className="find-member-sec">
            <Form className="mb-4">
              <Form.Group
                className="position-relative mb-2 "
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
                        matchData?.data?.map((matchList, index) => {
                          console.log(matchList.status == "", "=======");
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
                              <td>{status[matchList.status]}</td>
                              <td>
                                {user?.userType === 'owner' && user?.username === 'superjohndoe' && (
                                  <>
                                    <Link
                                      to="#"
                                      className="green-btn cursor-pointer"
                                      // onClick={setMarkToggle}
                                      onClick={function (e) {
                                        setData(
                                          "suspend",
                                          matchList._id,
                                          matchList.eventId,
                                          matchList.eventName
                                        );
                                      }}
                                    >
                                      Mark Inactive
                                    </Link>
                                    
                                    <Link
                                      to="#"
                                      className="green-btn cursor-pointer"
                                      onClick={function (e) {
                                        setDataForUpdateDate(
                                          "update",
                                          matchList._id,
                                          matchList.eventId,
                                          matchList.eventName,
                                          matchList.eventDateTime
                                        );
                                      }}
                                    >
                                      Update Date
                                    </Link>
                                  </>)}
                                  {user?.userType === 'owner' && user?.username === 'superjohndoe' ? (
                                  matchList.status !== "in_play" && (
                                      <Link
                                        to="#"
                                        className="green-btn cursor-pointer"
                                        // onClick={setMarkToggle}
                                        onClick={function (e) {
                                          setData(
                                            "in_play",
                                            matchList._id,
                                            matchList.eventId,
                                            matchList.eventName
                                          );
                                        }}
                                      >
                                        Mark InPlay
                                      </Link>
                                    )
                                    ):("")}
                                    {/* {search_params.gameType == "cricket" &&
                                matchList?.fancyList?.length == 0 ? (
                                  <span
                                    onClick={() => {
                                      setOpen(true);
                                      setModel({
                                        type: "fancy",
                                        id: matchList.eventId,
                                      });
                                    }}
                                    className="green-btn cursor-pointer"
                                    style={{
                                      padding: "6px",
                                      marginRight: "5px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Set Fancy
                                  </span>
                                ) : (
                                  ""
                                )}
                                {matchList?.bookmakerRunners?.length == 0 && (
                                  <span
                                    onClick={() => {
                                      setOpen(true);
                                      setModel({
                                        type: "bookamker",
                                        id: matchList.eventId,
                                      });
                                    }}
                                    className="green-btn cursor-pointer"
                                    style={{
                                      padding: "6px",
                                      marginRight: "5px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Set Bookamker
                                  </span>
                                )} */}
                                    
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
                  dateFormat= "YYYY-MM-DD HH:mm"

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
      <UpdateDialogBox
        open={open}
        onClose={setOpenToggle}
        onSubmit={setfancy}
        // isLoader={isLoader}
        headerTitle={"Decision"}
        title={
          model.type == "fancy"
            ? "You Want to set Fancy"
            : "You Want to set Bookmaker"
        }
      />
    </div>
  );
};

export default ActiveMatch;
