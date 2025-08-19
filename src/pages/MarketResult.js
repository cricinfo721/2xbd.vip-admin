import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  Row,
  Container,
  Form,
  Table,
  Modal,
} from "react-bootstrap";
import helpers from "../utils/helpers";
import pathObj from "../utils/apiPath";
import { apiGet, apiPost } from "../utils/apiFetch";
import ReactPaginate from "react-paginate";
import AuthContext from "../context/AuthContext";
import { toast } from "wc-toast";
import UpdateDialogBox from "../components/UpdateDialogBox";
const MarketResult = () => {
  let { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const setOpenToggle2 = () => setOpen2(!open2);
  const [open2, setOpen2] = useState(false);
  const [resultType, setResultType] = useState({ eventId: "", type: "" });
  const [modelData, setModelData] = useState({});
  const [viewpage, setViewPage] = useState(0);
  const [selectedRunner, setSelectedRunner] = useState("");
  const [selectedBookMaker, setSelectedBookmaker] = useState("");
  const [selectedWinner, setSelectedWinner] = useState("");
  
  const [filter, setFilter] = useState({
    keyword: "",
    gameType: "cricket",
    status: "in_play",
    page: 1,
    limit: 100,
  });
  const [data, setData] = useState([]);
  const getData = async () => {
    const { status, data: response_users } = await apiGet(
      pathObj.resultsSetMarker,
      filter
    );
    if (status === 200) {
      if (response_users.success) {
        setData(response_users.results);
      }
    }
  };
  useEffect(() => {
    getData();
  }, [filter?.keyword,filter?.gameType,filter?.status,filter?.page]);

  const handlePageClick = (event) => {
    setFilter((prevState) => {
      return {
        ...prevState,
        page: event.selected + 1,
      };
    });
    setViewPage(event.selected);
  };
  const close = () => {
    setOpen(false);
    setSelectedRunner("");
    setSelectedBookmaker("");
    setModelData("");
  };
  const onSubmit = async (type) => {
    if (type == "bookmaker" || type == "runner" || type == "tie") {
      let path;
      if (type == "bookmaker") {
        path = pathObj.bookmakerResult;
      } else if(type == "tie"){
        path = pathObj.tieResult;
      } else{
        path = pathObj.betfairResult;
      }
     
      try {
        const { status, data: response_users } = await apiPost(path, {
          wonSelectionId:
            type == "bookmaker" ? selectedBookMaker :(type == "tie" )?selectedWinner: selectedRunner,
          marketId:
            type == "bookmaker"
              ? modelData?.bookmakerMarketId
              : modelData?.marketId,
          eventId: modelData?.eventId,
        });
        if (status === 200) {
          if (response_users.success) {
            if (
              filter.status == "tie" ||
              filter.status == "abounded" ||
              filter.status == "completed"
            ) {
              await apiGet(
                pathObj.resultTieandAbonded +
                  `?eventId=${modelData.eventId}&status=active`
              );
            }
            close();
            getData();
            toast.success(response_users.message);
          } else {
            toast.error(response_users.message);
          }
        }
      } catch (err) {
        toast.error(err.response.data.message);
      }
    }
  };
  const updateMatchStatus = async () => {
    const { status, data: response_users } = await apiGet(
      pathObj.resultTieandAbonded +
        `?eventId=${resultType.eventId}&status=${resultType.type}`
    );
    if (status === 200) {
      if (response_users.success) {
        getData();
        setResultType({
          eventId: "",
          type: "",
        });
        setOpen2(false);
        toast.success(response_users.message);
      }
    }
  };
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="inner-wrapper">
            <div className="common-container">
              <div className="total_all bet_status bg-transparent border-0">
                <Row>
                  <Col md={12}>
                    <Row>
                      <Col xxl={3} lg={4} md={6} className="mb-lg-0 mb-3">
                        <Form.Group
                          className="position-relative mb-2 "
                          style={{ marginRight: "10px" }}
                        >
                          <Form.Control
                            type="text"
                            placeholder="Search..."
                            onChange={(e) => {
                              setFilter({
                                ...filter,
                                keyword: e.target.value,
                                page: 1,
                              });
                              setViewPage(0);
                            }}
                          />
                          {/* <i className="fas fa-search"></i> */}
                        </Form.Group>
                      </Col>
                      <Col xxl={3} lg={4} md={6} className="mb-lg-0 mb-3">
                        <div className="bet-sec">
                          <Form.Label>Sports :</Form.Label>
                          <Form.Select
                            value={filter.gameType}
                            onChange={(e) => {
                              setFilter({
                                ...filter,
                                gameType: e.target.value,
                                page: 1,
                              });
                              setViewPage(0);
                            }}
                            aria-label="Default select example"
                          >
                            <option value="cricket">Cricket</option>
                            <option value="tennis">Tennis</option>
                            <option value="soccer">Soccer</option>
                            <option value="casino">Casino</option>
                          </Form.Select>
                        </div>
                      </Col>
                      <Col xxl={3} lg={4} md={6} className="mb-lg-0 mb-3">
                        <div className="bet-sec">
                          <Form.Label>Status :</Form.Label>
                          <Form.Select
                            value={filter.status}
                            onChange={(e) => {
                              setFilter({
                                ...filter,
                                status: e.target.value,
                                page: 1,
                              });
                              setViewPage(0);
                            }}
                            aria-label="Default select example"
                          >
                            <option value="in_play">In Play</option>
                            <option value="active">Active</option>
                            <option value="suspend">Suspend</option>
                            <option value="tie">Tie</option>
                            <option value="abounded">Abounded</option>
                            <option value="completed">Completed</option>
                          </Form.Select>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className="account-table batting-table mt-3">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Sport</th>
                        <th scope="col"> Match ID</th>
                        <th scope="col"> Match Name</th>
                        <th scope="col"> Market </th>
                        <th scope="col">Market Id</th>
                        <th scope="col"> Winner </th>
                        <th scope="col"> IP </th>
                        <th scope="col">Date </th>
                        <th scope="col"> Action </th>
                      </tr>
                    </thead>

                    <tbody>
                      {data && data?.data?.length > 0 ? (
                        data?.data?.map((item) => {
                          // console.log(item, "===========");
                          return (
                            <tr>
                              <td>{item?.gameType}</td>
                              <td>{item?.eventId}</td>
                              <td>{item?.eventName}</td>
                              <td>{item?.market}</td>
                              <td>{item?.marketId}</td>
                              <td>
                                {item?.status === "completed"
                                  ? item?.runners.find(
                                      (res) => res?.SelectionId == item?.winner
                                    )?.RunnerName
                                  : "Not Declared"}
                              </td>
                              <td>{item?.ip}</td>
                              <td>
                                {helpers.dateFormat(
                                  item?.eventDateTime,
                                  user.timeZone
                                )}
                              </td>
                              <td>
                              {user.userType == "owner"?(
                                <>
                              {item?.bookmakerRunners && item?.bookmakerRunners.length>0 &&(  
                              <Button
                                  onClick={() => {
                                    setOpen(true);
                                    setModelData({
                                     
                                      bookmaker: item?.bookmakerRunners || [],
                                      eventId: item?.eventId,
                                      marketId: item?.marketId,
                                      bookmakerMarketId:
                                        item?.bookmakerMarketId,
                                      betfairDecision: item.isBetFairDeclared,
                                      bookmakerDecision:
                                        item.isBookmakerDeclared,
                                    });
                                  }}
                                  className="green-btn"
                                >
                                  {item.isBookmakerDeclared 
                                    ? "Bookmaker Rollback"
                                    : "Bookmaker"}
                                </Button>
                                )}
                             
                                <Button
                                disabled={(item?.bookmakerRunners && item?.bookmakerRunners.length>0 && !item.isBookmakerDeclared) || (item?.jsonTieData && item?.jsonTieData.length>0 && !item.isTieDeclared) ?true:false}
                                  onClick={() => {
                                    setOpen(true);
                                    setModelData({
                                      runner: item?.runners || [],
                                      
                                      eventId: item?.eventId,
                                      marketId: item?.marketId,
                                      bookmakerMarketId:
                                        item?.bookmakerMarketId,
                                      betfairDecision: item.isBetFairDeclared,
                                      bookmakerDecision:
                                        item.isBookmakerDeclared,
                                    });
                                  }}
                                  className="green-btn"
                                >
                                  {item.isBetFairDeclared 
                                     ||
                                  item?.status === "completed"
                                    ? "Match Odds Rollback"
                                    : "Match Odds"}
                                </Button>
                               { item?.jsonTieData && item?.jsonTieData.length>0 &&
                               <Button
                               onClick={() => {
                                 setOpen(true);
                                 setModelData({
                                   jsonTieData: item?.jsonTieData || [],
                                   eventId: item?.eventId,
                                   marketId: item?.tieMarketId,
                                   tieWinner: item?.tieWinner,
                                 });
                               }}
                               className="green-btn"
                             >
                              {item.isTieDeclared 
                                     
                                    ? "Tie Rollback"
                                    : "Match Tie"}
                              
                             </Button>}
                                
                                {item.status !== "tie" &&
                                item.status !== "abounded" &&
                                item.status !== "completed" ? (
                                  <>
                                    
                                    <Button
                                      onClick={() => {
                                        setOpenToggle2();
                                        setResultType({
                                          type: "abounded",
                                          eventId: item.eventId,
                                        });
                                      }}
                                      className="green-btn"
                                    >
                                      Abounded
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setOpenToggle2();
                                        setResultType({
                                          type: "noResult",
                                          eventId: item.eventId,
                                        });
                                      }}
                                      className="green-btn"
                                    >
                                      No Result
                                    </Button>
                                    {item?.isBetFairDeclared &&
                                      item?.isBookmakerDeclared && (
                                        <Button
                                          onClick={() => {
                                            setOpenToggle2();
                                            setResultType({
                                              type: "completed",
                                              eventId: item.eventId,
                                            });
                                          }}
                                          className="green-btn"
                                        >
                                          Completed
                                        </Button>
                                      )}
                                  </>
                                ) : (
                                  ""
                                )}
                                </>
                                ):("")}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={9}>No Record Found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  <div className="bottom-pagination">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel=" >"
                      forcePage={viewpage}
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={10}
                      pageCount={data.totalPages}
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
      <Modal show={open} onHide={close} className="block-modal">
        <Modal.Header className="border-0">
          <Modal.Title className="modal-title-status h4">Decision</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
        {modelData?.jsonTieData?.length > 0 && (
            <div>
              <h6>Tie</h6>
              <div className="bet-sec mb-3">
                <Form.Select
                  value={selectedWinner}
                  onChange={(e) => setSelectedWinner(e.target.value)}
                  aria-label="Default select example"
                >
                  <option value="">Select Winner</option>
                  {modelData &&
                    modelData?.jsonTieData?.map((item) => {
                      return (
                        <option value={item?.SelectionId}>
                          {item.RunnerName}
                        </option>
                      );
                    })}
                  {/* <option value="abended">Abended Match</option>
                  {modelData?.bookmaker?.length == 2 && (
                    <option value="tie">Tie Match</option>
                  )} */}
                </Form.Select>
              </div>
              <div className="d-flex justify-content-end">
                <Button
                  className="green-btn me-3"
                  disabled={selectedWinner == "" ? true : false}
                  onClick={() => onSubmit("tie")}
                >
                  {!modelData.bookmakerDecision ? "Submit" : "Rollback"}
                </Button>
              </div>
            </div>
          )}

          {modelData?.bookmaker?.length > 0 && (
            <div>
              <h6>Bookmaker</h6>
              <div className="bet-sec mb-3">
                <Form.Select
                  value={selectedBookMaker}
                  onChange={(e) => setSelectedBookmaker(e.target.value)}
                  aria-label="Default select example"
                >
                  <option value="">Select Winner</option>
                  {modelData &&
                    modelData?.bookmaker?.map((item) => {
                      return (
                        <option value={item?.selectionID}>
                          {item.runnerName}
                        </option>
                      );
                    })}
                  {/* <option value="abended">Abended Match</option>
                  {modelData?.bookmaker?.length == 2 && (
                    <option value="tie">Tie Match</option>
                  )} */}
                </Form.Select>
              </div>
              <div className="d-flex justify-content-end">
                <Button
                  className="green-btn me-3"
                  disabled={selectedBookMaker == "" ? true : false}
                  onClick={() => onSubmit("bookmaker")}
                >
                  {!modelData.bookmakerDecision ? "Submit" : "Rollback"}
                </Button>
              </div>
            </div>
          )}
          {modelData?.runner?.length > 0 && (
            <div>
              <h6>Bet Fair</h6>
              <div className="bet-sec mb-3">
                <Form.Select
                  value={selectedRunner}
                  onChange={(e) => setSelectedRunner(e.target.value)}
                  aria-label="Default select example"
                >
                  <option value="">Select Winner</option>
                  {modelData &&
                    modelData?.runner?.map((item) => {
                      return (
                        <option value={item?.SelectionId}>
                          {item.RunnerName}
                        </option>
                      );
                    })}
                  {/* <option value="abended">Abended Match</option>
                  {modelData?.runner?.length == 2 && (
                    <option value="tie">Tie Match</option>
                  )} */}
                </Form.Select>
              </div>
              <div className="d-flex justify-content-end">
                <Button
                  className="green-btn me-3"
                  disabled={selectedRunner == "" ? true : false}
                  onClick={() => onSubmit("runner")}
                >
                  {!modelData.betfairDecision ? "Submit" : "Rollback"}
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
      <UpdateDialogBox
        open={open2}
        onClose={setOpenToggle2}
        onSubmit={updateMatchStatus}
        // isLoader={isLoader}
        headerTitle={"Decision"}
        title={
          resultType.type == "tie"
            ? "You Want to Tie Match"
            : resultType.type == "abounded"
            ? "You Want to Aboundend Match"
            : "You Want to Complete this Match"
        }
      />
    </div>
  );
};

export default MarketResult;
