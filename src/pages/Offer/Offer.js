import React, { useEffect, useState, useContext } from "react";
import { Container, Table, Button, Form } from "react-bootstrap";
import { apiGet, apiPost, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";

import AddOffer from "./AddOffer";
import obj from "../../utils/helpers";
const Offer = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 100,
    status: "active",
  });
  const getData = async (obj = filter) => {
    const { status, data: response_users } = await apiGet(apiPath.getOffer, {
      page: obj?.page,
      limit: obj?.limit,
      status: obj?.status,
    });
    if (status === 200) {
      if (response_users.success) {
        setData(response_users?.results);
      }
    }
  };

  const onDelete = async (body) => {
    const { status, data: response_users } = await apiPost(apiPath.addOffer, {
      id: body?._id,
      isDelete: true,
    });
    if (status === 200) {
      if (response_users.success) {
        getData();
      }
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const onChangeStatus = async ({ body, type }) => {
    const { status, data: response_users } = await apiPost(apiPath.addOffer, {
      id: body?._id,
      isActive: type,
    });
    if (status === 200) {
      if (response_users.success) {
        getData();
      }
    }
  };
  const [add, setAdd] = useState({});

  let UpdatedData = data?.filter((res) => {
    return res?.isActive == (filter?.status == "active");
  });
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec d-flex justify-content-between align-items-center w-100 mb-2">
            <h2
              className="common-heading"
              style={{ display: "flex", alignItems: "center" }}
            >
              Offer{" "}
              <Form.Select
                style={{ marginLeft: "10px" }}
                value={filter?.status}
                onChange={(e) => {
                  setFilter({ ...filter, status: e.target.value });
                  getData({ ...filter, status: e.target.value });
                }}
              >
                <option value={"active"}>Active</option>
                <option value={"inactive"}>In Active</option>
              </Form.Select>
            </h2>{" "}
            <Button
              className="theme_light_btn btn btn-primary"
              onClick={() =>
                setAdd({
                  status: true,
                  type: "add",
                  object: {},
                })
              }
            >
              + Add Offer
            </Button>
          </div>
          <div className="inner-wrapper">
            <div className="common-container">
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table className="w-100">
                    <thead>
                      <tr>
                        <th scope="col">Sr no.</th>
                        <th scope="col">Title</th> 
                        <th scope="col">Offer Code</th> 
                        <th scope="col">Category</th>
                        <th scope="col">Offer Type</th>
                        <th scope="col">Offer On</th>
                        <th scope="col">Offer Start Date</th>{" "}
                        <th scope="col">Offer End Date</th>{" "}
                        <th scope="col">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {UpdatedData?.length > 0 ? (
                        UpdatedData?.map((res, index) => {
                          return (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{res?.title}</td>
                               <td>{res?.offerCode}</td>
                              <td>{res?.category}</td>
                              <td>{res?.offerType}</td>
                              <td>{res?.offerOn}</td>
                              <td>
                                {obj.dateFormat(res?.offerStartDateTime)}
                              </td>{" "}
                              <td>{obj.dateFormat(res?.offerEndDateTime)}</td>{" "}
                              <td>
                                {" "}
                                {filter?.status == "active" && (
                                  <Button
                                    onClick={() =>
                                      setAdd({
                                        status: true,
                                        type: "edit",
                                        object: res,
                                      })
                                    }
                                    className="theme_light_btn btn btn-primary"
                                  >
                                    Edit
                                  </Button>
                                )}
                                <Button
                                  onClick={() =>
                                    setAdd({
                                      status: true,
                                      type: "show",
                                      object: res,
                                    })
                                  }
                                  className="theme_light_btn btn btn-primary"
                                >
                                  View
                                </Button>
                                {filter?.status == "active" && (
                                  <Button
                                    onClick={() =>
                                      onChangeStatus({
                                        body: res,
                                        type: false,
                                      })
                                    }
                                    className="theme_light_btn btn btn-primary"
                                  >
                                    In Active
                                  </Button>
                                )}
                                {filter?.status == "inactive" && (
                                  <Button
                                    onClick={() =>
                                      onChangeStatus({
                                        body: res,
                                        type: true,
                                      })
                                    }
                                    className="theme_light_btn btn btn-primary"
                                  >
                                    Active
                                  </Button>
                                )}
                                {filter?.status == "inactive" && (
                                  <Button
                                    onClick={() => onDelete(res)}
                                    className="theme_light_btn btn btn-primary"
                                  >
                                    Delete
                                  </Button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={12}>
                            <span>No Record Found.</span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {/* <tr>
                      <td colSpan={12}>
                        <span>No Record Found.</span>
                      </td>
                    </tr> */}
                  </Table>
                </div>
                {/* {(data?.hasNextPage || data?.hasPrevPage) && (
                  <div className="bottom-pagination">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel=" >"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={10}
                      pageCount={data?.totalPages}
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
        </Container>
      </section>

      {add?.status && (
        <AddOffer
          getData={getData}
          type={add?.type}
          object={add?.object}
          onClose={() => setAdd({})}
        />
      )}
    </div>
  );
};

export default Offer;
