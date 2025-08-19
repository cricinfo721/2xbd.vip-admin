import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { apiGet, apiPost } from "../../utils/apiFetch";
import obj from "../../utils/constants";
import apiPath from "../../utils/apiPath";
import moment from "moment";
import ReactPaginate from "react-paginate";
import { useLocation } from "react-router-dom";
import helpers from "../../utils/helpers";
import AuthContext from "../../context/AuthContext";
import AddBank from "./AddBank";
import UpdateDialogBox from "../../components/UpdateDialogBox";
import { toast } from "wc-toast";
const Banks = () => {
  let { user } = useContext(AuthContext);

  const [open, setOpen] = useState({
    status: false,
    type: "",
  });
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const [data, setData] = useState([]);
  const location = useLocation();
  const [filter, setFilter] = useState({
    page: 1,
    limit: 100,
  });

  const getData = async () => {
    const { status, data: response_users } = await apiPost(apiPath.getBankList);
    if (status === 200) {
      if (response_users.success) {
        setData(response_users.results);
      }
    }
  };
  const deleteFunc = async () => {
    const { status, data: response_users } = await apiPost(apiPath.deletBank, {
      bankId: id,
    });
    if (status === 200) {
      if (response_users.success) {
        toast.success(response_users?.message);
        getData();
        setShow(false);
        setId("");
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const updateStatus = async (obj) => {
    const { status, data: response_users } = await apiPost(
      apiPath.updateStatusBank,
      obj
    );
    if (status === 200) {
      if (response_users.success) {
        toast.success(response_users?.message);
        getData();
      }
    }
  };
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec d-flex justify-content-between align-items-center w-100 mb-2">
            <h2 className="common-heading">Banks</h2>
            {/* {user?.userType == "owner" && (  */}
              <Button
                onClick={() =>
                  setOpen({
                    status: true,
                    type: "add",
                  })
                }
              >
                + Add Bank
              </Button>
            {/* )}  */}
          </div>
          <div className="inner-wrapper">
            <div className="common-container">
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Sr no.</th>
                        <th scope="col">Bank Name</th>
                        <th scope="col">Category</th>
                        <th scope="col">Account Name</th>
                        <th scope="col">Account Number</th>
                        <th scope="col">Created Date</th>
                        <th scope="col">Action</th>
                        <th scope="col">ON/OFF</th>
                      </tr>
                    </thead>
                    {data && data?.length > 0 ? (
                      data?.map((item, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{item?.bank_name}</td>
                            <td>{item?.type || "-"}</td>
                            <td>{item?.account_name || "-"}</td>
                            <td>{item?.account_number || "-"}</td>
                            <td>{helpers.dateFormat(item?.createdAt)}</td>
                            <td>
                               {/* {user?.userType == "owner" && (  */}
                                <>
                                  <Button
                                    className="btn btn-primary"
                                    style={{
                                      background: "green",
                                      color: "white",
                                    }}
                                    onClick={() =>
                                      setOpen({
                                        status: true,
                                        type: "edit",
                                        data: item,
                                      })
                                    }
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    className="btn btn-danger"
                                    style={{
                                      background: "red",
                                      color: "white",
                                    }}
                                    onClick={() => {
                                      setShow(true);
                                      setId(item?._id);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </>
                              {/* )}  */}
                            </td>
                            <td>
                             {/* {user?.userType == "owner" && (  */}
                                <Form.Check
                                  inline
                                  label={""}
                                  type="switch"
                                  checked={item?.status}
                                  onChange={(e) =>
                                    updateStatus({
                                      status: e.target.checked,
                                      id: item?._id,
                                    })
                                  }
                                />
                             {/* )}  */}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={12}>
                          <span>You have no bets in this time period.</span>
                        </td>
                      </tr>
                    )}
                    {/* <tbody>
                      <tr>
                        <td>{}</td>
                        <td>{}</td>
                        <td>{}</td>
                        <td>{}</td>
                        <td>{}</td>
                        <td></td>
                        <td>
                          <Form.Check
                            inline
                            label={""}
                            type="switch"
                            // checked={item?.status}
                            // onChange={(e) =>
                            //   updateStatus({
                            //     status: e.target.checked,
                            //     id: item?._id,
                            //   })
                            // }
                          />
                        </td>
                      </tr>
                    </tbody> */}
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      {open?.status && (
        <AddBank
          getData={getData}
          type={open?.type}
          data={open?.data}
          onClose={() => setOpen({})}
        />
      )}
      {show && (
        <UpdateDialogBox
          open={show}
          onClose={() => setShow(false)}
          onSubmit={deleteFunc}
          headerTitle={"Delete"}
          title={"Are you sure to remove bank ?"}
        />
      )}
    </div>
  );
};

export default Banks;
