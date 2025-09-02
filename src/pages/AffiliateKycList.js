import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { apiGet, apiPost } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import ReactPaginate from "react-paginate";
import { useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { startCase } from "lodash";
import obj from "../utils/helpers";
import UpdateDialogBox from "../components/UpdateDialogBox";
import { toast } from "wc-toast";
import PreviewImage from "../components/PreviewImage";

const AffiliateKycList = () => {
  let { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [DeleteOpen, setDeleteOpen] = useState(false);

  
  const [filter, setFilter] = useState({
    page: 1,
    limit: 100,
  });
  const [show, setShow] = useState({
    status: false,
    image: "",
  });
  const getData = async (obj = filter) => {
    const { status, data: response_users } = await apiGet(
      apiPath.kycLists,
      {
        page: obj?.page,
        limit: obj?.limit,
      }
    );
    if (status === 200) {
      if (response_users.success) {
        
        setData(response_users?.results);
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

  const updateTransaction = async (obj) => {
    setLoader(true);
    const { status, data: response_users } = await apiPost(
      apiPath.updateKycStatus,
      {
        id: open?.id?._id,
        status: open?.typeCheck,
        remark: obj?.remark,
      }
    );
    if (status === 200) {
      if (response_users.success) {
        setLoader(false);
        toast.success(response_users?.message);
        setOpen({});
        getData();
      } else {
        toast.error(response_users?.message);
        setLoader(false);
      }
    } else {
      toast.error(response_users?.message);
      setLoader(false);
    }
  };

  

  const deleteKyc = async () => {
    const { status, data: response_users } = await apiPost(
      apiPath.deleteDocument,
      {
        id: DeleteOpen?.id,
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Affiliate KYC List</h2>
          </div>
          <div className="inner-wrapper">
            <div className="common-container">
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Sr no.</th>
                        <th scope="col">Document File</th>
                        <th scope="col">Document Type</th>
                        <th scope="col">Document Number</th>
                        <th scope="col">Contact Number</th>
                        <th scope="col">Name</th>
                        <th scope="col">Username</th>
                        <th scope="col">Status</th>
                        <th scope="col">Created Date</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    {data?.data && data?.data?.length > 0 ? (
                      data?.data?.map((item, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td className="p-0 m-0">
                              {item?.kycFile?.split("/")?.length > 1 ? (
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
                                        item?.kycFile,
                                    });
                                  }}
                                  src={
                                    process.env.REACT_APP_API_BASE_URL +
                                    item?.kycFile
                                  }
                                />
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>{item?.documentType}</td>
                            <td>{item?.documentNumber}</td>
                            <td>{item?.contactNumber}</td>
                           
                            <td>{item?.kycName || "-"}</td>
                            <td>{item?.username || "-"}</td>
                            <td>{item?.status}</td>
                            <td>{obj?.dateFormat(item?.createdAt)}</td>
                            <td>
                              <Button
                                className="btn btn-primary"
                                style={{ background: "green", color: "white" }}
                                onClick={() =>
                                  setOpen({
                                    status: true,
                                    type: "approve",
                                    typeCheck: "approved",
                                    id: item,
                                  })
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                className="btn btn-danger"
                                style={{ background: "red", color: "white" }}
                                onClick={() =>
                                  setOpen({
                                    status: true,
                                    type: "decline",
                                    typeCheck: "declined",
                                    id: item,
                                  })
                                }
                              >
                                Decline
                              </Button>
                              {/* <Button
                                className="btn btn-danger"
                                style={{ background: "red", color: "white" }}
                                onClick={() =>
                                  setDeleteOpen({
                                    status: true,
                                    type: "Delete",
                                    typeCheck: "Delete",
                                    id: item?._id,
                                  })
                                }
                              >
                                Delete
                              </Button> */}
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
          item={open?.id}
          type="kycupdate"
          onClose={() => setOpen({ status: false, type: "" })}
          onSubmit={updateTransaction}
          headerTitle={startCase(open?.type)}
          title={`Do you want to ${open?.type} this kyc`}
          isLoader={loader}
        />
      )}
       {DeleteOpen?.status && (
        <UpdateDialogBox
          open={DeleteOpen?.status}
          onClose={() => setDeleteOpen({ status: false, type: "" })}
          onSubmit={deleteKyc}
          headerTitle={startCase(DeleteOpen?.type)}
          title={`Are you sure to delete this kyc?`}
          isLoader={""}
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

export default AffiliateKycList;
