import { compact, isEmpty, startCase } from "lodash";
import React, { useEffect, useState } from "react";
import { Form, Table, Button, Modal ,Container} from "react-bootstrap";
import constants from "../../utils/constants";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useForm } from "react-hook-form";
import { apiPut, apiPost, apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import helpers from "../../utils/helpers";
import { toast } from "wc-toast";
import UpdateStatusUser from "../../components/UpdateStatusUser";
import UpdateDialogBox from "../../components/UpdateDialogBox";

const UserList = (props) => {
  
  const [currentItems, setCurrentItems] = useState([]);
  const location = useLocation();
  const user_params = compact(location.pathname.split("/"));
  const [pageCount, setPageCount] = useState(0);
  const [changeReference, setChangeReference] = useState(false);
  const setChangeReferenceToggle = () => setChangeReference(!changeReference);

  const [changeAwcLimit, setCreditAwcLimit] = useState(false);
  const setChangeAwcLimitToggle = () => setCreditAwcLimit(!changeAwcLimit);

  const [getUpdateId, setUpdateId] = useState("");
  const [exposureData, setExposureData] = useState("");
  const [exposure, setExposure] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);
  const [userData, setUserData] = useState({});
  const [getActiveClass, setActiveClass] = useState("");
  const [currentStatus, setCurrentStatus] = useState("downline");
  const setChangeStatusToggle = (item) => {
    if (item) {
      setChangeStatus(!changeStatus);
      setUserData(item);
      setActiveClass(item.status);
      // setCurrentStatus(item.status);
    } else {
      setChangeStatus(!changeStatus);
    }
  };


 
  
  const setExposureToggle = async (type, id) => {
    try {
      const { status, data: response_users } = await apiGet(
        apiPath.getExpouserData + `?userType=${type}&userId=${id}`
      );
      if (status === 200) {
        setExposureData(response_users.results.data);
        setExposure(true);
      }
    } catch (err) { }
  };

  const [isLoader, setLoader] = useState(false);

  useEffect(() => {
    setCurrentItems(props?.results?.data || []);
    setPageCount(Math.ceil(props?.results?.totalPages) || 0);
    // setItemOffset(props?.results?.limit || [])
  }, [props]);
  const [getCreditReference, setCreditReference] = useState("");

  const setDataForEditReference = (id, creditReference) => {
    setUpdateId(id);
    setCreditReference(creditReference);
    setChangeReferenceToggle();
  };

  const setDataForEditAwcLimit = (id, awcLimit) => {
    setUpdateId(id);
    setCreditAwcLimit(awcLimit);
    setChangeAwcLimitToggle();
  };

    


  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
    reset: reset1,
  } = useForm({});
  const onSubmit1 = async (request) => {
    setLoader(true);
    try {
      const { status, data: response_users } = await apiPost(
        apiPath.updateUserReferenceAmount,
        {
          user_id: getUpdateId,
          reference_amount: request.reference_amount,
          password: request.mypassword,
        }
      );
      if (status === 200) {
        if (response_users.success) {
          setChangeReferenceToggle();
          setLoader(false);
          props.getUsers();
          toast.success(response_users.message);
          reset1();
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

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
  } = useForm({});
  const onSubmit2 = async (request) => {
    setLoader(true);
    try {
      const { status, data: response_users } = await apiPost(
        apiPath.updateAwcLimit,
        {
          user_id: getUpdateId,
          limit: request.awcLimit,
          password: request.mypassword,
        }
      );
      if (status === 200) {
        if (response_users.success) {
          setChangeAwcLimitToggle();
          setLoader(false);
          props.getUsers();
          toast.success(response_users.message);
          reset2();
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
 

  const [blockMatchStatus, setMatchBlockStatus] = useState(false);
  const setMatchBlockStatusToggle = () =>setMatchBlockStatus(!blockMatchStatus);
  const [getMatchStatus, setMatchStatus] = useState("");
  const [BlockMarket, setBlockMarket] = useState(false);
  const setChangeBlockMarketToggle = () => setBlockMarket(!BlockMarket);
  const [getMarketBlockUserId, setMarketBlockUserId] = useState("");

  const setChangeBlockMarket = async(item) => {
    if (item) {
      setMarketBlockUserId(item?._id);
      const { status, data: response_users } = await apiGet(apiPath.sportList+"?userId="+item?._id);
      if (status === 200) {
        if (response_users.success) {
          setSportData(response_users.results);
          setChangeBlockMarketToggle();
        }
      }
      
    } 
  };

  const [sportsListingUpdate, setSportsListingUpdate] = useState({});
  const [sportsListingUpdateId, setSportsListingUpdateId] = useState("");
  const [getSportData, setSportData] = useState("");

  const mySportData = async () => {
    const { status, data: response_users } = await apiGet(apiPath.sportList+"?userId="+getMarketBlockUserId);
    if (status === 200) {
      if (response_users.success) {
        setSportData(response_users.results);
      }
    }
  };


  const updateMatchStatusSports = async () => {
    // setLoader(true);
    console.log("sportsListingUpdateId",sportsListingUpdateId,sportsListingUpdate,getMarketBlockUserId);
    
    try {
      const { status, data: response_users } = await apiPut(
        apiPath.updateSportsListingStatus + `/${sportsListingUpdateId}`,
        sportsListingUpdate
      );
      if (status === 200) {
        if (response_users.success) {
          
          mySportData();
          toast.success(response_users.message);
          reset();
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
  const reset = () => {
    
    setMatchBlockStatusToggle();
    setLoader(false);
    setSportsListingUpdateId("");
    setSportsListingUpdate({});

  };

  return (
    <>
      <section className="account-table">
        <div className="container-fluid">
          <div className="responsive table-color">
            <Table>
              <thead>
                <tr>
                <th scope="col">Sr .No.</th>
                  <th scope="col">Account</th>
                  <th scope="col" className="text-end">
                    Credit Ref.
                  </th>
                  <th scope="col" className="text-end">
                    Balance
                  </th>
                  {props?.data=="owner" && currentItems && currentItems[0]?.userType == "sub_owner" &&
                  <th scope="col" className="text-end">
                    Awc Limit
                  </th>}
                  {currentItems && currentItems[0]?.userType == "user" ? (
                    <th scope="col" className="text-end">
                      Exposure
                    </th>
                  ) : (
                    <th scope="col" className="text-end">
                      Player Exposure
                    </th>
                  )}

                  <th scope="col" className="text-end">
                    Avail. bal.{" "}
                  </th>
                  {currentItems && currentItems[0]?.userType != "user" ? (
                    <th scope="col" className="text-end">
                      Player Balance{" "}
                    </th>
                  ) : (
                    ""
                  )}
                  {user_params[1] == "agent" || props.data == "agent" ? (
                    <th scope="col" className="text-end">
                      Exposure Limit
                    </th>
                  ) : (
                    ""
                  )}
                  <th scope="col" className="text-end">
                    Commission's
                  </th>
                  <th scope="col" className="text-end">
                    Status
                  </th>
                  <th scope="col" className="text-end">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((user, index) => {
                  const balance = user?.userType == "user"
                  ? Math.sign(user?.totalCoins1 +Math.abs(user?.exposure)) === -1 ? (user?.totalCoins1 +Math.abs(user?.exposure)).toFixed(2):(user?.totalCoins1 +Math.abs(user?.exposure)).toFixed(2)
                  :   Math.sign(user?.totalCoins) === -1 ? user?.totalCoins.toFixed(2):user?.totalCoins.toFixed(2);
                  console.log('balance---',balance)
                  return (
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td className="text-start">
                        {user?.userType == "user" ? (
                          <>
                            <a href={"#"} className="text-primary">
                              <span>
                                {constants?.user_status[user?.userType || ""]}
                              </span>
                            </a>
                            {user?.username || null}
                          </>
                        ) : (
                          <Link
                            to={`/${user._id}/${user?.userType}`}
                            className="text-primary"
                          >
                            <span>
                              {constants?.user_status[user?.userType || ""]}
                            </span>
                            {user?.username || null}
                          </Link>
                        )}
                      </td>
                      <td className="text-end">
                        <a
                          href="#"
                          onClick={function (e) {
                            setDataForEditReference(
                              user._id,
                              user?.creditReference
                            );
                          }}
                          className="text-primary">
                          {`${helpers.currencyFormat(user?.creditReference)}` ||
                            null}{" "}
                          <i className="fas fa-pen ps-1"></i>
                        </a>
                      </td>
                      <td className="text-primary text-end">
                      {/* user?.userType == "agent"
                          ? Math.sign(user?.totalCoins +Math.abs(user?.exposure)) === -1 ? <p style={{color:`red`}}> {helpers.currencyFormat((user?.totalCoins +Math.abs(user?.exposure)).toFixed(2))}</p>:helpers.currencyFormat((user?.totalCoins +Math.abs(user?.exposure)).toFixed(2))
                         :  */}
                        { user?.userType == "user"
                          ? Math.sign(user?.totalCoins1 +Math.abs(user?.exposure)) === -1 ? <p style={{color:`red`}}> {helpers.currencyFormat((user?.totalCoins1 +Math.abs(user?.exposure)).toFixed(2))}</p>:helpers.currencyFormat((user?.totalCoins1 +Math.abs(user?.exposure)).toFixed(2))
                          :   Math.sign(user?.totalCoins) === -1 ? <p style={{color:`red`}}> {helpers.currencyFormat(user?.totalCoins.toFixed(2))}</p>:`${helpers.currencyFormat(user?.totalCoins.toFixed(2))}`}
                      </td>
                      {props?.data=="owner" && currentItems && currentItems[0]?.userType == "sub_owner" &&
                      <td className="text-end"><a
                          href="#"
                          onClick={function (e) {
                            setDataForEditAwcLimit(
                              user._id,
                              user?.awcLimit
                            );
                          }}
                          className="text-primary"
                        >
                          {user?.usedAwcLimit >= 0 || !user?.usedAwcLimit
                          ? `${helpers.currencyFormat(
                            (
                              Math.abs(user?.awcLimit) -
                              Math.abs(user?.usedAwcLimit)
                            ).toFixed(2)
                          )}`:`${helpers.currencyFormat(user?.awcLimit)}`}
                          <i className="fas fa-pen ps-1"></i>
                        </a></td>}
                      <td className="text-end">
                        <Link
                          to="#"
                          onClick={() =>
                            setExposureToggle(user?.userType, user?._id)
                          }
                        >
                          <span className="status-suspend1">
                            {helpers.currencyFormat(user?.exposure) || "0.00"}
                          </span>
                        </Link>
                      </td>
                      {/* <td className="text-end">
                        {(user?.totalCoins &&
                          helpers.currencyFormat((user?.userType)?user?.totalCoins1:user?.totalCoins)) ||
                          "0.00"}
                      </td> */}
                      <td className="text-end">
                      {/* user?.userType == "agent"
                          ? 
                            Math.sign(helpers.currencyFormat((user?.totalCoins))) === -1 ? <p style={{color:`red`}}> {helpers.currencyFormat(user?.totalCoins.toFixed(2))}</p>:helpers.currencyFormat((user?.totalCoins.toFixed(2)))
                          
                          :  */}
                        {user?.userType == "user"
                          ? 
                            Math.sign(helpers.currencyFormat((user?.totalCoins1))) === -1 ? <p style={{color:`red`}}> {helpers.currencyFormat(user?.totalCoins1.toFixed(2))}</p>:helpers.currencyFormat((user?.totalCoins1.toFixed(2)))
                          
                          : 
                          Math.sign(helpers.currencyFormat(user?.totalCoins - Math.abs(user?.exposure))) === -1 ? <p style={{color:`red`}}> {helpers.currencyFormat(user?.totalCoins - Math.abs(user?.exposure))}</p>:helpers.currencyFormat(user?.totalCoins- Math.abs(user?.exposure))
                          }
                      </td>
                      {user?.userType != "user" && (
                        <td className="text-end">
                          {" "}
                          {helpers.currencyFormat(user?.playerBalance) ||
                            "0.00"}{" "}
                        </td>
                      )}

                      {user_params[1] == "agent" || props.data == "agent" ? (
                        <td className="text-end">{helpers.currencyFormat(user?.exposureLimit)}</td>
                      ) : (
                        ""
                      )}
                      <td className="text-end">
                        {helpers.currencyFormat(user?.commission || 0)}
                      </td>
                      <td className="text-end">
                        <strong
                          className={classNames({
                            "status-active": user?.status === "active",
                            "status-suspend px-3": user?.status === "suspend",
                            "status-locked px-3": user?.status === "locked",
                          })}
                        >
                          {`${startCase(user?.status)}` || ""}
                        </strong>
                      </td>
                      <td className="action_link text-end">
                        <Link
                          title="Betting Profit Loss"
                          to={`/betting-profit-loss/${user?._id}/${user?.userType}`}
                          className="btn"
                        >
                          <i className="fas fa-exchange-alt swap-icon"></i>
                        </Link>
                        <Link
                          title="Betting History"
                          to={`/betting-history/${user?._id}/${user?.userType}`}
                          className="btn"
                        >
                          <i className="fas fa-th-list"></i>
                        </Link>
                        {props?.data=="owner"|| props?.data=="sub_owner"?
                        <a
                          title="Change Status"
                          className="btn"
                          onClick={function (e) {
                            setChangeStatusToggle(user);
                          }}
                        >
                          <i className="fas fa-cog"></i>
                        </a>:("")}
                        <Link
                          title="Account Summary"
                          to={`/account-summary/${user?._id}/${user?.userType}`}
                          className="btn"
                        >
                          <i className="fas fa-user"></i>
                        </Link>
                       {user?.userType!=="user" &&
                        <Link
                          title="Block Market"
                          // to={`/account-summary/${user?._id}/${user?.userType}`}
                          onClick={function (e) {
                            setChangeBlockMarket(user);
                          }}
                          className="btn"
                        >
                          <i className="fas fa-lock"></i>
                        </Link>
                }
                      </td>
                    </tr>
                  );
                })}
                {isEmpty(currentItems) ? (
                  <tr>
                    <td colSpan={10}>No records found</td>
                  </tr>
                ) : null}
              </tbody>
            </Table>
            <div className="bottom-pagination">
              <ReactPaginate
                breakLabel="..."
                nextLabel=" >"
                onPageChange={props.handlePageClick}
                pageRangeDisplayed={10}
                pageCount={pageCount}
                previousLabel="< "
                renderOnZeroPageCount={null}
                activeClassName="p-0"
                activeLinkClassName="pagintion-li"
              />
            </div>
          </div>
        </div>
      </section>
      <Modal
        className="exposure_modal"
        show={exposure}
        onHide={() => {
          setExposure(false);
          setExposureData("");
        }}
      >
        <Modal.Body className="p-0">
          <div className="exposure-content">
            <h2>Exposure Information</h2>
            <Table>
              <thead>
                <tr>
                  <th scope="col">Match Name</th>
                  <th scope="col">Market/FancyName</th>
                  {/* <th scope="col">SourceId</th> */}
                  <th scope="col">Type</th>
                  <th scope="col">Exposure</th>
                </tr>
              </thead>
              <tbody>
                {exposureData && exposureData?.length > 0 ? (
                  exposureData?.map((item) => {
                    return (
                      <tr>
                        <td>{item?.betFaireType=="fancy" || item?.betFaireType=="premium_fancy" || item?.betFaireType=="bookmaker" ?item?.matchName:item?.gameName}</td>
                        <td>{(item?.eventType=="1" || item?.eventType=="2" || item?.eventType=="4") && item?.betFaireType=="betfair"?"Match Odds":((item?.eventType=="1" || item?.eventType=="2" || item?.eventType=="4") && item?.betFaireType=="premium_fancy")?item?.gameName:item?.runnerName}</td>
                        {/* <td>{item?.selectionId}</td> */}
                        <td>{item?.betType}</td>
                        <td>{Math.abs(item?.amount?.toFixed(2))}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4}>No Records Found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="secondary"
            onClick={() => {
              setExposure(false);
              setExposureData("");
            }}
            className="theme_dark_btn"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={changeReference}
        onHide={setChangeReferenceToggle}
        className="change-status-modal"
      >
        <Modal.Header closeButton className="p-0 pb-2">
          <Modal.Title className="modal-title-status h4">
            Credit Reference Edit
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="test-status border-0 text-start">
            <Form
              className="change-password-sec"
              onSubmit={handleSubmit1(onSubmit1)}
            >
              <h4 className="h4 mb-3 curent-value">
                <label>Current :</label>{" "}
                <strong>
                  {helpers.currencyFormat(getCreditReference || null)}
                </strong>
              </h4>

              <Form.Group className="mb-2 d-flex align-items-center">
                <label className="me-2">New</label>
                <Form.Control
                  type="number"
                  placeholder="Enter Reference Amount"
                  className={
                    errors1.reference_amount
                      ? " w-sm-50 is-invalid "
                      : "w-sm-50 "
                  }
                  {...register1("reference_amount", {
                    required: "Please enter reference amount",
                    pattern: {
                      value: /^[0-9\b]+$/,
                      message: "Please enter valid number.",
                    },
                  })}
                />
                {errors1.reference_amount &&
                  errors1.reference_amount.message && (
                    <label className="invalid-feedback text-left">
                      {errors1.reference_amount.message}
                    </label>
                  )}
              </Form.Group>
              <Form.Group className="mb-2 d-flex align-items-center">
                <label className="me-2">Password</label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  className={
                    errors1.mypassword ? " w-sm-50 is-invalid " : "w-sm-50 "
                  }
                  {...register1("mypassword", {
                    required: "Please enter password",
                  })}
                />
                {errors1.mypassword && errors1.mypassword.message && (
                  <label className="invalid-feedback text-left">
                    {errors1.mypassword.message}
                  </label>
                )}
              </Form.Group>

              <div className="text-center mt-4">
                <Button type="submit" className="theme_dark_btn">
                  {isLoader ? "Loading..." : "Submit"}
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={changeAwcLimit}
        onHide={setChangeAwcLimitToggle}
        className="change-status-modal"
      >
        <Modal.Header closeButton className="p-0 pb-2">
          <Modal.Title className="modal-title-status h4">
            Casino Limit Edit
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="test-status border-0 text-start">
            <Form
              className="change-password-sec"
              onSubmit={handleSubmit2(onSubmit2)}
            >
             

              <Form.Group className="mb-2 d-flex align-items-center">
                <label className="me-2">New</label>
                <Form.Control
                  type="number"
                  placeholder="Enter Casino Amount"
                  className={
                    errors2.awcLimit
                      ? " w-sm-50 is-invalid "
                      : "w-sm-50 "
                  }
                  {...register2("awcLimit", {
                    required: "Please enter casino amount",
                    pattern: {
                      value: /^[0-9\b]+$/,
                      message: "Please enter valid number.",
                    },
                  })}
                />
                {errors2.awcLimit &&
                  errors2.awcLimit.message && (
                    <label className="invalid-feedback text-left">
                      {errors2.awcLimit.message}
                    </label>
                  )}
              </Form.Group>
              <Form.Group className="mb-2 d-flex align-items-center">
                <label className="me-2">Password</label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  className={
                    errors2.mypassword ? " w-sm-50 is-invalid " : "w-sm-50 "
                  }
                  {...register2("mypassword", {
                    required: "Please enter password",
                  })}
                />
                {errors2.mypassword && errors2.mypassword.message && (
                  <label className="invalid-feedback text-left">
                    {errors2.mypassword.message}
                  </label>
                )}
              </Form.Group>

              <div className="text-center mt-4">
                <Button type="submit" className="theme_dark_btn">
                  {isLoader ? "Loading..." : "Submit"}
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={BlockMarket}
        onHide={setChangeBlockMarketToggle}
        className="block-market-table"
      >
        <Modal.Header closeButton className="p-0 pb-2">
          <Modal.Title className="modal-title-status h4">
           Block Market
          </Modal.Title>
        </Modal.Header>
        <Modal.Body  className="p-0">
          <div className="test-status border-0 text-start">
          <section className="account-table ">
        <Container fluid className="mt-4 px-0">
         
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
                          
                          onClick={function (e) {
                            setSportsListingUpdate({
                              status:item?.status === "active"? "inActive": "active",
                              userId:getMarketBlockUserId,
                            });
                            setMatchStatus(
                              item?.status === "active" ? "InActive" : "Active"
                            );
                            setMatchBlockStatusToggle();
                            setSportsListingUpdateId(item?._id);
                            
                          }}
                        />
                      </td>
                     
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
          </div>
        </Modal.Body>
      </Modal>
      <UpdateStatusUser
        changeStatus={changeStatus}
        setChangeStatusToggle={setChangeStatusToggle}
        userData={userData}
        getActiveClass={getActiveClass}
        setActiveClass={setActiveClass}
        getUsers={props.getUsers}
        currentStatus={currentStatus}
      />
       <UpdateDialogBox
        open={blockMatchStatus}
        onClose={setMatchBlockStatusToggle}
        onSubmit={ updateMatchStatusSports}
        isLoader={isLoader}
        headerTitle={"Block/Un-Block Match"}
        title={` You Want to ${getMatchStatus} This Match?`}
      />
    </>
  );
};

export default UserList;
