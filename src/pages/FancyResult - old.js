import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Col,
  Row,
  Container,
  Form,
  Table,
  Modal 
} from "react-bootstrap";
import { Typeahead } from 'react-bootstrap-typeahead';
import { apiGet, apiPost } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import AuthContext from "../context/AuthContext";
import { initial, isEmpty ,startCase} from "lodash";
import { toast } from "wc-toast";
import Multiselect from "multiselect-react-dropdown";
import { useForm } from "react-hook-form";
import { useNavigate ,Link } from "react-router-dom";
import helpers from "../utils/helpers";

const FancyResult = () => {
  const searchParams = new URLSearchParams(document.location.search)
// console.log("searchParams",searchParams.get('eventType'));
const navigate = useNavigate();
  const [fancy, setFancy] = useState(false);
  const [marketId, setMarketId] = useState("");
  const [check, setCheck] = useState("fancy")
  const fancyToggle = (selectionId, eventId, id, fancyType, fancyStatus) => {
    setSelectionId(selectionId);
    setMarketId(id);
    setEventId(eventId);
    setFancy(!fancy);
    setFancyType(fancyType);
    setFancyStatus(fancyStatus);
  };
  let { user } = useContext(AuthContext);
  const [isLoader, setLoader] = useState(false);
  const [matchData, setMatchData] = useState([]);
  const [fancyData, setFancyData] = useState([]);
  const [closeFancyData, setCloseFancyData] = useState([]);
  const [declaredFancyData, setDeclaredFancyData] = useState([]);
  const [eventId, setEventId] = useState("");
  const [eventName, setEventName] = useState("");

  const [getFancyType, setFancyType] = useState("");
  const [selectionId, setSelectionId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [fancyStatus, setFancyStatus] = useState("");
  const [decision, setDecision] = useState("");
  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
    eventType: searchParams.get('eventType') ||"",
    status: searchParams.get('status') ||"",
    eventId:searchParams.get('eventId') ||"",
    eventName:searchParams.get('eventName') ||"",
    keyword:searchParams.get('keyword') ||"",
  });
  
  useEffect(() => {
    handleSearch();
  }, []);
  const getMatchData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.matchFilterList+"?eventType="+search_params?.eventType+"&status="+search_params?.status,
      
    );
    if (status === 200) {
      if (response_users.success) {
        if (response_users.results) {
        
          let arr=[];
          response_users?.results?.map((res) => {
            arr.push({"id":res?.eventId,"label": res?.eventName+"-"+res?.eventId});
          })
          setMatchData(arr)
          
        }
      }
    }
  };
  

  const handleEventType = (eventType) => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: 1,
        eventType: eventType,
      };
    });
  };
  const handleSearchStatus = (status) => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: 1,
        status: status,
      };
    });
  };
  const handleMatch = async (eventId,eventName) => {
    setEventName(eventName);
    setEventId(eventId);
  };
  const handleKeyword = async (keyword) => {
    setKeyword(keyword);
  };

  const handleDecision = async (id, decision) => {
    setDecision(decision);
    setFancyData((current) => {
      return current?.map((res) => {
        return res._id == id
          ? {
            ...res,
            decisionRun: decision,
          }
          : res;
      });
    });
  };
  const handleSearch = async () => {
    
    let sendEventId=eventId?eventId:searchParams.get('eventId');
    let sendEventName=eventName?eventName:searchParams.get('eventName')
    let sendKeyword=keyword?keyword:searchParams.get('keyword')
    console.log("sendEventName",sendEventName);
  let nav="?eventType="+search_params?.eventType+"&status="+search_params?.status+"&eventId="+sendEventId+"&eventName="+sendEventName+"&keyword="+sendKeyword;
    let obj = {
      eventId: sendEventId,
      keyword: sendKeyword,
    };
    const { status, data: response_users } = await apiGet(
      apiPath.resultFancyPremiumList,
      obj
    );
    if (status === 200) {
      if (response_users.success) {
          // console.log('response_users?.results---', response_users?.results?.pendingFancy);
        if (response_users.results?.pendingFancy) {
          
        }
        setFancyData(response_users.results?.pendingFancy && response_users.results?.pendingFancy?.map((res) => {
            return {
              fancyType:"fancy",
              ...res,
              jsonData: res?.jsonData?.map((item) => {
                return {
                  name: item?.runnerName,
                  id: item?.runnerId,
                };
              }),
              teamSelectionWin: res?.teamSelectionWin?.split(","),
              selected: res?.teamSelectionWin?.split(",")?.map((item) => {
                return {
                  id: item,
                  name: res?.jsonData?.find(
                    (itemInner) => itemInner?.runnerId == item
                  )?.runnerName,
                };
              }),
            };
          })
        );

        setCloseFancyData(response_users.results?.closeFancy && response_users.results?.closeFancy?.map((res) => {
              return {
                fancyType:"fancy",
                ...res,
                teamSelectionWin: res?.teamSelectionWin?.split(","),
                selected: res?.teamSelectionWin?.split(",")?.map((item) => {
                  return {
                    id: item,
                    name: res?.jsonData?.find(
                      (itemInner) => itemInner?.runnerId == item
                    )?.runnerName,
                  };
                }),
              };
            })
          );

          setDeclaredFancyData(response_users.results?.completeFancy && response_users.results?.completeFancy?.map((res) => {
            return {
              fancyType:"fancy",
              ...res,
              jsonData: res?.jsonData?.map((item) => {
                return {
                  name: item?.runnerName,
                  id: item?.runnerId,
                };
              }),
              teamSelectionWin: res?.teamSelectionWin?.split(","),
              selected: res?.teamSelectionWin?.split(",")?.map((item) => {
                return {
                  id: item,
                  name: res?.jsonData?.find(
                    (itemInner) => itemInner?.runnerId == item
                  )?.runnerName,
                };
              }),
            };
          })
        );
        
        navigate(nav)
      }
    }else{
      navigate(nav)
    }
  };

  useEffect(() => {
    getMatchData();
  }, [search_params]);

  const onSubmit = async (selectionid, marketId, id, run, fancyType) => {
  
    setLoader(true);
    if (selectionid && marketId) {
      try {
        let temp =
          fancyType == "premium"
            ? {
              decision: run?.map((res) => {
                return res.id;
              }),
            }
            : { decisionRun: run };
        let api =
          fancyType == "premium"
            ? apiPath?.premiumFancyBetResult
            : apiPath?.fancyBetResult;
        const { status, data: response_users } = await apiPost(api, {
          ...temp,
          selectionId: selectionid,
          marketId: marketId,
          eventId: id,
        });
        if (status === 200) {
          if (response_users.success) {
            toast.success(response_users.message);
            
            setDecision("");
            setLoader(false);
            setFancyType();
            handleSearch();

          } else {
            toast.error(response_users.message);
            setLoader(false);
          }
        }
      } catch (err) {
        setLoader(false);
        toast.error(err.response.data.message);
      }
    } else {
      setLoader(false);
      toast.error("Something went wrong");
    }
  };
  const updateMatchStatus = async () => {
    setLoader(true);
    if (eventId && selectionId) {
      try {
          let api =
          getFancyType == "premium"
            ? apiPath.updatePremiumFancyStatus
            : apiPath.updateFancyStatus;
          const { status, data: response_users } = await apiPost(api, {
            status: fancyStatus || "locked",
            eventId: eventId,
            selectionId: selectionId,
            marketId: marketId,
            
          });
          if (status === 200) {
            if (response_users.success) {
              setLoader(false);
              handleSearch();
              setFancy();
              setDecision("");
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
  const onSelectedData = (e, id) => {
    setFancyData((current) => {
      return current?.map((res) => {
        return res._id == id
          ? {
            ...res,
            selected: e,
          }
          : res;
      });
    });
  };
  const onSearch = (value) => {
    console.log('Value', value)
    //callSearchApi(value);

  }

  // console.log("fancyData---------------->", fancyData);
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="inner-wrapper">
            <div className="common-container">
              <Form className="bet_status bet-list-live">
                <Row className="">
                  <Col xl={12} lg={12} md={12}>
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
                            <option value="4" selected={search_params?.eventType=="4"}>Cricket</option>
                            <option value="1" selected={search_params?.eventType=="1"}>Soccer</option>
                            <option value="2" selected={search_params?.eventType=="2"}>Tennis</option>
                          </Form.Select>
                        </div>
                      </Col>
                      <Col lg={3} sm={6} className="mb-3">
                        <div className="bet-sec">
                          <Form.Label className="pe-1">
                            Select Match Status:
                          </Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            onChange={(e) => {
                              handleSearchStatus(e.target.value);
                            }}
                          >
                            <option value="active" selected={search_params?.status=="active"}>Active</option>
                            <option value="in_play" selected={search_params?.status=="in_play"}>In Play</option>
                            <option value="completed" selected={search_params?.status=="completed"}>Completed</option>
                          </Form.Select>
                        </div>
                      </Col>
                      <Col lg={4} sm={6} className="mb-3">
                        <div className="bet-sec">
                          <Form.Label className="pe-1" style={{'max-width': '15%'}}>
                            Select Match:
                          </Form.Label>
                          <Typeahead
                          style={{width:'500px'}}
                          id="first"
                           placeholder="Choose a match..."
                          onChange={(selected) => {
                            
                            handleMatch(selected[0]?.id,selected[0]?.label);
                          }}
                          options={matchData}
                         defaultInputValue={search_params?.eventName}
                        />
                       {/* {console.log(matchData.filter((res) => res.id == search_params?.eventId)[0].label)} */}
                          {/* <Form.Select
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
                                    key={index + 1}>
                                    {matchList.eventName} - {matchList.eventId}
                                  </option>
                                );
                              })}
                          </Form.Select> */}
                        </div>
                      </Col>
                      <Col lg={2} md={4}>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            defaultValue={search_params?.keyword}
                            placeholder="Search By Fancy Name"
                            onChange={(e) => {
                              handleKeyword(e.target.value);
                            }}
                          />
                        </Form.Group>
                      </Col>
                      {/* <Col lg={3} sm={6} className="mb-3">
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
                            <option value="close">Completed</option>
                            <option value="locked">Suspended</option>
                          </Form.Select>
                        </div>
                      </Col>
                      <Col lg={3} sm={4} className="mb-3">
                        <div className="bet-sec">
                          <Form.Label className="pe-1">
                            Select Fancy Type:
                          </Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={fancyType}
                            onChange={(e) => {
                              setFancyType(e.target.value);
                            }}
                          >
                            <option value="fancy">Fancy</option>
                            <option value="premium-fancy-list">
                              Premium Fancy
                            </option>
                          </Form.Select>
                        </div>
                      </Col> */}
                      
                      <Col lg={1} md={4} className="mb-2">
                        <Button
                          className="green-btn w-100"
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
                <caption className="d-block text-start">Pending Result</caption>

                <div className="responsive"  style={{overflow:`initial`}}>
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Fancy Name</th>
                        <th scope="col"> SelectionId </th>
                        {/* <th scope="col"> Winner </th> */}
                        <th scope="col"> Action </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {!isEmpty(fancyData) ? (
                        <>
                          {fancyData?.length &&
                            fancyData?.map((matchList, index) => {
                              return (
                                matchList?.isDeclared === false && (
                                  <tr key={index + 1}>
                                    <td>{matchList.fancyName}</td>
                                    <td>{matchList.eventId + "-" + matchList.selectionId}</td>
                                    {matchList?.fancyType == "fancy" ? (
                                      <td width="20%">
                                        <Form.Group>
                                          <Form.Control
                                            type="number"
                                            placeholder="Decision"
                                            defaultValue={
                                              matchList?.decisionRun
                                                ? matchList?.decisionRun
                                                : ""
                                            }
                                            onChange={(e) => {
                                              handleDecision(
                                                matchList._id,
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </Form.Group>
                                      </td>
                                    ) : (
                                      <td>
                                        {matchList?.jsonData?.length > 0 && (
                                          <Multiselect

                                            onSearch={
                                              (e) =>
                                                onSearch(e)
                                              // console.log(e,"eee")
                                            }



                                            showArrow={true}
                                            options={matchList?.jsonData} // Options to display in the dropdown
                                            selectedValues={
                                              matchList?.selected || []
                                            } // Preselected value to persist in dropdown
                                            onSelect={(e) =>
                                              onSelectedData(e, matchList._id)
                                            } // Function will trigger on select event
                                            onRemove={
                                              (e) =>
                                                onSelectedData(e, matchList._id)
                                              // console.log(e,"eee")
                                            } // Function will trigger on remove event
                                            displayValue="name" // Property name to display in the dropdown options
                                          />
                                        )}
                                      </td>
                                    )}
                                    <td>
                                    {user?.userType === "owner" && (
                                      <>
                                      <Button
                                          disabled={isLoader ? true : false}
                                          className="me-3"
                                          onClick={() =>
                                            onSubmit(
                                              matchList?.selectionId,
                                              matchList?.marketId,
                                              matchList?.eventId,
                                              matchList?.fancyType == "fancy"
                                                ? matchList?.decisionRun
                                                : matchList?.selected,
                                              matchList?.fancyType
                                            )
                                          }
                                        >

                                          {
                                            // (check == "fancy"
                                            //   ? matchList?.decisionRun
                                            //   : (matchList?.teamSelectionWin &&
                                            //     matchList?.teamSelectionWin?.length >
                                            //       0))
                                            //   ? "Rollback"
                                            //   :
                                            "Submit"}
                                        </Button>
                                        
                                        <Button
                                          onClick={(e) => {
                                            fancyToggle(
                                              matchList?.selectionId,
                                              matchList?.eventId,
                                              matchList?.marketId,
                                              matchList?.fancyType,
                                              "deleted"
                                            );
                                          }}
                                          className="bg-danger text-white border-danger"
                                        >
                                          Delete
                                        </Button>
                                        <Button
                                        style={{margin: '0 6px'}}
                                          onClick={(e) => {
                                            fancyToggle(
                                              matchList?.selectionId,
                                              matchList?.eventId,
                                              matchList?.marketId,
                                              matchList?.fancyType,
                                              "voided"
                                            );
                                          }}
                                          className="bg-warning text-white border-warning"
                                        >
                                          No Result
                                        </Button>
                                      </>
                                      )}
                                    </td>
                                  </tr>
                                )
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
              <div className="account-table batting-table mt-3">
                <caption className="d-block text-start">Declared Result</caption>
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Fancy Name</th>
                        <th scope="col"> SelectionId </th>
                        <th scope="col"> IP </th>
                        <th scope="col"> Date & Time </th>
                        <th scope="col"> Action </th>
                        
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {!isEmpty(declaredFancyData) ? (
                        <>
                          {declaredFancyData?.length &&
                            declaredFancyData?.map((matchList1, index) => {
                              return (
                                matchList1?.isDeclared === true && (
                                  <tr key={index + 1}>
                                    <td>{matchList1.fancyName}</td>
                                    <td>{matchList1.eventId + "-" + matchList1.selectionId}</td>
                                    <td>{matchList1?.ip}</td>
                                    <td>{helpers.dateFormat(
                                  matchList1.updatedAt,
                                  user.timeZone
                                )}</td>
                                    {matchList1?.fancyType == "fancy" ? (
                                      <td width="20%">
                                        <Form.Group>
                                          <Form.Control
                                            type="number"
                                            disabled="true"
                                            placeholder="Decision"
                                            defaultValue={matchList1?.decisionRun}
                                            onChange={(e) => {
                                              handleDecision(
                                                matchList1._id,
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </Form.Group>
                                      </td>
                                    ) : (
                                      <td>
                                        {matchList1?.jsonData?.length > 0 && (
                                          <Multiselect
                                          disabled="true"
                                            options={matchList1?.jsonData} // Options to display in the dropdown
                                            selectedValues={
                                              matchList1?.selected || []
                                            } // Preselected value to persist in dropdown
                                            onSelect={(e) =>
                                              onSelectedData(e, matchList1._id)
                                            } // Function will trigger on select event
                                            onRemove={
                                              (e) =>
                                                onSelectedData(e, matchList1._id)
                                              // console.log(e,"eee")
                                            } // Function will trigger on remove event
                                            displayValue="name" // Property name to display in the dropdown options
                                          />
                                        )}
                                      </td>
                                    )}
                                   
                                    <td>
                                    {user?.userType === "owner" && user?.username === "superjohndoe" && (
                                      <>
                                      <Button
                                        disabled={isLoader ? true : false}
                                        className="me-3"
                                        onClick={(e) => {
                                          fancyToggle(
                                            matchList1?.selectionId,
                                            matchList1?.eventId,
                                            matchList1?.marketId,
                                            matchList1?.fancyType,
                                            "rollback"
                                          );
                                        }}
                                      >

                                        Rollback
                                      </Button>
                                        <Button
                                          onClick={(e) => {
                                            fancyToggle(
                                              matchList1?.selectionId,
                                              matchList1?.eventId,
                                              matchList1?.marketId,
                                              matchList1?.fancyType,
                                              "deleted"
                                            );
                                          }}
                                          className="bg-danger text-white border-danger"
                                        >
                                          Delete
                                        </Button>
                                        <Link
                                         to={ `/view-bets-result/${matchList1?.eventId}/${matchList1?.marketId}/${matchList1?.selectionId}`
                                        }
                                        style={{fontSize:'1rem',fontWeight:'400',padding:'8px',verticalAlign:"middle",margin:'0 12px'}}
                                        target="_blank"
                                          className="green-btn"
                                        >
                                          View Bet
                                        </Link>
                                        </>
                                      )}
                                    </td>
                                    
                                  </tr>)
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
              <div className="account-table batting-table mt-3">
                <caption className="d-block text-start">Suspended / No Result</caption>
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Fancy Name</th>
                        <th scope="col"> SelectionId </th>
                        <th scope="col"> Action </th>
                        <th scope="col"> IP </th>
                        <th scope="col"> Status </th>
                        <th scope="col"> Date & Time </th>
                        <th scope="col"> Action </th>
                       
                      </tr>
                    </thead>
                    <tbody>
                      {!isEmpty(closeFancyData) ? (
                        <>
                          {closeFancyData?.length &&
                            closeFancyData?.map((matchList1, index) => {
                              return (
                                  <tr key={index + 1}>
                                      <td  width="20%">{matchList1.fancyName}</td>
                                      <td width="10%">{matchList1.eventId + "-" + matchList1.selectionId}</td>
                                      {matchList1?.fancyType == "fancy" ? (
                                      <td width="10%">
                                        <Form.Group>
                                          <Form.Control
                                            disabled="true"
                                            style={{width:"40%"}}
                                            type="number"
                                            placeholder="Decision"
                                            defaultValue={matchList1?.decisionRun}
                                          />
                                        </Form.Group>
                                      </td>
                                      ) : (
                                        <td>
                                          {matchList1?.jsonData?.length > 0 && (
                                            <Multiselect
                                              disabled="true"
                                              options={matchList1?.jsonData} // Options to display in the dropdown
                                              selectedValues={
                                                matchList1?.selected || []
                                              } // Function will trigger on select event
                                              onRemove={
                                                (e) =>
                                                  onSelectedData(e, matchList1._id)
                                                // console.log(e,"eee")
                                              } // Function will trigger on remove event
                                              displayValue="name" // Property name to display in the dropdown options
                                            />
                                          )}
                                        </td>
                                      )}
                                      <td>{matchList1?.ip}</td>
                                      <td>{startCase(matchList1?.status)}</td>
                                      <td>{helpers.dateFormat(
                                        matchList1.updatedAt,
                                        user.timeZone
                                      )}</td>
                                      <td>
                                        {user?.userType === "owner" && user?.username === "superjohndoe" && matchList1?.status==="voided" && (
                                          <>
                                              <Button
                                                disabled={isLoader ? true : false}
                                                className="me-3"
                                                onClick={(e) => {
                                                  fancyToggle(
                                                    matchList1?.selectionId,
                                                    matchList1?.eventId,
                                                    matchList1?.marketId,
                                                    matchList1?.fancyType,
                                                    "rollback"
                                                  );
                                                }}
                                                // onClick={() =>
                                                //   onSubmit(
                                                //     matchList1?.selectionId,
                                                //     matchList1?.marketId,
                                                //     matchList1?.eventId,
                                                //     matchList1?.fancyType == "fancy"
                                                //       ? matchList1?.decisionRun
                                                //       : matchList1?.selected,
                                                //     matchList1?.fancyType
                                                //   )
                                                // }
                                              >
                                              Rollback
                                              </Button>
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
            </div>
          </div>
        </Container>
      </section>
      <Modal show={fancy} onHide={fancyToggle} className="block-modal">
        <Modal.Header className="border-0">
          <Modal.Title className="modal-title-status">
          {startCase(fancyStatus)}-({eventId})
            
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <div className="block-modal-content">
            <h3>Are you sure you want to  {startCase(fancyStatus)} ({eventId}) ?</h3>
            <div className="text-center">
              <Button
                type="submit"
                className="green-btn me-3"
                onClick={() => updateMatchStatus()}
              >
                {isLoader ? "Loading..." : "Confirm"}
              </Button>
              <Button className="green-btn" onClick={fancyToggle}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FancyResult;
