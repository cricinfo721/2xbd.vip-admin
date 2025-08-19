import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Container, Table, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "wc-toast";
import UpdateDialogBox from "../../components/UpdateDialogBox";
import { apiGet, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import obj from "../../utils/constants";
const ViewFancyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoader, setLoader] = useState(false);
  const [toogleId, setToogleId] = useState("");
  const setOpenToggle = () => setOpen(!open);
  const setDataForStatusChange = (id) => {
    setToogleId(id);
    setOpenToggle();
  };
  const getData = async () => {
    const { status, data: response_users } = await apiGet(
      `${apiPath.getFancyBetsDetails}?eventId=${id}`,
      ""
    );
    if (status === 200) {
      if (response_users?.success) {
        setData(response_users.results.fancyList);
      }
    }
  };

  const updateMatchStatus = async () => {
    setLoader(true);
    try {
      const { status, data: response_users } = await apiPut(
        apiPath.updateStatusRequestBets + toogleId,
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
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div
            className="db-sec"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
            }}
          >
            <h2 className="common-heading">Fancy Details</h2>
            <Button className="green-btn" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>

          <div className="inner-wrapper">
            <div className="common-container">
              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Sno.</th>
                        <th scope="col">Fancy Name</th>
                        <th scope="col"> Event Id </th>
                        <th scope="col">Runner Name</th>
                        <th scope="col">Market Status</th>
                        <th scope="col">Market Category</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    {data &&
                      data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.fancyName}</td>
                            <td>{item?.eventId}</td>
                            <td>{item?.jsonData[0]?.runnerName}</td>
                            <td>{obj.market_Status[item?.marketStatus]}</td>
                            <td>{obj.market_category[item?.categoryType]}</td>
                            <td>
                              <Form.Check
                                type="switch"
                                id="custom-switch"
                                checked={
                                  item?.status === "active" ? true : false
                                }
                                onClick={function () {
                                  setDataForStatusChange(item?._id);
                                }}
                              />
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

export default ViewFancyDetails;
