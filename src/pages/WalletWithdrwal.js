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
const WalletWithdrwal = () => {
  let { user, setBellSound } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 100,
  });

  const getData = async (obj = filter) => {
    const { status, data: response_users } = await apiGet(
      apiPath.walletWithdrwal,
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
      apiPath.updateTransaction,
      {
        TransactionRequestId: open?.id?._id,
        status: open?.typeCheck,
        type: "withdrawal",
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
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Wallet Withdrawal</h2>
          </div>
          <div className="inner-wrapper">
            <div className="common-container">
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Sr no.</th>
                        <th scope="col">User Name</th>
                        <th scope="col">Account Name</th>
                        <th scope="col">Bank Name</th>
                        <th scope="col">Bank Account</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Transaction Type</th>
                        <th scope="col">Created Date</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    {data?.data && data?.data?.length > 0 ? (
                      data?.data?.map((item, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{item?.username || item?.userId}</td>
                            <td>{item?.AccountName}</td>
                            <td>
                              {item?.bank_name || item.bank}
                            </td>
                            <td>{item?.BankAccount || "-"}</td>
                            <td>{item?.amount}</td>
                            <td>{startCase(item?.type) || "-"}</td>
                            <td>{obj?.dateFormat(item?.createdAt)}</td>
                            <td>
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
          type="wallet"
          onClose={() => setOpen({ status: false, type: "" })}
          onSubmit={updateTransaction}
          headerTitle={startCase(open?.type)}
          title={`Do you want to ${open?.type} this transaction`}
          isLoader={loader}
        />
      )}
    </div>
  );
};

export default WalletWithdrwal;
