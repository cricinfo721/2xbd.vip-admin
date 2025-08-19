import React, { useState, useEffect, useContext } from "react";
import { Button, Container, Form, Table, Modal } from "react-bootstrap";
import { apiGet, apiPut } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import { isEmpty } from "lodash";
import ReactPaginate from "react-paginate";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "wc-toast";

const SportSetting = () => {
  let { user } = useContext(AuthContext);
  const [gameType, setGameType] = useState("cricket");
  const [matchData, setMatchData] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [activeClass, setActiveClass] = useState("cricket");
  const [viewpage, setViewPage] = useState(0);
  const [apiType, setApiType] = useState("betFair");
  const [key, setKey] = useState("");
  const [open, setOpen] = useState(false);
  // const [adsStatus, setAdsStatus] = useState({
  //   adsStatus: "",
  // });
  // const [adsContent, setAdsContent] = useState({
  //   adsContent: "",
  // });
  const [addsOpen, setAddsOpen] = useState(false);
  const [addsLink, setAddsLink] = useState("");

  const [model, setModel] = useState({
    type: "",
    id: "",
    check: "",
  });

  const setOpenToggle = () => {
    setOpen(!open);
    setModel({
      type: "",
      id: "",
      check: "",
    });
  };

  const [addsModel, setAddsModel] = useState({
    id: "",
    adsStatus: "",
    adsContent: "",
  });

  const setAddsOpenToggle = () => {
    setAddsOpen(!addsOpen);
    setModel({
      id: "",
    });
  };

  const reset = () => {
    setModel({
      type: "",
      id: "",
      check: "",
    });
    setOpen(false);
    setIsLoader(false);
  };
  const [keyword, setKeyword] = useState("");
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    gameType: gameType,
  });

  const getMatchData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.blockmarketList,
      {
        ...search_params,
        keyword: keyword,
      }
    );
    if (status === 200) {
      if (response_users.success) {
        setModel({
          type: "",
          id: "",
          check: "",
        });
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

  const handleGameType = (game) => {
    setGameType(game);
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: 1,
        limit: 100,
        gameType: game,
      };
    });
    setKey("");
    setActiveClass(game);
  };

  useEffect(() => {
    setPageCount(matchData?.totalPages || []);
  }, [matchData]);

  useEffect(() => {
    getMatchData();
    setViewPage(search_params.page ? search_params.page - 1 : 0);
  }, [search_params]);

  const [isLoader, setIsLoader] = useState(false);
  const setfancy = async () => {
    setIsLoader(true);
    let path;
    if (model.type == "fancy") {
      path = apiPath.setFancy;
    } else {
      path = apiPath.setBookmaker;
    }
    try {
      const { status, data: response_users } = await apiGet(
        path + "?type=" + apiType + `&eventId=${model.id}`
      );
      if (status === 200) {
        if (response_users.success) {
          reset();
          getMatchData();
          toast.success(response_users.message);
        } else {
          reset();
          toast.error(response_users.message);
        }
      }
    } catch (err) {
      reset();
      toast.error(err.response.data.message);
    }
  };

  const setfancyUpdate = async () => {
    setIsLoader(true);
    let path;
    if (model.type == "fancy") {
      path = apiPath.setFancyupdate;
    } else {
      path = apiPath.setBookmakerUpdate;
    }
    try {
      const { status, data: response_users } = await apiGet(
        path + "?type=" + apiType + `?seriesId=${model.id}`
      );
      if (status === 200) {
        if (response_users.success) {
          getMatchData();
          toast.success(response_users.message);
          reset();
        } else {
          reset();
          toast.error(response_users.message);
        }
      }
    } catch (err) {
      reset();
      toast.error(err.response.data.message);
    }
  };
  const setAddsUpdate = async () => {
    setIsLoader(true);
    let path = apiPath.addMatchAds;
    try {
      // console.log("addsModel.adsStatus", addsModel.adsStatus);
      const { status, data: response_users } = await apiPut(
        path + `/${addsModel.id}`,
        {
          adsContent: addsModel.adsContent,
          adsStatus: addsModel.adsStatus ? true : false,
        }
      );
      if (status === 200) {
        if (response_users.success) {
          reset();
          getMatchData();
          setAddsModel({
            id: "",
            adsStatus: "",
            adsContent: "",
          });
          setAddsOpen(false);
          toast.success(response_users.message);
        } else {
          reset();
          toast.error(response_users.message);
        }
      }
    } catch (err) {
      reset();
      toast.error(err.response.data.message);
    }
  };
  console.log("addsModel", addsModel);
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Sport Settings</h2>
          </div>

          <div className="inner-wrapper">
            <div className="common-container">
              <div className="bet_status mb-4">
                <div className="history-btn" style={{ display: "flex" }}>
                  <ul className="list-unstyled mb-0">
                    <li>
                      <a
                        href="#"
                        className={
                          activeClass === "cricket" ? "active" : "theme_dar"
                        }
                        onClick={() => {
                          handleGameType("cricket");
                        }}
                      >
                        Cricket
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className={activeClass === "tennis" ? "active" : ""}
                        onClick={() => {
                          handleGameType("tennis");
                        }}
                      >
                        Tennis
                      </a>
                    </li>
                    <li>
                      {" "}
                      <a
                        href="#"
                        className={activeClass === "soccer" ? "active" : ""}
                        onClick={() => {
                          handleGameType("soccer");
                        }}
                      >
                        Soccer
                      </a>
                    </li>
                  </ul>
                  <div className="find-member-sec search_banking_detail">
                    <Form id={"searchForm"}>
                      <Form.Group className="position-relative">
                        <Form.Group>
                          <Form.Control
                            type="text"
                            placeholder="Find match..."
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
                </div>
              </div>

              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">S.no</th>
                        <th scope="col">Game</th>
                        <th scope="col"> Series Name </th>
                        <th scope="col">Market ID</th>
                        <th scope="col">Open Date</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchData?.data &&
                        matchData?.data.map((matchList, index) => {
                          return (
                            <>
                              <tr key={index}>
                                <td>
                                  <span style={{ marginRight: "10px" }}>
                                    {key === index ? (
                                      <i
                                        className="fa-solid fa-minus"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          setKey("");
                                        }}
                                      ></i>
                                    ) : (
                                      <i
                                        className="fa-solid fa-plus"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          setKey(index);
                                        }}
                                      ></i>
                                    )}
                                  </span>
                                  <span>{index + 1}</span>
                                </td>
                                <td>{matchList.gameType}</td>
                                <td>{matchList.seriesName}</td>
                                <td>{matchList.marketId}</td>
                                <td>
                                  {helpers.dateFormat(
                                    matchList.updatedAt,
                                    user.timeZone
                                  )}
                                </td>
                                <td>
                                  <Link
                                    to={`/SetLimit/${matchList.seriesId}/series`}
                                    state={matchList.matchSetting}
                                    className="green-btn theme_dark_btn rounded-1"
                                  >
                                    Set Limit
                                  </Link>

                                  {/* <span
                                    onClick={() => {
                                      setOpen(true);
                                      setModel({
                                        type: "fancy",
                                        id: matchList.seriesId,
                                        check: "series",
                                      });
                                    }}
                                    className="green-btn cursor-pointer theme_dark_btn rounded-1"
                                    style={{
                                      padding: "6px",

                                      cursor: "pointer",
                                    }}
                                  >
                                    Set Fancy
                                  </span>

                                  <span
                                    onClick={() => {
                                      setOpen(true);
                                      setModel({
                                        type: "bookamker",
                                        id: matchList.seriesId,
                                        check: "series",
                                      });
                                    }}
                                    className="green-btn cursor-pointer theme_dark_btn rounded-1"
                                    style={{
                                      padding: "6px",

                                      cursor: "pointer",
                                    }}
                                  >
                                    Set Bookamker
                                  </span> */}
                                </td>
                              </tr>
                              {index === key && (
                                <tr>
                                  <td colSpan={7}>
                                    <Table>
                                      <thead>
                                        <tr>
                                          <th scope="col">S.no</th>
                                          <th scope="col">Match ID</th>
                                          <th scope="col"> Match Name </th>
                                          <th scope="col">Market</th>
                                          <th scope="col">Market ID</th>
                                          <th scope="col">Open Date</th>
                                          <th scope="col">Action</th>
                                        </tr>
                                      </thead>
                                      {matchList.matchList.map((item, id) => {
                                        return (
                                          <tbody>
                                            <tr key={id}>
                                              <td>
                                                <span>{id + 1}</span>
                                              </td>
                                              <td>{item?.eventId}</td>
                                              <td>{item?.eventName}</td>
                                              <td>{item?.market}</td>
                                              <td>{item?.marketId}</td>
                                              <td>
                                                {helpers.dateFormat(
                                                  item.eventDateTime,
                                                  user.timeZone
                                                )}
                                              </td>
                                              <td>
                                                <Link
                                                  to={`/SetLimit/${item.eventId}/event`}
                                                  state={item.matchSetting}
                                                  className="green-btn"
                                                >
                                                  Set Limit
                                                </Link>
                                                {search_params.gameType ==
                                                  "cricket" &&
                                                item?.fancyList?.length == 0 ? (
                                                  <span
                                                    onClick={() => {
                                                      setOpen(true);
                                                      setModel({
                                                        type: "fancy",
                                                        id: item.eventId,
                                                        check: "event",
                                                      });
                                                    }}
                                                    className="green-btn cursor-pointer"
                                                    style={{
                                                      padding: "6px",

                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    Set Fancy
                                                  </span>
                                                ) : (
                                                  <span
                                                    onClick={() => {
                                                      setOpen(true);
                                                      setModel({
                                                        type: "fancy",
                                                        id: item.eventId,
                                                        check: "event",
                                                      });
                                                    }}
                                                    className="green-btn cursor-pointer"
                                                    style={{
                                                      padding: "6px",

                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    Update Fancy
                                                  </span>
                                                )}
                                                {item?.bookmakerRunners
                                                  ?.length == 0 ? (
                                                  <span
                                                    onClick={() => {
                                                      setOpen(true);
                                                      setModel({
                                                        type: "bookamker",
                                                        id: item.eventId,
                                                        check: "event",
                                                      });
                                                    }}
                                                    className="green-btn cursor-pointer"
                                                    style={{
                                                      padding: "6px",

                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    Set Bookmaker
                                                  </span>
                                                ) : (
                                                  <span
                                                    onClick={() => {
                                                      setOpen(true);
                                                      setModel({
                                                        type: "bookamker",
                                                        id: item.eventId,
                                                        check: "event",
                                                      });
                                                    }}
                                                    className="green-btn cursor-pointer"
                                                    style={{
                                                      padding: "6px",

                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    Update Bookmaker
                                                  </span>
                                                )}
                                                {item?.adsContent ? (
                                                  <span
                                                    onClick={() => {
                                                      setAddsOpen(true);
                                                      setAddsModel({
                                                        id: item.eventId,
                                                        adsStatus:
                                                          item.adsStatus,
                                                        adsContent:
                                                          item.adsContent,
                                                      });
                                                    }}
                                                    className="green-btn cursor-pointer"
                                                    style={{
                                                      padding: "6px",
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    Update Adds
                                                  </span>
                                                ) : (
                                                  <span
                                                    onClick={() => {
                                                      setAddsOpen(true);
                                                      setAddsModel({
                                                        id: item.eventId,
                                                        adsStatus:
                                                          item.adsStatus,
                                                        adsContent:
                                                          item.adsContent,
                                                      });
                                                    }}
                                                    className="green-btn cursor-pointer"
                                                    style={{
                                                      padding: "6px",
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    Set Adds
                                                  </span>
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        );
                                      })}
                                      {isEmpty(matchList.matchList) ? (
                                        <tr>
                                          <td colSpan={9}>No records found</td>
                                        </tr>
                                      ) : null}
                                    </Table>
                                  </td>
                                </tr>
                              )}
                            </>
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
      <Modal show={open} onHide={setOpenToggle} className="block-modal">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="modal-title-status">Decision</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <div className="block-modal-content">
            <h3>
              {model.type == "fancy"
                ? "You Want to set Fancy"
                : "You Want to set Bookmaker"}
            </h3>
            <div className="mb-2 d-flex align-items-center">
              <Form.Group className="d-flex  mb-2">
                <Form.Label className="p-2"> Select Type</Form.Label>
                <Form.Select
                  value={apiType}
                  style={{ width: "200px" }}
                  onChange={(e) => {
                    setApiType(e.target.value);
                  }}
                  aria-label="Default select example"
                >
                  <option value="betFair">Betfair</option>
                  <option value="Diamond">Diamond</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="text-center">
              {isLoader ? (
                <Button type="submit" className="green-btn me-3">
                  ...Loading
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="green-btn me-3"
                  onClick={model.check == "series" ? setfancyUpdate : setfancy}
                >
                  Confirm
                </Button>
              )}
              <Button className="green-btn" onClick={setOpenToggle}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={addsOpen} onHide={setAddsOpenToggle} className="block-modal">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="modal-title-status">Set Tv Ads</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <div className="block-modal-content">
            <div className="mb-2 d-flex align-items-center">
              <Form.Group className="d-flex align-items-center mb-2">
                <Form.Label className="pe-2 mb-0">Ads Link </Form.Label>
                <Form.Control
                  type="text"
                  name="adsContent"
                  placeholder="Enter Links"
                  value={addsModel.adsContent}
                  onChange={(e) =>
                    setAddsModel({
                      id: addsModel.id,
                      adsStatus: addsModel.status ? addsModel.status : false,
                      adsContent: e.target.value,
                    })
                  }
                  className="me-3"
                />
              </Form.Group>
              <input
                className="me-2"
                checked={addsModel.adsStatus}
                type="checkbox"
                name="adsShowing"
                onChange={(e) =>
                  setAddsModel({
                    id: addsModel.id,
                    adsStatus: e.target.checked,
                    adsContent: addsModel.adsContent,
                  })
                }
              />
              ON (IS SHOWING)
            </div>
            <div className="text-center">
              {isLoader ? (
                <Button type="submit" className="green-btn me-3">
                  ...Loading
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="green-btn me-3"
                  onClick={setAddsUpdate}
                >
                  Submit
                </Button>
              )}
              <Button className="green-btn" onClick={setAddsOpenToggle}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SportSetting;
