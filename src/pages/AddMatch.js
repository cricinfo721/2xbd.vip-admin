import React, { useState, useEffect, useContext } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { apiGet, apiPost, apiPut } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import { isEmpty } from "lodash";
import ReactPaginate from "react-paginate";
import "flatpickr/dist/themes/material_green.css";
import { toast } from "wc-toast";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import obj from "../utils/constants";
import UpdateDialogBox from "../components/UpdateDialogBox";

const AddMatch = () => {
  let { user } = useContext(AuthContext);
  const [mark, setMark] = useState(false);
  const setMarkToggle = () => setMark(!mark);
  const [isLoader, setLoader] = useState(false);
  const [matchData, setMatchData] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);
  const [getUpdateId, setUpdateId] = useState("");
  const [getMatchStatus, setMatchStatus] = useState("");
  const [getEventID, setEventId] = useState("");
  const [getEventName, setEventName] = useState("");
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [checkbox, setCheckBox] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sportName, setSportName] = useState("cricket");
  const [apiType, setApiType] = useState("betFair");

  const [confirm, setConfirm] = useState(false);
  const setConfirmToggle = () => setConfirm(!confirm);

  const resetSelect = () => {
    setSelectAll(false);
    setCheckBox([]);
    setOpen(false);
    setUpdateAll("");
  };
  const [updateAll, setUpdateAll] = useState("");
  const [model, setModel] = useState({
    status: "",
    id: "",
  });
  const setOpenToggle = () => {
    setOpen(!open);
    setModel({
      status: "",
      id: "",
    });
  };

  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    status: "pending",
    gameType: "cricket",
  });
  const getMatchData = async () => {
    const { status, data: response_users } = await apiGet(apiPath.matchList, {
      ...search_params,
      keyword: keyword,
    });
    if (status === 200) {
      if (response_users.success) {
        setSelectAll(false);
        setCheckBox([]);
        setUpdateAll("");
        setMatchData(response_users.results);
      }
    }
  };
  const fetchMatchData = async () => {

    setLoader(true);
    const { status, data: response_users1 } = await apiGet(
      sportName === "cricket"
        ? apiPath.tournamentList + "?sport=4&type=" + apiType
        : sportName === "tennis"
        ? apiPath.tournamentList + "?sport=2&type=" + apiType
        : apiPath.tournamentList + "?sport=1&type=" + apiType
    );
    // console.log("status", status);
    // console.log("results", response_users1);
    // console.log('apiType',apiType, sportName);
    // return true;
    if (status === 200) {
      if (response_users1.success) {
        // console.log("sportName", sportName);
        if (sportName) {
          const { status, data: response_users } = await apiGet(
            sportName === "cricket"
              ? apiPath.cricketTournamentMatch + "?type=" + apiType
              : sportName === "tennis"
              ? apiPath.tennisTournamentMatch + "?type=" + apiType
              : apiPath.soccerTournamentMatch + "?type=" + apiType
          );
          if (status === 200) {
            if (response_users.success) {
              setLoader(false);
              toast.success(response_users.message);
              setConfirmToggle();
            } else {
              setLoader(false);
              toast.error(response_users.message);
            }
          }
        }
      } else {
        setLoader(false);
        toast.error(response_users1.message);
      }
    } else {
      setLoader(false);
      toast.error(response_users1.message);
    }
  };

  const updateAllStatus = async () => {
    const { status, data: response_users } = await apiPost(
      apiPath.updateAllAddMatchList,
      {
        status: updateAll,
        eventIds: checkbox.map((res) => {
          return res.eventId;
        }),
      }
    );
    if (status === 200) {
      if (response_users.success) {
        resetSelect();
        getMatchData();
        toast.success(response_users.message, {
          theme: {
            type: "custom",
            style: { background: "green", color: "white" },
          },
        });
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
            resetSelect();
            setLoader(false);
            getMatchData();
            toast.success(response_users.message, {
              theme: {
                type: "custom",
                style: { background: "green", color: "white" },
              },
            });
          } else {
            setLoader(false);
            resetSelect();
            toast.error(response_users.message);
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

  const setUpdateStatus = async () => {
    try {
      const { status, data: response_users } = await apiGet(
        apiPath.resultTieandAbonded +
          `?eventId=${model.id}&status=${model.status}`
      );
      if (status === 200) {
        if (response_users.success) {
          setSearchParams({
            ...search_params,
            gameType: search_params.gameType,
            page: 1,
          });
          setUpdateAll("");
          resetSelect();
          setMark(false);
          toast.success(response_users.message, {
            theme: {
              type: "custom",
              style: { background: "green", color: "white" },
            },
          });
        } else {
          resetSelect();
          toast.error(response_users.message);
        }
      }
    } catch (err) {
      resetSelect();
      toast.error(err.response.data.message);
    }
  };

  const selectCheckbox = (check, type) => {
    if (type == "selectAll") {
      setMatchData({
        ...matchData,
        data: matchData.data.map((res) => {
          return res.eventId ? { ...res, checked: check } : res;
        }),
      });
      setSelectAll(check);
      setCheckBox(
        check
          ? matchData.data.map((res) => {
              return res.eventId ? { eventId: res.eventId } : "";
            })
          : []
      );
    } else {
      setMatchData({
        ...matchData,
        data: matchData.data.map((res) => {
          return res.eventId === type ? { ...res, checked: check } : res;
        }),
      });
      if (checkbox.length == 0) {
        setCheckBox([{ eventId: type }]);
      } else {
        let temp = checkbox.filter((res) => res.eventId == type);
        if (temp.length == 0) {
          checkbox.push({ eventId: type });
        } else {
          setCheckBox(checkbox.filter((res) => res.eventId !== type));
        }
      }
    }
  };
  useEffect(() => {
    if (checkbox.length == 0) {
      setSelectAll(false);
    }
  }, [checkbox]);

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="inner-wrapper">
            <div className="common-container">
              <div
                className="bet_status mb-4"
                style={{ display: "flex", alignItems: "center" }}
              >
                <ul
                  className="list-unstyled mb-0"
                  style={{ marginRight: "10px" }}
                >
                  <li>
                    <a
                      href="/defaultsetting"
                      className="btn btn-primary theme_dark_btn"
                    >
                      Default & Add Setting
                    </a>
                  </li>
                </ul>{" "}
                <div className="bet-sec" style={{ marginRight: "10px" }}>
                  <Form.Label className="mt-2 me-2">Sports :</Form.Label>
                  <Form.Select
                    value={search_params.gameType}
                    style={{ width: "200px" }}
                    onChange={(e) => {
                      setSearchParams({
                        ...search_params,
                        gameType: e.target.value,
                        page: 1,
                      });
                      setViewPage(0);
                      setSelectAll(false);
                      setCheckBox([]);
                      setModel({
                        status: "",
                        id: "",
                      });
                    }}
                    aria-label="Default select example"
                  >
                    <option value="cricket">Cricket</option>
                    <option value="tennis">Tennis</option>
                    <option value="soccer">Soccer</option>
                    <option value="casino">Casino</option>
                  </Form.Select>
                </div>
                <div className="find-member-sec search_banking_detail">
                  <Form id={"searchForm"}>
                    <Form.Group className="position-relative">
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Find match..."
                          value={keyword}
                          onChange={(e) => {
                            setKeyword(e.target.value);
                          }}
                        />
                        <i className="fas fa-search"></i>
                        <Button className="search-btn" onClick={getMatchData}>
                          Search
                        </Button>
                      </Form.Group>
                    </Form.Group>
                  </Form>
                </div>
                {user?.userType === "owner" && (
                  <>
                    <div className="bet-sec">
                      <Form.Label
                        className="mt-2 me-2"
                        style={{ marginLeft: "10px" }}
                      >
                        Sports :
                      </Form.Label>
                      <Form.Select
                        value={sportName}
                        onChange={(e) => {
                          setSportName(e.target.value);
                        }}
                        aria-label="Default select example"
                      >
                        <option value="cricket">Cricket</option>
                        <option value="tennis">Tennis</option>
                        <option value="soccer">Soccer</option>
                      </Form.Select>
                      <Form.Label
                        className="mt-2 me-2"
                        style={{ marginLeft: "10px" }}
                      >
                        Api Type :
                      </Form.Label>
                      <Form.Select
                        value={apiType}
                        style={{ width: "200px" }}
                        onChange={(e) => {
                          setApiType(e.target.value);
                        }}
                        aria-label="Default select example"
                      >
                        <option value="betFair">JD Betfair</option>
                        <option value="jackApi">Jack Api</option>
                        {/* <option value="Diamond">Diamond</option> */}
                      </Form.Select>
                    </div>
                    <Button
                      className="theme_dark_btn"
                      style={{ marginLeft: "10px" }}
                      onClick={setConfirmToggle}
                    >
                      Get Data
                    </Button>
                  </>
                )}
              </div>
              {(checkbox.length > 0 && user?.userType === "owner") && (
                <div
                  className="mb-4 add_match_head"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <span
                    className="green-btn cursor-pointer"
                    style={{
                      padding: "6px",

                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setOpen(true);
                      setModel({ ...model, status: "Allactive" });
                      setUpdateAll("active");
                    }}
                  >
                    {" "}
                    Mark Selected Active
                  </span>
                  <span
                    onClick={() => {
                      setOpen(true);
                      setModel({ ...model, status: "Allabounded" });
                      setUpdateAll("abounded");
                    }}
                    className="green-btn cursor-pointer"
                    style={{
                      padding: "6px",

                      cursor: "pointer",
                    }}
                  >
                    Mark Selected Abounded
                  </span>
                  <span
                    onClick={() => {
                      setOpen(true);
                      setModel({ ...model, status: "Alldelete" });
                      setUpdateAll("delete");
                    }}
                    className="green-btn cursor-pointer"
                    style={{
                      padding: "6px",

                      cursor: "pointer",
                    }}
                  >
                    Mark Selected Delete
                  </span>
                </div>
              )}
              <div className="account-table batting-table add-match-table">
                <div className="responsive">
                  <caption className="d-block text-start">
                    {obj.matchType[search_params.gameType]}
                  </caption>
                  <Table>
                    <thead>
                      <tr>
                        {(matchData?.data?.length > 0) && (
                          <th scope="col">
                            {(user?.userType === "owner")?(<input
                              checked={selectAll}
                              type="checkbox"
                              name="selectAll"
                              onChange={(e) =>
                                selectCheckbox(e.target.checked, e.target.name)
                              }
                            />):""}
                          </th>
                        )}
                        <th scope="col">Event ID</th>
                        <th scope="col"> Market ID </th>
                        <th scope="col">Match Name</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchData?.data &&
                        matchData?.data.map((matchList, index) => {
                          return (
                            <tr key={index + 1}>
                              <td>
                                {(user?.userType === "owner") && (
                                  <input
                                    type="checkbox"
                                    name={matchList.eventId}
                                    checked={matchList.checked}
                                    onChange={(e) =>
                                      selectCheckbox(
                                        e.target.checked,
                                        e.target.name
                                      )
                                    }
                                  />
                                  )}
                              </td>
                              <td>{matchList?.eventId}</td>
                              <td>{matchList.marketId}</td>
                              <td>
                                {helpers.dateFormat(
                                  matchList.eventDateTime,
                                  user.timeZone
                                )}{" "}
                                <strong className="d-block mt-2">
                                  {matchList.eventName}
                                </strong>
                              </td>
                              <td>
                              {user?.userType === "owner" && (
                                <>
                                <Link
                                  to="#"
                                  className="green-btn"
                                  onClick={function (e) {
                                    setData(
                                      "active",
                                      matchList._id,
                                      matchList.eventId,
                                      matchList.eventName
                                    );
                                  }}
                                >
                                  {" "}
                                  Mark Active
                                </Link>
                                <span
                                  onClick={() => {
                                    setOpen(true);
                                    setModel({
                                      status: "abounded",
                                      id: matchList.eventId,
                                    });
                                  }}
                                  className="green-btn cursor-pointer"
                                  style={{
                                    padding: "6px",

                                    cursor: "pointer",
                                  }}
                                >
                                  Mark Abounded
                                </span>
                                <span
                                  onClick={() => {
                                    setOpen(true);
                                    setModel({
                                      status: "delete",
                                      id: matchList.eventId,
                                    });
                                  }}
                                  className="green-btn cursor-pointer"
                                  style={{
                                    padding: "6px",

                                    cursor: "pointer",
                                  }}
                                >
                                  Mark Delete
                                </span>
                                </>)}
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

      {/* mark-active-modal */}
      <Modal show={confirm} onHide={setConfirmToggle} className="block-modal">
        <Modal.Header className="border-0">
          {/* <Modal.Title className="modal-title-status">
            {getMatchStatus} - {getEventName} ({getEventID})
          </Modal.Title> */}
        </Modal.Header>
        <Modal.Body className="py-3">
          <div className="block-modal-content">
            <h3>Are you sure you want to fetch records</h3>
            <div className="text-center">
              <Button
                type="submit"
                className="green-btn me-3"
                onClick={() => fetchMatchData()}
              >
                {isLoader ? "Loading..." : "Confirm"}
              </Button>
              <Button className="green-btn" onClick={setConfirmToggle}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* mark-active-modal */}

      {/* mark-active-modal */}
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
      {/* mark-active-modal */}
      <UpdateDialogBox
        open={open}
        onClose={setOpenToggle}
        onSubmit={
          model.status == "Allactive" ||
          model.status == "Alldelete" ||
          model.status == "Allabounded"
            ? updateAllStatus
            : setUpdateStatus
        }
        isLoader={isLoader}
        headerTitle={"Decision"}
        title={
          model.status == "Allactive"
            ? "You Want to Active Match"
            : model.status == "delete" || model.status == "Alldelete"
            ? "You Want to Delete Match"
            : model.status == "abounded" || model.status == "Allabounded"
            ? "You Want to Abounded Match"
            : ``
        }
      />
    </div>
  );
};

export default AddMatch;
