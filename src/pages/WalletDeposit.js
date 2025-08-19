import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { apiGet, apiPost } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import ReactPaginate from "react-paginate";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { startCase } from "lodash";
import UpdateDialogBox from "../components/UpdateDialogBox";
import { toast } from "wc-toast";
import PreviewImage from "../components/PreviewImage";
import helpers from "../utils/helpers";
import { useForm } from "react-hook-form";
const WalletDeposit = () => {
  let { user, setBellSound } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({});
  const [data, setData] = useState([]);
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState({
    status: false,
    image: "",
  });
  const [filter, setFilter] = useState({
    page: 1,
    limit: 100,
  });

  const getData = async (obj = filter) => {
    const { status, data: response_users } = await apiGet(
      apiPath.walletDeposit,
      {
        page: obj?.page,
        limit: obj?.limit,
      }
    );
    if (status === 200) {
      if (response_users.success) {
        setBellSound(false);
        setData(response_users?.results);
      }
    }
  };

  const updateTransaction = async (obj) => {
    setLoader(true);
    const { status, data: response_users } = await apiPost(
      apiPath.updateTransaction,
      {
        TransactionRequestId: open?.id?._id,
        status: open?.typeCheck,
        type: "deposit",
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

  const [editTransaction, setEditTransaction] = useState({
    status: false,
    id: "",
  });

  const updateTransactionId = async (body) => {
    setLoader(true);
    const { status, data: response_users } = await apiPost(
      apiPath.updateTransactionId,
      {
        transactionId: body?.id,
        id: editTransaction?.id,
      }
    );
    if (status === 200) {
      if (response_users.success) {
        setLoader(false);
        toast.success(response_users?.message);
        setEditTransaction({
          status: false,
          id: editTransaction?.id,
        });
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

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Wallet Deposit</h2>
          </div>
          <div className="inner-wrapper">
            <div className="common-container">
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Sr no.</th>
                        <th scope="col">UserName</th>
                        <th scope="col">Transaction ID</th>
                        <th scope="col">Account Name</th>
                        <th scope="col">Bank Name</th>
                        <th scope="col">Bank Account</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Transaction Type</th>
                        <th scope="col">Transaction File</th>
                        <th scope="col">Recipet Date</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    {data?.data && data?.data?.length > 0 ? (
                      data?.data?.map((item, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{item?.username || item?.userId}</td>
                            <td>
                              <div className="d-flex align-items-center bg-transparent">
                                {" "}
                                <span>{item?.TransactionId}</span>{" "}
                                <Link
                                  to="#"
                                  style={{ marginLeft: "10px" }}
                                  className="text-decoration-none text-primary btn theme_light_btn"
                                  onClick={() => {
                                    setEditTransaction({
                                      status: true,
                                      id: item?._id,
                                    });
                                    setValue("id", item?.TransactionId);
                                  }}
                                >
                                  Edit{" "}
                                  <i className="fas fa-pen text-primary ps-1"></i>
                                </Link>
                              </div>
                            </td>
                            <td>{item?.AccountName}</td>
                            <td>
                              {item?.bank_name || item.bank}
                            </td>
                            <td>{item?.BankAccount}</td>
                            <td>{item?.amount}</td>
                            <td>{startCase(item?.transactionType)}</td>
                            <td className="p-0 m-0">
                              {item?.TransactionFile?.split("/")?.length > 1 ? (
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
                                        item?.TransactionFile,
                                    });
                                  }}
                                  src={
                                    process.env.REACT_APP_API_BASE_URL +
                                    item?.TransactionFile
                                  }
                                />
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>
                              {helpers.dateFormat(
                                item?.receiptDate,
                                user.timeZone
                              )}
                            </td>
                            <td>
                            {/* {user?.userType=="owner" &&( */}
                            <>
                              <Button
                                className="btn btn-primary"
                                style={{ background: "green", color: "white" }}
                                onClick={() =>
                                  setOpen({
                                    status: true,
                                    type: "approve",
                                    typeCheck: "completed",
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
                                    typeCheck: "voided",
                                    id: item,
                                  })
                                }
                              >
                                Decline
                              </Button>
                              </>
                       {/* ) } */}
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
          type={"deposit"}
          item={open?.id}
          onClose={() => setOpen({ status: false, type: "" })}
          onSubmit={updateTransaction}
          headerTitle={startCase(open?.type)}
          title={`Do you want to ${open?.type} this transaction`}
          isLoader={loader}
        />
      )}
      {show?.status && (
        <PreviewImage
          onClose={() => setShow({ status: false, image: "" })}
          open={show?.status}
          image={show?.image}
        />
      )}
      {editTransaction?.status && (
        <Modal
          show={editTransaction?.status}
          onHide={() => {
            setEditTransaction({ status: false, id: "" });
          }}
          className="change-status-modal p-0"
        >
          <Modal.Header closeButton>
            <Modal.Title className="modal-title-status h4">
              Edit Transaction Id
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="test-status border-0">
              <Form
                className="change-password-sec"
                onSubmit={handleSubmit(updateTransactionId)}
              >
                <Form.Group className="d-flex  mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Transaction Id"
                    className={errors.id ? " is-invalid " : ""}
                    {...register("id", {
                      required: "Please enter transaction id",
                    })}
                  />
                  {errors.id && errors.id.message && (
                    <label className="invalid-feedback align-leftt">
                      {errors.id.message}
                    </label>
                  )}
                </Form.Group>

                <div className="text-center mt-4">
                  <Button type="submit" className="green-btn">
                    Update
                  </Button>
                </div>
              </Form>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default WalletDeposit;
