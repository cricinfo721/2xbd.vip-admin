import React, { useState, useEffect, useContext } from "react";
import { Container, Table, Form } from "react-bootstrap";
import { apiGet, apiPost, apiPut } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import { isEmpty } from "lodash";
import ReactPaginate from "react-paginate";
import { toast } from "wc-toast";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
import UpdateDialogBox from "../components/UpdateDialogBox";
import CasinoUpdateDialogBox from "../components/CasinoUpdateDialogBox";
import constant from "../utils/constants";
import { get } from "react-hook-form";

const BlockMarket = () => {
  let { user } = useContext(AuthContext);
  const [blockStatus, setBlockStatus] = useState(false);
  const setBlockStatusToggle = () => setBlockStatus(!blockStatus);
  const [getSportData, setSportData] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    gameType: "cricket",
    status: "active",
  });
  const [matchData, setMatchData] = useState("");
  const [casinoData, setCasinoData] = useState("");
  
  const [getSportId, setSportId] = useState("");
  const [getSportStatus, setSportStatus] = useState("");
  const [isLoader, setLoader] = useState(false);
  const [key, setKey] = useState("");
  const [blockMatchStatus, setMatchBlockStatus] = useState(false);
  const [viewpage, setViewPage] = useState(0);
  const [getMatchStatus, setMatchStatus] = useState("");
  const [gameListingUpdate, setGameListingUpdate] = useState({});
  const [sportsListingUpdate, setSportsListingUpdate] = useState({});
  const [sportsListingUpdateId, setSportsListingUpdateId] = useState("");

  const [casinoListingUpdate, setCasinoListingUpdate] = useState({});
  const [blockCasinoStatus, setCasinoBlockStatus] = useState(false);
  const setCasinoBlockStatusToggle = () =>setCasinoBlockStatus(!blockCasinoStatus);

  
  const mySportData = async () => {
    const { status, data: response_users } = await apiGet(apiPath.sportList);
    if (status === 200) {
      if (response_users.success) {
        setSportData(response_users.results);
      }
    }
  };
  useEffect(() => {
    mySportData();
  }, []);
  const setDataForStatusChange = (id, status) => {
    setSportId(id);
    setSportStatus(status);
    setBlockStatusToggle();
  };
  const updateSportStatus = async () => {
    setLoader(true);
    if (getSportId && getSportStatus) {
      try {
        const { status, data: response_users } = await apiPut(
          apiPath.updateSportStatus + "/" + getSportId,
          { status: getSportStatus === "active" ? "suspend" : "active" }
        );
        if (status === 200) {
          if (response_users.success) {
            setBlockStatusToggle();
            setLoader(false);
            mySportData();
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
  const setMatchBlockStatusToggle = () =>setMatchBlockStatus(!blockMatchStatus);

  const getMatchData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.blockmarketList,
      search_params
    );
    // setKey('')
    if (status === 200) {
      if (response_users.success) {
        setMatchData(response_users.results);
      }
    }
  };
  const getCasinoData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.blockCasinoList
    );
    // setKey('')
    if (status === 200) {
      if (response_users.success) {
        setCasinoData(response_users.results);
      }
    }
  };
  const reset = () => {
    setMatchBlockStatusToggle();
    setLoader(false);
    setGameListingUpdate({});
    setSportsListingUpdateId("");
    setSportsListingUpdate({});

  };
  const casinoReset = () => {
    setLoader(false);
    setCasinoBlockStatus();
    setCasinoBlockStatusToggle();
    setCasinoBlockStatusToggle();
  };
  
  const updateMatchStatusSports = async () => {
    setLoader(true);
    try {
      const { status, data: response_users } = await apiPut(
        apiPath.updateSportsListingStatus + `/${sportsListingUpdateId}`,
        sportsListingUpdate
      );
      if (status === 200) {
        if (response_users.success) {
          reset();
          mySportData();
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
  };

  const updateMatchStatus = async () => {
    setLoader(true);
    try {
      const { status, data: response_users } = await apiPost(
        apiPath.updateBlockListinStatus,
        gameListingUpdate
      );
      if (status === 200) {
        if (response_users.success) {
          reset();
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
  };
  const updateCasinoStatus = async () => {
    setLoader(true);
    try {
      const { status, data: response_users } = await apiPut(
        apiPath.updateBlockCasinoStatus,
        casinoListingUpdate
      );
      if (status === 200) {
        if (response_users.success) {
          casinoReset();
          getCasinoData();
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
  useEffect(() => {
    setPageCount(matchData?.totalPages || []);
  }, [matchData]);


  useEffect(() => {
    getMatchData();
    getCasinoData();
    setViewPage(search_params.page ? search_params.page - 1 : 0);
  }, [search_params]);
  return (
    <div>
      <section className="account-table">
        <Container fluid className="mt-4">
          <h2 className="common-heading">Sport Listing</h2>
          <div className="responsive">
            <Table>
              <thead>
                <tr>
                  <th scope="col">S.No.</th>
                  <th scope="col">Betfair ID </th>
                  <th scope="col">Name </th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                  {/* <th scope="col">Banking</th>
                  <th scope="col">International Market</th> */}
                </tr>
              </thead>
              <tbody>
                {getSportData?.data &&
                  getSportData?.data?.length > 0 &&
                  getSportData?.data?.map((item, key) => (
                    <tr key={key}>
                      <td>{key + 1}</td>
                      <td>{item?.betfairId}</td>
                      <td>
                        <a href="#">{item?.name}</a>
                      </td>
                      <td>
                        {item?.name}{" "}
                        {item?.status === "active" ? " is ON" : " is OFF"}
                      </td>
                      <td>
                        {" "}
                        <Form.Check
                          type="switch"
                          id="custom-switch"
                          checked={item?.status === "active" ? true : false}
                          disabled={(item?.isUplineDisable)?true:false}
                          onClick={function (e) {
                            setSportsListingUpdate({
                              status:
                                item?.status === "active"
                                  ? "inActive"
                                  : "active",
                            });
                            setMatchStatus(
                              item?.status === "active" ? "InActive" : "Active"
                            );
                            setSportsListingUpdateId(item?._id);
                            setMatchBlockStatusToggle();
                          }}
                        />
                      </td>
                      {/* <td>
                        {" "}
                        <Form.Check
                          type="switch"
                          id="custom-switch"
                          checked={item?.banking === "on" ? true : false}
                          onClick={function (e) {
                            setSportsListingUpdate({
                              banking: item?.banking === "on" ? "off" : "on",
                            });
                            setMatchStatus(
                              item?.banking === "on" ? "Off" : "On"
                            );
                            setSportsListingUpdateId(item?._id);
                            setMatchBlockStatusToggle();
                          }}
                        />
                      </td>
                      <td>
                        {" "}
                        <Form.Check
                          type="switch"
                          id="custom-switch"
                          checked={
                            item?.internationalMarket === "on" ? true : false
                          }
                          onClick={function (e) {
                            setSportsListingUpdate({
                              internationalMarket:
                                item?.internationalMarket === "on"
                                  ? "off"
                                  : "on",
                            });
                            setMatchStatus(
                              item?.internationalMarket === "on" ? "Off" : "On"
                            );
                            setSportsListingUpdateId(item?._id);
                            setMatchBlockStatusToggle();
                          }}
                        />
                      </td> */}
                    </tr>
                  ))}

                {isEmpty(getSportData.data) ? (
                  <tr>
                    <td colSpan={9}>No records found</td>
                  </tr>
                ) : null}
              </tbody>
            </Table>
          </div>
        </Container>
      </section>

      {/* games-listing */}

      {user.userType==="owner" || user.userType==="sub_owner"  ?(
      <>
        <section className="games-listing account-table mt-3">
          <Container fluid>
            <div className="d-flex align-items-center">
              <h2 className="common-heading" style={{ marginRight: "15px" }}>
                Games Listing
              </h2>
              <Form.Select
                value={search_params.gameType}
                onChange={(e) => {
                  setSearchParams({
                    ...search_params,
                    gameType: e.target.value,
                    page: 1,
                  });
                  setViewPage(0);
                  setKey("");
                }}
                aria-label="Default select example"
                className="mb-3 w-25"
              >
                <option value="cricket">Cricket</option>
                <option value="tennis">Tennis</option>
                <option value="soccer">Soccer</option>
                <option value="casino">Casino</option>
              </Form.Select>
            </div>

            <div className="responsive">
              <Table>
                <thead>
                  <tr>
                    <th scope="col">S.No.</th>
                    <th scope="col">Series Name </th>
                    <th scope="col">Date </th>
                    <th scope="col">Match Odds ON/OFF</th>
                    <th scope="col">Book Maker ON/OFF</th>
                    <th scope="col">Fancy ON/OFF</th>
                    <th scope="col">Premium Fancy ON/OFF</th>
                  </tr>
                </thead>
                <tbody>
                
                  {matchData.data &&
                    matchData?.data?.map((matchList, index) => {
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
                            <td>
                              <a href="#">{matchList.seriesName}</a>
                            </td>
                            <td>
                              {helpers.dateFormat(
                                matchList.updatedAt,
                                user.timeZone
                              )}
                            </td>
                            <td>
                              {" "}
                              <Form.Check
                                type="switch"
                                id="custom-switch"
                                disabled={(matchList?.matchOddsUplineDisable)?true:false}
                                checked={
                                  matchList?.matchOdds === "on" ? true : false
                                }
                                onClick={(e) => {
                                  setGameListingUpdate({
                                    seriesId: matchList?.seriesId,
                                    matchOdds:
                                      matchList?.matchOdds === "on"
                                        ? "off"
                                        : "on",
                                  });
                                  setMatchStatus(
                                    matchList?.matchOdds === "on" ? "Off" : "On"
                                  );
                                  setMatchBlockStatusToggle();
                                }}
                              />
                            </td>
                            <td>
                              {" "}
                              <Form.Check
                                type="switch"
                                id="custom-switch"
                                disabled={(matchList?.bookMakerUplineDisable)?true:false}
                                checked={
                                  matchList?.bookMaker === "on" ? true : false
                                }
                                onClick={(e) => {
                                  setGameListingUpdate({
                                    seriesId: matchList?.seriesId,
                                    bookMaker:
                                      matchList?.bookMaker === "on"
                                        ? "off"
                                        : "on",
                                  });
                                  setMatchStatus(
                                    matchList?.bookMaker === "on" ? "Off" : "On"
                                  );
                                  setMatchBlockStatusToggle();
                                }}
                              />
                            </td>
                            <td>
                              <Form.Check
                                type="switch"
                                id="custom-switch"
                                disabled={(matchList?.fancyUplineDisable)?true:false}
                                checked={matchList?.fancy === "on" ? true : false}
                                onClick={(e) => {
                                  setGameListingUpdate({
                                    seriesId: matchList?.seriesId,
                                    fancy:
                                      matchList?.fancy === "on" ? "off" : "on",
                                  });
                                  setMatchStatus(
                                    matchList?.fancy === "on" ? "Off" : "On"
                                  );
                                  setMatchBlockStatusToggle();
                                }}
                              />
                            </td>
                            <td>
                              <Form.Check
                                type="switch"
                                id="custom-switch"
                                disabled={(matchList?.premiumFancyUplineDisable)?true:false}
                                checked={
                                  matchList?.premiumFancy === "on" ? true : false
                                }
                                onClick={(e) => {
                                  setGameListingUpdate({
                                    seriesId: matchList?.seriesId,
                                    premiumFancy:
                                      matchList?.premiumFancy === "on"
                                        ? "off"
                                        : "on",
                                  });
                                  setMatchStatus(
                                    matchList?.premiumFancy === "on"
                                      ? "Off"
                                      : "On"
                                  );
                                  setMatchBlockStatusToggle();
                                }}
                              />
                            </td>
                          </tr>
                          {index === key && (
                            <tr>
                              <td colSpan={7}>
                                <Table>
                                  <thead>
                                    <tr>
                                      <th scope="col">S.No.</th>
                                      <th scope="col">Match Name </th>
                                      <th scope="col">Market </th>
                                      <th scope="col">Date </th>
                                      <th scope="col">Match Odds ON/OFF</th>
                                      <th scope="col">Book Maker ON/OFF</th>
                                      <th scope="col">Fancy ON/OFF</th>
                                      <th scope="col">Premium Fancy ON/OFF</th>
                                    </tr>
                                  </thead>
                                  {matchList.matchList.map((item, id) => {
                                    return (
                                      <tbody>
                                        <tr key={id}>
                                          <td>{id + 1}</td>
                                          <td>
                                            <a href="#">{item?.eventName}</a>
                                          </td>
                                          <td>{item?.market}</td>
                                          <td>
                                            {helpers.dateFormat(
                                              item?.eventDateTime,
                                              user.timeZone
                                            )}
                                          </td>

                                          <td>
                                            {" "}
                                            <Form.Check
                                              type="switch"
                                              id="custom-switch"
                                              disabled={(item?.matchOddsUplineDisable)?true:false}
                                              checked={
                                                item?.matchOdds === "on"
                                                  ? true
                                                  : false
                                              }
                                              onClick={(e) => {
                                                setGameListingUpdate({
                                                  eventId: item?.eventId,
                                                  matchOdds:
                                                    item?.matchOdds === "on"
                                                      ? "off"
                                                      : "on",
                                                });
                                                setMatchStatus(
                                                  item?.matchOdds === "on"
                                                    ? "Off"
                                                    : "On"
                                                );
                                                setMatchBlockStatusToggle();
                                              }}
                                            />
                                          </td>
                                          <td>
                                            {" "}
                                            <Form.Check
                                              type="switch"
                                              id="custom-switch"
                                              disabled={(item?.bookMakerUplineDisable)?true:false}
                                              checked={
                                                item?.bookMaker === "on"
                                                  ? true
                                                  : false
                                              }
                                              onClick={(e) => {
                                                setGameListingUpdate({
                                                  eventId: item?.eventId,
                                                  bookMaker:
                                                    item?.bookMaker === "on"
                                                      ? "off"
                                                      : "on",
                                                });
                                                setMatchStatus(
                                                  item?.bookMaker === "on"
                                                    ? "Off"
                                                    : "On"
                                                );
                                                setMatchBlockStatusToggle();
                                              }}
                                            />
                                          </td>
                                          <td>
                                            <Form.Check
                                              type="switch"
                                              id="custom-switch"
                                              disabled={(item?.fancyUplineDisable)?true:false}
                                              checked={
                                                item?.fancy === "on"
                                                  ? true
                                                  : false
                                              }
                                              onClick={(e) => {
                                                setGameListingUpdate({
                                                  eventId: item?.eventId,
                                                  fancy:
                                                    item?.fancy === "on"
                                                      ? "off"
                                                      : "on",
                                                });
                                                setMatchStatus(
                                                  item?.fancy === "on"
                                                    ? "Off"
                                                    : "On"
                                                );
                                                setMatchBlockStatusToggle();
                                              }}
                                            />
                                          </td>
                                          <td>
                                            <Form.Check
                                              type="switch"
                                              id="custom-switch"
                                              disabled={(item?.premiumFancyUplineDisable)?true:false}
                                              checked={
                                                item?.premiumFancy === "on"
                                                  ? true
                                                  : false
                                              }
                                              onClick={(e) => {
                                                setGameListingUpdate({
                                                  eventId: item?.eventId,
                                                  premiumFancy:
                                                    item?.premiumFancy === "on"
                                                      ? "off"
                                                      : "on",
                                                });
                                                setMatchStatus(
                                                  item?.premiumFancy === "on"
                                                    ? "Off"
                                                    : "On"
                                                );
                                                setMatchBlockStatusToggle();
                                              }}
                                              
                                            />
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
                  {isEmpty(matchData.data) ? (
                    <tr>
                      <td colSpan={9}>No records found</td>
                    </tr>
                  ) : null}
                </tbody>
              </Table>
              {matchData?.data?.length == 0 && (
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
              )}
            </div>
          </Container>
        </section>
        <section className="games-listing account-table mt-3">
          <Container fluid>
            <div className="d-flex align-items-center">
              <h2 className="common-heading" style={{ marginRight: "15px" }}>
                Casino Listing
              </h2>
            
            </div>

            <div className="responsive">
              <Table>
                <thead>
                  <tr>
                    <th scope="col">S.No.</th>
                    <th scope="col">Casino Name</th>
                    <th scope="col">Plateform </th>
                    <th scope="col">Game Type </th>
                    <th scope="col">Game Code </th>
                    <th scope="col">ON/OFF</th>
                  </tr>
                </thead>
                <tbody>
                
                  {casinoData.length>0 &&
                    casinoData?.map((dt, index) => {
                      return (
                        <>
                          <tr key={index}>
                            <td>
                            
                              <span>{index + 1}</span>
                            </td>
                            <td>
                              {dt.name}
                            </td>
                            <td>
                              {dt.platForm}
                            </td>
                            <td>
                              {dt.gameType}
                            </td>
                            <td>
                              {dt.casinoType}
                            </td>
                            
                            <td>
                              {" "}
                              <Form.Check
                                type="switch"
                                id="custom-switch"
                              
                                checked={
                                  dt?.status === "on" ? true : false
                                }
                                onClick={(e) => {
                                  setCasinoListingUpdate({
                                    name:dt?.name,
                                    platForm:dt?.platForm,
                                    gameCode:dt?.gameCode,
                                    gameType: dt?.gameType,
                                    status:
                                    dt?.status === "on"
                                        ? "off"
                                        : "on",
                                  });
                                  setMatchStatus(
                                    dt?.status === "on" ? "Off" : "On"
                                  );
                                  setCasinoBlockStatusToggle();
                                }}
                              />
                            </td>
                          
                          </tr>
                        
                        </>
                      );
                    })}
                  {isEmpty(matchData.data) ? (
                    <tr>
                      <td colSpan={9}>No records found</td>
                    </tr>
                  ) : null}
                </tbody>
              </Table>
            
            </div>
          </Container>
        </section>
      </>
      ):("")}
      <UpdateDialogBox
        open={blockMatchStatus}
        onClose={setMatchBlockStatusToggle}
        onSubmit={
          sportsListingUpdateId == ""
            ? updateMatchStatus
            : updateMatchStatusSports
        }
        isLoader={isLoader}
        headerTitle={"Block/Un-Block Match"}
        title={` You Want to ${getMatchStatus} This Match?`}
      />
      <CasinoUpdateDialogBox
        open={blockCasinoStatus}
        onClose={setCasinoBlockStatusToggle}
        onSubmit={ updateCasinoStatus  }
        isLoader={isLoader}
        headerTitle={"Block/Un-Block Casino"}
        title={` You Want to ${getMatchStatus} This Casino?`}
      />
    </div>
  );
};

export default BlockMarket;
