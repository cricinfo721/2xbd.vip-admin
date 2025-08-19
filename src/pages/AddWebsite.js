import React, { useState, useEffect, useContext } from "react";
import { Button, Container, Form, Table, Modal } from "react-bootstrap";
import { isEmpty } from "lodash";
import ReactPaginate from "react-paginate";
import helpers from "../utils/helpers";
import AuthContext from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { apiPost, apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import { toast } from "wc-toast";
import { pick } from "lodash";

const SportSetting = () => {
  let { user } = useContext(AuthContext);
  const [matchData, setMatchData] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [viewpage, setViewPage] = useState(0);

  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
  });

  const getMatchData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.listWebsite,
      search_params
    );
    if (status === 200) {
      if (response_users.success) {
        setMatchData(response_users.results);
      }
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

  useEffect(() => {
    setPageCount(matchData?.totalPages || []);
  }, [matchData]);

  useEffect(() => {
    getMatchData();
    setViewPage(search_params.page ? search_params.page - 1 : 0);
  }, [search_params]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});
  const [isLoader, setLoader] = useState(false);

  const onSubmit = async (request) => {
    setLoader(true);

    try {
      const { status, data: response_users } = await apiPost(
        apiPath.createWebsite,
        pick(request, ["domain", "name"])
      );
      if (status === 200) {
        if (response_users.success) {
          setLoader(false);

          toast.success(response_users.message);
          reset();
          getMatchData();
        } else {
          setLoader(false);
          toast.error(response_users.message);
        }
      }
    } catch (err) {
      setLoader(false);
      toast.error(err.response.data.message);
    }
  };
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="db-sec">
            <h2 className="common-heading">Add Website</h2>
          </div>

          <div className="inner-wrapper">
            <div className="common-container">
              <div className="add_website_section mb-4">
                <div className="history-btn" style={{ display: "flex" }}>
                  <div className="find-member-sec search_banking_detail">
                    <Form
                      className="change-password-sec"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <Form.Group className="d-flex me-2">
                        <Form.Control
                          type="text"
                          placeholder="Enter Name"
                          className={errors.name ? " is-invalid " : ""}
                          {...register("name", {
                            required: "Please enter name",
                          })}
                        />
                        {errors.name && errors.name.message && (
                          <label className="invalid-feedback text-left">
                            {errors.name.message}
                          </label>
                        )}
                      </Form.Group>
                      <Form.Group className="d-flex me-2">
                        <Form.Control
                          type="text"
                          placeholder="Enter website name"
                          className={errors.domain ? " is-invalid " : ""}
                          {...register("domain", {
                            required: "Enter website name",
                          })}
                        />
                        {errors.domain && errors.domain.message && (
                          <label className="invalid-feedback text-left">
                            {errors.domain.message}
                          </label>
                        )}
                      </Form.Group>
                      <div className="text-center">
                        <Button type="submit" className="green-btn">
                          {isLoader ? "Loading..." : "Add"}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>

              <div className="account-table batting-table">
                <div className="responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col">Website Name</th>
                        <th scope="col">Is Used</th>
                        <th scope="col"> Used For </th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchData?.data &&
                        matchData?.data.map((matchList, index) => {
                          return (
                            <>
                              <tr key={index}>
                                <td>{matchList?.domain}</td>
                                <td></td>
                                <td></td>
                              </tr>
                            </>
                          );
                        })}
                      {isEmpty(matchData?.data) ? (
                        <tr>
                          <td colSpan={9}>No records found</td>
                        </tr>
                      ) : null}
                    </tbody>
                  </Table>

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
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default SportSetting;
