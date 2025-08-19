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
import { Link } from "react-router-dom";
const SuspendedMarketResult = () => {
  let { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const setOpenToggle2 = () => setOpen2(!open2);
  const [open2, setOpen2] = useState(false);
  const [resultType, setResultType] = useState({ eventId: "", type: "" });
  const [modelData, setModelData] = useState({});
  const [viewpage, setViewPage] = useState(0);
  const [selectedRunner, setSelectedRunner] = useState("");
  const [selectedBookMaker, setSelectedBookmaker] = useState("");
  const [filter, setFilter] = useState({
    gameType: "cricket",
    status: "",
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
  }, [filter]);
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
                      <Col xxl={3} lg={4} md={6} className="mb-lg-0 mb-3"></Col>
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
                        <th scope="col">Market</th>
                        <th scope="col"> Winner </th>
                        <th scope="col"> IP </th>
                        <th scope="col">Date </th>
                        <th scope="col"> Action </th>
                      </tr>
                    </thead>

                    <tbody>
                      {data && data?.data?.length > 0 ? (
                        data?.data?.map((item) => {
                          return (
                            <tr>
                              <td>{item?.gameType}</td>
                              <td>{item?.eventId}</td>
                              <td>{item?.eventName}</td>
                              <td>{item?.marketId}</td>
                              <td>Not Declared</td>
                              <td>-</td>
                              <td>
                                {helpers.dateFormat(
                                  item?.eventDateTime,
                                  user.timeZone
                                )}
                              </td>
                              <td>
                                <Link
                                  className="btn theme_light_btn"
                                  to={"/viewBets/" + item?.eventId}
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8}>No Record Found</td>
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
    </div>
  );
};

export default SuspendedMarketResult;
