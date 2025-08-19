import React, { useContext, useEffect, useState } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { toast } from "wc-toast";
import { apiGet, apiPost } from "../utils/apiFetch";
import pathObj from "../utils/apiPath";
import obj from "../utils/constants";
import { useForm } from "react-hook-form";
import { isObject, isString } from "lodash";
import AuthContext from "../context/AuthContext";

const ManageLinks = () => {
  const { user } = useContext(AuthContext);
  const [websiteData, setWebsiteData] = useState("");
  const [linksData, setLinksData] = useState("");
  const [liveShowing, setLiveShowing] = useState("");
  const [select, setSelect] = useState("");
  const [telegramContent, setTelegramContent] = useState("");
  const [whatsappContent, setWhatsappContent] = useState("");
  const [liveContent, setLiveContent] = useState("");
  const [telegramShowing, setTelegramShowing] = useState("");
  const [whatsappShowing, setWhatsappShowing] = useState("");
  const [iconTelegram, setIconTelegram] = useState("");
  const [iconWhatsapp, setIconWhatsapp] = useState("");
  const [iconLive, setIconLive] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});

  const [search_params, setSearchParams] = useState({
    page: 1,
    limit: 100,
  });
  const getWebsiteData = async () => {
    const { status, data: response_users } = await apiGet(pathObj.listWebsite);
    if (status === 200) {
      if (response_users.success) {
        setWebsiteData(response_users.results?.data);
        if (user?.userType == "sub_owner") {
          setSelect(response_users.results?.data[0]?._id);
        }
      }
    }
  };

  const getLinkData = async () => {
    const { status, data: response_users } = await apiGet(
      pathObj.getWebsiteLinkData + "?websiteId=6713770a106ac41f0d6c38ab",
      search_params
    );
    if (status === 200) {
      if (response_users.success) {
        setLinksData(response_users.results);

        setWhatsappContent(
          response_users.results?.whatsappContent
            ? response_users.results?.whatsappContent
            : ""
        );
        setIconWhatsapp(
          response_users?.results?.whatsappIcon
            ? response_users?.results?.whatsappIcon
            : ""
        );
        setWhatsappShowing(
          response_users.results?.whatsappShowing
            ? response_users.results?.whatsappShowing == "true"
              ? true
              : false
            : ""
        );
        setTelegramContent(
          response_users.results?.telegramContent
            ? response_users.results?.telegramContent
            : ""
        );
        setTelegramShowing(
          response_users.results?.telegramShowing
            ? response_users.results?.telegramShowing == "true"
              ? true
              : false
            : ""
        );
        setIconTelegram(
          response_users?.results?.telegramIcon
            ? response_users?.results?.telegramIcon
            : ""
        );

        setLiveContent(
          response_users.results?.livechatContent
            ? response_users.results?.livechatContent
            : ""
        );
        setLiveShowing(
          response_users.results?.livechatShowing
            ? response_users.results?.livechatShowing == "true"
              ? true
              : false
            : ""
        );
        setIconLive(
          response_users?.results?.livechatIcon
            ? response_users?.results?.livechatIcon
            : ""
        );
      }
    }
  };
  const uploadImage = async (obj) => {
    let form = new FormData();
    form.append("BannerFile", obj);
    const { status, data } = await apiPost(pathObj.uploadBanner, form);
    if (status == 200) {
      return data?.path;
    } else {
      return "";
    }
  };
  const onSubmit = async () => {
    let iconTelegramCheck = "";
    if (isObject(iconTelegram)) {
      iconTelegramCheck = await uploadImage(iconTelegram);
    }
    let iconWhatsappCheck = "";
    if (isObject(iconWhatsapp)) {
      iconWhatsappCheck = await uploadImage(iconWhatsapp);
    }
    let iconLiveCheck = "";
    if (isObject(iconLive)) {
      iconLiveCheck = await uploadImage(iconLive);
    }
    try {
      let response = await apiPost(pathObj.updateWebsiteSetting, {
        websiteId: "6713770a106ac41f0d6c38ab",
        telegramContent: telegramContent,
        whatsappContent: whatsappContent,
        telegramShowing: telegramShowing,
        whatsappShowing: whatsappShowing,
        telegramIcon: iconTelegramCheck
          ? iconTelegramCheck
          : linksData?.telegramIcon || "",
        whatsappIcon: iconWhatsappCheck
          ? iconWhatsappCheck
          : linksData?.whatsappIcon || "",
        livechatContent: liveContent,
        livechatShowing: liveShowing,
        livechatIcon: iconLiveCheck
          ? iconLiveCheck
          : linksData?.livechatIcon || "",
      });
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (select) {
      getLinkData();
    }
  }, [select]);

  useEffect(() => {
    getWebsiteData();
  }, []);

  return (
    <div>
      <section className="set-limit-sec py-4">
        <Container fluid>
          <Form>
            {user?.userType !== "sub_owner" && (
              <Row className="align-items-center">
                <Col md={3}>
                  <Form.Group className="d-flex align-items-center mb-3  find-member-sec ">
                    <Form.Label className="pe-2 mb-0 w-75">
                      Select Domain
                    </Form.Label>
                    <Form.Select
                      value={select}
                      onChange={(e) => setSelect(e.target.value)}
                      aria-label="Default select example w-auto"
                    >
                      <option value=""> Select Domain</option>;
                      {websiteData &&
                        websiteData?.map((item, index) => {
                          return (
                            <option value={item?._id}>{item?.domain}</option>
                          );
                        })}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}
            <Row className="align-items-center">
              <h2 className="common-heading">Set Telegram</h2>
              <Col
                xl={12}
                lg={12}
                sm={12}
                className="d-flex align-items-center my-2"
              >
                <Form.Group className="d-flex align-items-center mb-2">
                  <Form.Label className="pe-2 mb-0">Number/Links </Form.Label>
                  <Form.Control
                    type="text"
                    name="telegramContent"
                    placeholder="Enter Number or Links"
                    value={telegramContent}
                    onChange={(e) => setTelegramContent(e.target.value)}
                    className="me-3"
                  />
                </Form.Group>
                <Form.Group
                  className="d-flex align-items-center mb-2"
                  style={{ marginRight: "10px" }}
                >
                  <Form.Label className="pe-2 mb-0">Icon</Form.Label>
                  <input
                    type="file"
                    onChange={(e) => setIconTelegram(e.target.files[0])}
                  />
                  {iconTelegram !== "" && (
                    <img
                      style={{ width: "80px" }}
                      src={
                        isObject(iconTelegram)
                          ? URL.createObjectURL(iconTelegram)
                          : process.env.REACT_APP_API_BASE_URL + iconTelegram
                      }
                    />
                  )}
                </Form.Group>
                <input
                  checked={telegramShowing}
                  className="me-2"
                  type="checkbox"
                  name="telegramShowing"
                  onChange={(e) => setTelegramShowing(e.target.checked)}
                />
                ON (IS SHOWING)
                <Button className="green-btn ms-3" onClick={() => onSubmit()}>
                  Update
                </Button>
              </Col>
            </Row>
            <Row className="align-items-center">
              <h2 className="common-heading">Set Whatsapp</h2>
              <Col
                xl={12}
                lg={12}
                sm={12}
                className="d-flex align-items-center my-2"
              >
                <Form.Group className="d-flex align-items-center mb-2">
                  <Form.Label className="pe-2 mb-0">Number/Links </Form.Label>
                  <Form.Control
                    type="text"
                    name="whatsappContent"
                    placeholder="Enter Number or Links"
                    value={whatsappContent}
                    onChange={(e) => setWhatsappContent(e.target.value)}
                    className="me-3"
                  />
                </Form.Group>{" "}
                <Form.Group
                  className="d-flex align-items-center mb-2"
                  style={{ marginRight: "10px" }}
                >
                  <Form.Label className="pe-2 mb-0">Icon</Form.Label>
                  <input
                    type="file"
                    onChange={(e) => setIconWhatsapp(e.target.files[0])}
                  />
                  {iconWhatsapp !== "" && (
                    <img
                      style={{ width: "80px" }}
                      src={
                        isObject(iconWhatsapp)
                          ? URL.createObjectURL(iconWhatsapp)
                          : process.env.REACT_APP_API_BASE_URL + iconWhatsapp
                      }
                    />
                  )}
                </Form.Group>
                <input
                  className="me-2"
                  checked={whatsappShowing}
                  type="checkbox"
                  name="whatsappShowing"
                  onChange={(e) => setWhatsappShowing(e.target.checked)}
                />
                ON (IS SHOWING)
                <Button className="green-btn ms-3" onClick={() => onSubmit()}>
                  Update
                </Button>
              </Col>
            </Row>
            <Row className="align-items-center">
              <h2 className="common-heading">Set LiveChat</h2>

              <Col
                xl={12}
                lg={12}
                sm={12}
                className="d-flex align-items-center my-2"
              >
                <Form.Group className="d-flex align-items-center mb-2">
                  <Form.Label className="pe-2 mb-0">Number/Links </Form.Label>
                  <Form.Control
                    type="text"
                    name="emailContent"
                    placeholder="Enter Number or Links"
                    value={liveContent}
                    onChange={(e) => setLiveContent(e.target.value)}
                    className="me-3"
                  />
                </Form.Group>
                <Form.Group
                  className="d-flex align-items-center mb-2"
                  style={{ marginRight: "10px" }}
                >
                  <Form.Label className="pe-2 mb-0">Icon</Form.Label>
                  <input
                    type="file"
                    onChange={(e) => setIconLive(e.target.files[0])}
                  />
                  {iconLive !== "" && (
                    <img
                      style={{ width: "80px" }}
                      src={
                        isObject(iconLive)
                          ? URL.createObjectURL(iconLive)
                          : process.env.REACT_APP_API_BASE_URL + iconLive
                      }
                    />
                  )}
                </Form.Group>
                <input
                  className="me-2"
                  checked={liveShowing}
                  type="checkbox"
                  onChange={(e) => setLiveShowing(e.target.checked)}
                />
                ON (IS SHOWING)
                <Button className="green-btn ms-3" onClick={() => onSubmit()}>
                  Update
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </section>
    </div>
  );
};

export default ManageLinks;
