import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { apiGet, apiPost } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import ReactPaginate from "react-paginate";
import { useLocation } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { startCase } from "lodash";
import obj from "../../utils/helpers";
import PreviewImage from "../../components/PreviewImage";
import UpdateDialogBox from "../../components/UpdateDialogBox";
import { toast } from "wc-toast";
import AddBanner from "./Add";
const PromotionalList = () => {
  let { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const location = useLocation();
  const [open, setOpen] = useState({});
  const [filter, setFilter] = useState({
    page: 1,
    limit: 100,
  });
  const [show, setShow] = useState({
    status: false,
    image: "",
  });
  const getData = async (obj = filter) => {
    const { status, data: response_users } = await apiPost(apiPath.bannerList, {
      page: obj?.page,
      limit: obj?.limit,
    });
    if (status === 200) {
      if (response_users.success) {
        setData(response_users?.results);
      }
    }
  };

  const updateTransaction = async () => {
    const { status, data: response_users } = await apiPost(
      apiPath.deleteBanner,
      {
        bannerId: open?.id,
      }
    );
    if (status === 200) {
      if (response_users.success) {
        toast.success(response_users?.message);
        setOpen({});
        getData();
      }
    }
  };

  const handlePageClick = (event) => {
    let obj = {
      page: event.selected + 1,
      limit: filter?.limit,
    };
    setFilter(obj);
    getData(obj);
  };

  useEffect(() => {
    getData();
  }, []);

  const [add, setAdd] = useState({});
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec d-flex justify-content-between align-items-center w-100 mb-2">
            <h2 className="common-heading">Promotional Offer</h2>{" "}
            <Button
              onClick={() =>
                setAdd({
                  status: true,
                  type: "add",
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
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Sr no.</th>
                        <th scope="col">Banner Image</th>
                        <th scope="col">Category</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    {data && data?.length > 0 ? (
                      data?.map((item, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td className="p-0 m-0">
                              {item?.banner_path?.split("/")?.length > 1 ? (
                                <img
                                  style={{
                                    width: "120px",
                                    height: "100px",
                                    objectFit: "contain",
                                  }}
                                  onClick={() => {
                                    setShow({
                                      status: true,
                                      image:
                                        process.env.REACT_APP_API_BASE_URL +
                                        item?.banner_path,
                                    });
                                  }}
                                  src={
                                    process.env.REACT_APP_API_BASE_URL +
                                    item?.banner_path
                                  }
                                />
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>
                              {item?.type == "home_top"
                                ? "Home Top Slider"
                                : "Home Middle Slider"}
                            </td>
                            <td>
                              <Button
                                className="btn btn-danger"
                                style={{ background: "red", color: "white" }}
                                onClick={() =>
                                  setOpen({
                                    status: true,
                                    type: "Delete",
                                    typeCheck: "Delete",
                                    id: item?._id,
                                  })
                                }
                              >
                                Delete
                              </Button>
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
                  </Table>
                </div>
                {(data?.hasNextPage || data?.hasPrevPage) && (
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
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
      {open?.status && (
        <UpdateDialogBox
          open={open?.status}
          onClose={() => setOpen({ status: false, type: "" })}
          onSubmit={updateTransaction}
          headerTitle={startCase(open?.type)}
          title={`Are you sure to delete this banner?`}
          isLoader={""}
        />
      )}
      {add?.status && (
        <AddBanner
          getData={getData}
          type={add?.type}
          data={add?.data}
          onClose={() => setAdd({})}
        />
      )}
      {show?.status && (
        <PreviewImage
          onClose={() => setShow({ status: false, image: "" })}
          open={show?.status}
          image={show?.image}
        />
      )}
    </div>
  );
};

export default PromotionalList;
