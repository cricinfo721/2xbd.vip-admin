import React, { useContext, useEffect, useState } from "react";
import { Container, Table, Form, Button } from "react-bootstrap";
import { apiGet, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { isEmpty } from "lodash";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { toast } from "wc-toast";
import helpers from "../../utils/helpers";
import UpdateDialogBox from "../../components/UpdateDialogBox";
import AuthContext from "../../context/AuthContext";
import obj from "../../utils/constants";
const RejectedBets = () => {
  let { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const setOpenToggle = () => setOpen(!open);
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);
  const [id, setId] = useState("");
  const [isLoader, setLoader] = useState(false);
  const [search_params, setSearchParams] = useState({
    type: "4",
    betType: "betfair",
  });
  const getData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.rejectedBets,
      search_params
    );
    if (status === 200) {
      if (response_users?.success) {
        setData(response_users.results);
        setPageCount(response_users.results.totalPages || []);
      }
    }
  };

  const setDataForStatusChange = (id, status) => {
    setId(id);
    setOpenToggle();
  };
  const updateMatchStatus = async () => {
    setLoader(true);
    try {
      const { status, data: response_users } = await apiPut(
        apiPath.updateStatusRequestBets + id,
        { statue: "active" }
      );
      if (status === 200) {
        if (response_users.success) {
          setOpenToggle();
          setLoader(false);
          getData();
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

  const handleSearchGameType = (keyword) => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: 1,
        type: keyword,
      };
    });
  };
  const handleSearchStatus = (keyword) => {
    if (keyword !== "" && keyword !== search_params.status) {
      setSearchParams((prevState) => {
        return {
          ...prevState,
          status: keyword,
        };
      });
    }
  };

  useEffect(() => {
    getData();
    setViewPage(search_params.page ? search_params.page - 1 : 0);
  }, [search_params]);

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Rejected Bets</h2>
          </div>

          <div className="inner-wrapper">
            <div className="common-container">
              <Form
                className="bet_status bet-list-live"
                style={{ marginBottom: "10px" }}
              >
                <div key={`inline-radio`} className="mb-1">
                  {obj.betCheckData.map((type) => {
                    return (
                      <Form.Check
                        inline
                        label={type.value}
                        name={type.label}
                        type="radio"
                        checked={
                          type.label == search_params.type ? true : false
                        }
                        onChange={(e) => handleSearchGameType(e.target.name)}
                        id={`inline-radio-1`}
                      />
                    );
                  })}
                </div>
                <div key={`inline-radio`} className="mb-2">
                  {obj.betCheckDataInner.map((type) => {
                    return (
                      <Form.Check
                        inline
                        label={type.value}
                        name={type.label}
                        type="radio"
                        checked={
                          type.label === search_params.betType ? true : false
                        }
                        onChange={(e) =>
                          setSearchParams({
                            ...search_params,
                            betType: e.target.name,
                          })
                        }
                        id={`inline-radio-1`}
                      />
                    );
                  })}
                </div>
              </Form>

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
                    {data &&
                      data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{obj.betCheckObj[search_params.type]}</td>
                            <td>{item.eventId}</td>
                            <td>{item.marketId}</td>
                            <td>{item.matchName}</td>
                            <td>
                              {helpers.dateFormat(
                                item.createdAt,
                                user.timeZone
                              )}
                            </td>
                            <td>
                              <Form.Check
                                type="switch"
                                id="custom-switch"
                                checked={
                                  item?.status === "active" ? true : false
                                }
                                onClick={function (e) {
                                  setDataForStatusChange(
                                    item?._id,
                                    item?.status
                                  );
                                }}
                              />
                            </td>
                            <td>
                              <Button
                                onClick={() =>
                                  navigate(`/fancy-details/${item.eventId}`)
                                }
                                className="green-btn"
                              >
                                View Fancy
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    {isEmpty(data) ? (
                      <tr>
                        <td colSpan={9}>No records found</td>
                      </tr>
                    ) : null}
                  </Table>
                  {/* {data && data?.data?.length > 0 && (
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
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <UpdateDialogBox
        open={open}
        onClose={setOpenToggle}
        onSubmit={updateMatchStatus}
        isLoader={isLoader}
        headerTitle={"Active Status"}
        title={"You Want to update status?"}
      />
    </div>
  );
};

export default RejectedBets;
