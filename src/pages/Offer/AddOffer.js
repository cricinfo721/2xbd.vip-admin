import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { apiGet, apiPost } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { isEmpty, isNumber, startCase } from "lodash";
import { toast } from "wc-toast";
import moment from "moment";
import Multiselect from "multiselect-react-dropdown";
const AddOffer = ({ onClose, object, type, getData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    resetField,
  } = useForm({
    defaultValues: {
      category: "Deposit",
    },
  });
  const [multiselect, setMultiSelect] = useState([]);
    const [multiselect1, setMultiSelect1] = useState([]);

  const [image, setImage] = useState("");
  const [image2, setImage2] = useState("");
  const uploadImage = async (img) => {
    let form = new FormData();
    form.append("BannerFile", img);
    const { status, data } = await apiPost(apiPath.uploadBanner, form);
    if (status == 200) {
      return data?.path;
    } else {
      return false;
    }
  };
  const [hide, setHide] = useState(false);
  const getDataNew = async () => {
    const { status, data: response_users } = await apiGet(apiPath.getOffer, {
      page: 1,
      limit: 100,
      status: "active",
    });
    if (status === 200) {
      if (response_users.success) {
        let find = response_users?.results?.find((res) => {
          return res?.isActive && res?.category == "Welcome Offer";
        });
        if (!isEmpty(find)) {
          setHide(true);
        } else {
          setHide(false);
        }
      }
    }
  };
  useEffect(() => {
    getDataNew();
  }, []);

  const onSubmit = async (body) => {
    if (fieldGroups.length > 0) {
      if (body?.category == "Welcome Offer") {
        body.variation = WelcomVariation;
      } else {
        body.variation = fieldGroups;
      }
    }
    console.log("body",body?.offerOn);
    if(isEmpty(body?.offerOn)){
      body.offerOn="Other"
    }
    if (multiselect?.length == 0) {
      toast.error("Please select offer apply on");
    } else {
      let descriptionImage = "";
      let imageCheck = "";
      if (isImageInState(image)) {
        imageCheck = await uploadImage(image);
      } else {
        imageCheck = image;
      }
      if (isImageInState(image2)) {
        descriptionImage = await uploadImage(image2);
      } else {
        descriptionImage = image2;
      }
      if (isEmpty(imageCheck)) {
        toast.error("Please select image");
      } else if (isEmpty(descriptionImage)) {
        toast.error("Please select description  image");
      } else {
        const { status, data: response_users } = await apiPost(
          apiPath.addOffer,
          {
            ...body,
            offerImage: imageCheck,
            descriptionImage: descriptionImage,
            offerApplyOn: multiselect,
            lossOfferApplyOn:multiselect1,
            id: !isEmpty(object) ? object?._id : "",
          }
        );
        if (status == 200) {
          if (response_users.success) {
            onClose();
            getData();
          }
        }
      }
    }
  };

  useEffect(() => {
    if (!isEmpty(object)) {
      setImage(object?.offerImage);
      setImage2(object?.descriptionImage);
      setValue("category", object?.category);
      setValue(
        "offerStartDateTime",
        moment(object?.offerStartDateTime).format("YYYY-MM-DD")
      );
      console.log(object, "object");
      setValue(
        "offerEndDateTime",
        moment(object?.offerEndDateTime).format("YYYY-MM-DD")
      );
      setValue("isCashBonus", object?.isCashBonus);

      setValue("bonusTurnover", object?.bonusTurnover);
      setValue("displayOrder", object?.displayOrder);
      setValue("title", object?.title);
      setValue("bonusCode", object?.bonusCode);
      setValue("bonusExpireinDays", object?.bonusExpireinDays);
      setValue("requiredTurnover", object?.requiredTurnover);
      setValue("offerOn", object?.offerOn);
      setValue("maxUser", object?.maxUser);
      setValue("offerBudget", object?.offerBudget);
      setValue("offerType", object?.offerType);
      setValue("percentageValue", object?.percentageValue);
      setValue("fixedValue", object?.fixedValue);
      setValue("minimumDeposite", object?.minimumDeposite);
      setValue("maxBounusValueUpTo", object?.maxBounusValueUpTo);
      // setValue("depositeVaritationMin", object?.depositeVaritationMin);
      // setValue("depositeVaritationMax", object?.depositeVaritationMax);
      setValue("maximumDeposite", object?.maximumDeposite);
      if (object?.offerApplyOn?.length > 0) {
        setMultiSelect(object?.offerApplyOn);
      }
       if (object?.lossOfferApplyOn?.length > 0) {
        setMultiSelect1(object?.lossOfferApplyOn);
      }
      // setValue(
      //   "depositeVaritationPercentage",
      //   object?.depositeVaritationPercentage
      // );
      setValue("description", object?.description);
      setFieldGroups(object?.variation);
      setWelcomVariation(object?.variation);
    }
  }, [object]);

  const isImageInState = (img) => {
    return img instanceof File && img.type.startsWith("image/");
  };

  const cat = [
    "Deposit",
    //  ...(type != 'edit' ?  !hide ? ["Welcome Offer"] : []),
    "Welcome Offer",
    // "App Download Bonus",
    // "Telegram Join Bonus",
     "Daily Loss Bonus",
     "Weekly Loss Bonus",
     "Monthly Loss Bonus",
    // "Monday Login Bonus",
    // "Special Bonus",
    "Free Spin",
     "Refer Bonus",
    // "Slots",
    // "Casino",
    // "Sports",
    // "Fishing",
    // "Card Game",
    // "ESports",
    // "Lottery",
    // "P2P",
    // "Table",
    // "Arcade",
    // "Cock Fighting",
    // "Cash Rain",
    // "Crash",
    // "Tips",
    // "Others",
  ];

  let condition = ["App Download Bonus", "Telegram Join Bonus"];
  const [fieldGroups, setFieldGroups] = useState([
    {
      id: Date.now(),
      depositeVaritationMin: "",
      depositeVaritationMax: "",
      depositeVaritationPercentage: "",
    },
  ]);
  const [WelcomVariation, setWelcomVariation] = useState([
    {
      id: Date.now(),
      welcomeVarationCondition: "",
      welcomeVarationType: "",
      welcomeVarationPercentage: "",
      welcomeVarationExpireIn: "",
      welcomeVarationBonusTurnover: "",
      welcomeBonusApplyOn: [],
    },
  ]);
  // console.log(moment(watch('offerEndDateTime')).diff(moment(watch('offerStartDateTime')), "days"), "WelcomVariation");
  const addGroup = () => {
    setFieldGroups([
      ...fieldGroups,
      {
        id: Date.now(),
        depositeVaritationMin: "",
        depositeVaritationMax: "",
        depositeVaritationPercentage: "",
      },
    ]);
  };
  const addGroupVariation = () => {
    setWelcomVariation([
      ...WelcomVariation,
      {
        id: Date.now(),
        welcomeVarationCondition: "",
        welcomeVarationType: "",
        welcomeVarationPercentage: "",
        welcomeVarationExpireIn: "",
        welcomeVarationBonusTurnover: "",
        welcomeBonusApplyOn: [],
      },
    ]);
  };
  const removeGroup = (id) => {
    setFieldGroups(fieldGroups.filter((group) => group.id !== id));
  };
  const removeGroupVariation = (id) => {
    setWelcomVariation(WelcomVariation.filter((group) => group.id !== id));
  };

  const handleChange = (id, field, value) => {
    setFieldGroups(
      fieldGroups.map((group) =>
        group.id === id ? { ...group, [field]: value } : group
      )
    );
  };
  const handleChangeVariation = (id, field, value) => {
    setWelcomVariation(
      WelcomVariation.map((group) =>
        group.id === id ? { ...group, [field]: value } : group
      )
    );
  };
  function calculatePercentage(percent, total) {
    return (percent / 100) * total;
  }

  useEffect(() => {
    if (
      !isEmpty(watch("offerStartDateTime")) &&
      !isEmpty(watch("offerEndDateTime")) &&
      type != "show"
    ) {
      setValue(
        "bonusExpireinDays",
        moment(watch("offerEndDateTime")).diff(
          moment(watch("offerStartDateTime")),
          "days"
        )
      );
    }
  }, [watch("offerStartDateTime"), watch("offerEndDateTime"), type]);

  // useEffect(() => {
  //   if (!isEmpty(watch("offerStartDateTime")) && type != "show") {
  //     setValue("offerEndDateTime", "");
  //     setValue("bonusExpireinDays", "");
  //   }
  // }, [watch("offerStartDateTime"), type]);

  let days =
    !isEmpty(watch("offerEndDateTime")) && !isEmpty(watch("offerStartDateTime"))
      ? moment(watch("offerEndDateTime")).diff(
          moment(watch("offerStartDateTime")),
          "days"
        )
      : true;

  return (
    <Modal size="xl" className="offer-modal" show={true} onHide={onClose}>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="modal-title-status">Add Offer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              {" "}
              <Col sm={12} lg={4} md={4} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Category
                    </span>
                    <Form.Select
                      style={{ height: "36px" }}
                      disabled={type == "show"}
                      className={errors.category ? " is-invalid mt-1" : "mt-1"}
                      {...register("category", {
                        required: "Please select category",
                      })}
                    >
                      {" "}
                      <option value={""}>Select Category</option>{" "}
                      {cat?.map((res) => {
                        return <option value={res}>{res}</option>;
                      })}
                    </Form.Select>
                    {errors.category && errors.category.message && (
                      <label className="invalid-feedback text-left">
                        {errors.category.message}
                      </label>
                    )}
                  </div>
                </Form.Group>
              </Col>
               {[
               
                "Daily Loss Bonus",
                "Weekly Loss Bonus",
                "Monthly Loss Bonus",
              ].includes(watch("category")) && ( 
              <Col sm={12} lg={4} md={4} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Loss Offer Apply On 
                    </span>
                    <Multiselect
                      disable={type == "show"}
                      options={Offer} // Options to display in the dropdown
                      selectedValues={multiselect1} // Preselected value to persist in dropdown
                      onSelect={setMultiSelect1} // Function will trigger on select event
                      onRemove={setMultiSelect1} // Function will trigger on remove event
                      displayValue="name" // Property name to display in the dropdown options
                    />

                    {errors.lossOfferApplyOn && errors.lossOfferApplyOn.message && (
                      <label className="invalid-feedback text-left">
                        {errors.lossOfferApplyOn.message}
                      </label>
                    )}
                  </div>
                </Form.Group>
              </Col>
              )} 
              <Col sm={12} lg={4} md={4} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Offer Start DateTime *
                    </span>
                    <Form.Control
                      type="date"
                      disabled={type == "show"}
                      className={
                        errors.offerStartDateTime ? " is-invalid mt-1" : "mt-1"
                      }
                      min={new Date().toISOString().split("T")[0]}
                      {...register("offerStartDateTime", {
                        required: "Please enter Offer Start DateTime",
                        onChange: (value) => {
                          if (type != "show") {
                            setValue("offerEndDateTime", "");
                            setValue("bonusExpireinDays", "");
                          }
                        },
                      })}
                    />
                    {errors.offerStartDateTime &&
                      errors.offerStartDateTime.message && (
                        <label className="invalid-feedback text-left">
                          {errors.offerStartDateTime.message}
                        </label>
                      )}
                  </div>
                </Form.Group>
              </Col>{" "}
              <Col sm={12} lg={4} md={4} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Offer End DateTime *
                    </span>
                    <Form.Control
                      type="date"
                      className={
                        errors.offerEndDateTime ? " is-invalid mt-1" : "mt-1"
                      }
                      min={
                        !isEmpty(watch("offerStartDateTime"))
                          ? new Date(watch("offerStartDateTime"))
                              .toISOString()
                              .split("T")[0]
                          : new Date()
                      }
                      disabled={
                        type == "show"
                          ? true
                          : !isEmpty(watch("offerStartDateTime"))
                          ? false
                          : true
                      }
                      // max={new Date().toISOString().split("T")[0]}
                      {...register("offerEndDateTime", {
                        required: "Please enter Offer End DateTime",
                      })}
                    />
                    {errors.offerEndDateTime &&
                      errors.offerEndDateTime.message && (
                        <label className="invalid-feedback text-left">
                          {errors.offerEndDateTime.message}
                        </label>
                      )}
                  </div>
                </Form.Group>
              </Col>{" "}
              <Col sm={12} lg={4} md={4} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Display Order *
                    </span>
                    <Form.Control
                      type="number"
                      disabled={type == "show"}
                      placeholder="Display Order"
                      className={
                        errors.displayOrder ? " is-invalid mt-1" : "mt-1"
                      }
                      {...register("displayOrder", {
                        required: "Please enter Display Order",
                      })}
                    />
                    {errors.displayOrder && errors.displayOrder.message && (
                      <label className="invalid-feedback text-left">
                        {errors.displayOrder.message}
                      </label>
                    )}
                  </div>
                </Form.Group>
              </Col>{" "}
              <Col sm={12} lg={4} md={4} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Title *
                    </span>
                    <Form.Control
                      type="text"
                      disabled={type == "show"}
                      placeholder="Title"
                      className={errors.title ? " is-invalid mt-1" : "mt-1"}
                      {...register("title", {
                        required: "Please enter Title",
                      })}
                    />
                    {errors.title && errors.title.message && (
                      <label className="invalid-feedback text-left">
                        {errors.title.message}
                      </label>
                    )}
                  </div>
                </Form.Group>
              </Col>
              {/* {watch("category") != "Refer Bonus" && ( */}
                <Col sm={12} lg={4} md={4} className="mb-2">
                  <Form.Group className="row">
                    <div>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        Bonus Code *
                      </span>
                      <Form.Control
                        type="text"
                        disabled={type == "show"}
                        placeholder="Bonus Code"
                        className={
                          errors.bonusCode ? " is-invalid mt-1" : "mt-1"
                        }
                        {...register("bonusCode", {
                          required: "Please enter Bonus Code",
                        })}
                      />
                      {errors.bonusCode && errors.bonusCode.message && (
                        <label className="invalid-feedback text-left">
                          {errors.bonusCode.message}
                        </label>
                      )}
                    </div>
                  </Form.Group>
                </Col>
              {/* )} */}
              <Col sm={12} lg={4} md={4} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Bonus Expire in Days *
                    </span>
                    <Form.Control
                      disabled={true}
                      type="number"
                      placeholder="Bonus Expire in Days"
                      className={
                        errors.bonusExpireinDays ? " is-invalid mt-1" : "mt-1"
                      }
                      {...register("bonusExpireinDays")}
                    />
                    {errors.bonusExpireinDays &&
                      errors.bonusExpireinDays.message && (
                        <label className="invalid-feedback text-left">
                          {errors.bonusExpireinDays.message}
                        </label>
                      )}
                  </div>
                </Form.Group>
              </Col>
              {!["Welcome Offer", "Free Spin"].includes(watch("category")) && (
                <Col sm={12} lg={4} md={4} className="mb-2">
                  <Form.Group className="row">
                    <div>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        Required Turnover *(example : 1x,2x,3x)
                      </span>
                      <Form.Control
                        disabled={type == "show"}
                        type="number"
                        placeholder="Required Turnover"
                        className={
                          errors.requiredTurnover ? " is-invalid mt-1" : "mt-1"
                        }
                        {...register("requiredTurnover", {
                          required: "Please enter Required Turnover",
                        })}
                      />
                      {errors.requiredTurnover &&
                        errors.requiredTurnover.message && (
                          <label className="invalid-feedback text-left">
                            {errors.requiredTurnover.message}
                          </label>
                        )}
                    </div>
                  </Form.Group>
                </Col>
              )}
              {["Deposit", "Welcome Offer" , "Refer Bonus"].includes(watch("category")) && (
              <Col sm={12} lg={4} md={4} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Offer On *
                    </span>
                    <Form.Select
                      disabled={type == "show"}
                      style={{ height: "36px" }}
                      className={errors.offerOn ? " is-invalid mt-1" : "mt-1"}
                      {...register("offerOn", {
                        required: "Please select offer on",
                      })}
                    >
                      {" "}
                      <option value={""}>Select Deposite Type</option>{" "}
                      {(watch("category") == "Welcome Offer"
                        ? OfferOnListWelcome
                        : watch("category") == "Refer Bonus"
                        ? OfferOnReferList
                        : OfferOnList
                      )?.map((res) => {
                        return <option value={res?.key}>{res?.value}</option>;
                      })}
                      {/* <option value={"OnFirstDeposit"}>OnFirstDeposit</option>{" "}
                        <option value={"OnDeposit"}>OnDeposit</option>{" "}
                        <option value={"OnRegister"}>OnRegister</option>{" "}
                        <option value={"OnSecondDeposit"}>
                          OnSecondDeposit
                        </option>{" "}
                        <option value={"OnThirdDeposit"}>OnThirdDeposit</option>{" "}
                        <option value={"OneFourthDeposit"}>
                          OneFourthDeposit
                        </option>{" "}
                        <option value={"OnEveryDeposit"}>OnEveryDeposit</option>{" "}
                        <option value={"SpecialOffer"}>SpecialOffer</option>{" "}
                        <option value={"FreeSpin"}>FreeSpin</option>{" "}
                        <option value={"ReferBonus"}>Refer Bonus</option>{" "}
                        <option value={"FancyBet"}>Fancy Bet</option> */}
                    </Form.Select>
                    {errors.offerOn && errors.offerOn.message && (
                      <label className="invalid-feedback text-left">
                        {errors.offerOn.message}
                      </label>
                    )}
                  </div>
                </Form.Group>
              </Col>
               )} 
               {[
               
               
                "OnLossBonus",
              ].includes(watch("offerOn")) && ( 
              <Col sm={12} lg={4} md={4} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Loss Offer Apply On 
                    </span>
                    <Multiselect
                      disable={type == "show"}
                      options={Offer} // Options to display in the dropdown
                      selectedValues={multiselect1} // Preselected value to persist in dropdown
                      onSelect={setMultiSelect1} // Function will trigger on select event
                      onRemove={setMultiSelect1} // Function will trigger on remove event
                      displayValue="name" // Property name to display in the dropdown options
                    />

                    {errors.lossOfferApplyOn && errors.lossOfferApplyOn.message && (
                      <label className="invalid-feedback text-left">
                        {errors.lossOfferApplyOn.message}
                      </label>
                    )}
                  </div>
                </Form.Group>
              </Col>
              )} 

              {![...condition, "Free Spin","Refer Bonus"].includes(watch("category")) && (
                <Col sm={12} lg={4} md={4} className="mb-2">
                  <Form.Group className="row">
                    <div>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        Bonus Turnover *
                      </span>
                      <Form.Control
                        disabled={type == "show"}
                        type="number"
                        placeholder="Bonus Turnover"
                        className={
                          errors.bonusTurnover ? " is-invalid mt-1" : "mt-1"
                        }
                        {...register("bonusTurnover", {
                          required: "Please enter Bonus Turnover",
                        })}
                      />
                      {errors.bonusTurnover && errors.bonusTurnover.message && (
                        <label className="invalid-feedback text-left">
                          {errors.bonusTurnover.message}
                        </label>
                      )}
                    </div>
                  </Form.Group>
                </Col>
              )}
              {/* {[
                "Deposit",
                "Daily Loss Bonus",
                "Weekly Loss Bonus",
                "Monthly Loss Bonus",
              ].includes(watch("category")) && ( */}
              <Col sm={12} lg={4} md={4} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Bonus Apply On *
                    </span>
                    <Multiselect
                      disable={type == "show"}
                      options={Offer} // Options to display in the dropdown
                      selectedValues={multiselect} // Preselected value to persist in dropdown
                      onSelect={setMultiSelect} // Function will trigger on select event
                      onRemove={setMultiSelect} // Function will trigger on remove event
                      displayValue="name" // Property name to display in the dropdown options
                    />

                    {errors.bonusApplyOn && errors.bonusApplyOn.message && (
                      <label className="invalid-feedback text-left">
                        {errors.bonusApplyOn.message}
                      </label>
                    )}
                  </div>
                </Form.Group>
              </Col>
              {/* // )} */}

              
              <Col sm={12} lg={4} md={4} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Max User *
                    </span>
                    <Form.Control
                      disabled={type == "show"}
                      type="number"
                      placeholder="Max User"
                      className={errors.maxUser ? " is-invalid mt-1" : "mt-1"}
                      {...register("maxUser", {
                        required: "Please enter Max User",
                      })}
                    />
                    {errors.maxUser && errors.maxUser.message && (
                      <label className="invalid-feedback text-left">
                        {errors.maxUser.message}
                      </label>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col sm={12} lg={4} md={4} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Offer Budget *
                    </span>
                    <Form.Control
                      disabled={type == "show"}
                      type="number"
                      placeholder="Offer Budget"
                      className={
                        errors.offerBudget ? " is-invalid mt-1" : "mt-1"
                      }
                      {...register("offerBudget", {
                        required: "Please enter Offer Budget",
                      })}
                    />
                    {errors.offerBudget && errors.offerBudget.message && (
                      <label className="invalid-feedback text-left">
                        {errors.offerBudget.message}
                      </label>
                    )}
                  </div>
                </Form.Group>
              </Col>
              {!["Slots", "Fishing", "Crash"].includes(watch("category")) && (
                <Col sm={12} lg={4} md={4} className="mb-2">
                  <Form.Group className="row">
                    <div>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        Offer Type *
                      </span>
                      <Form.Select
                        disabled={type == "show"}
                        style={{ height: "36px" }}
                        className={
                          errors.offerType ? " is-invalid mt-1" : "mt-1"
                        }
                        {...register("offerType", {
                          required: "Please select offer type",
                        })}
                      >
                        {" "}
                        <option value={""}>Select Offer Type</option>
                        {watch("category") != "Monday Login Bonus" && (
                          <>
                            <option value={"Fixed"}>Fixed</option>{" "}
                            {watch("category") !== "Welcome Offer" && (
                              <option value={"Percentage"}>Percentage</option>
                            )}
                          </>
                        )}
                        {watch("category") == "Monday Login Bonus" && (
                          <option value={"Random"}>Random</option>
                        )}
                      </Form.Select>
                      {errors.offerType && errors.offerType.message && (
                        <label className="invalid-feedback text-left">
                          {errors.offerType.message}
                        </label>
                      )}
                    </div>
                  </Form.Group>
                </Col>
              )}
              {watch("offerType") == "Percentage" && (
                <Col sm={12} lg={4} md={4} className="mb-2">
                  <Form.Group className="row">
                    <div>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        Percentage Value *
                      </span>
                      <Form.Control
                        disabled={type == "show"}
                        type="number"
                        placeholder="Percentage Value"
                        className={
                          errors.percentageValue ? " is-invalid mt-1" : "mt-1"
                        }
                        {...register("percentageValue", {
                          required: "Please enter Percentage Value",
                        })}
                        min="0" max="100"
                      />
                      {errors.percentageValue &&
                        errors.percentageValue.message && (
                          <label className="invalid-feedback text-left">
                            {errors.percentageValue.message}
                          </label>
                        )}
                    </div>
                  </Form.Group>
                </Col>
              )}
              {watch("offerType") == "Fixed" && (
                <Col sm={12} lg={4} md={4} className="mb-2">
                  <Form.Group className="row">
                    <div>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        Fixed Value *
                      </span>
                      <Form.Control
                        disabled={type == "show"}
                        type="number"
                        placeholder="Fixed Value"
                        className={
                          errors.fixedValue ? " is-invalid mt-1" : "mt-1"
                        }
                        {...register("fixedValue", {
                          required: "Please enter Fixed Value",
                        })}
                      />
                      {errors.fixedValue && errors.fixedValue.message && (
                        <label className="invalid-feedback text-left">
                          {errors.fixedValue.message}
                        </label>
                      )}
                    </div>
                  </Form.Group>
                </Col>
              )}
              {![...condition, "Slots", "Fishing", "Crash"].includes(
                watch("category")
              ) && (
                <>
                  <Col sm={12} lg={4} md={4} className="mb-2">
                    <Form.Group className="row">
                      <div>
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          Minimum{" "}
                          {watch("category") == "Deposit"
                            ? "Deposit"
                            : watch("category") == "Free Spin"
                            ? "Bet"
                            : ""}{" "}
                          *
                        </span>
                        <Form.Control
                          disabled={type == "show"}
                          type="number"
                          placeholder={`Minimum ${
                            watch("category") == "Deposit"
                              ? "Deposit"
                              : watch("category") == "Free Spin"
                              ? "Bet"
                              : ""
                          }`}
                          className={
                            errors.minimumDeposite ? " is-invalid mt-1" : "mt-1"
                          }
                          {...register("minimumDeposite", {
                            required: `Please enter Minimum ${
                              watch("category") == "Deposit"
                                ? "Deposit"
                                : watch("category") == "Free Spin"
                                ? "Bet"
                                : ""
                            }`,
                          })}
                        />
                        {errors.minimumDeposite &&
                          errors.minimumDeposite.message && (
                            <label className="invalid-feedback text-left">
                              {errors.minimumDeposite.message}
                            </label>
                          )}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col sm={12} lg={4} md={4} className="mb-2">
                    <Form.Group className="row">
                      <div>
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          Maximum{" "}
                          {watch("category") == "Deposit"
                            ? "Deposit"
                            : watch("category") == "Free Spin"
                            ? "Bet"
                            : ""}
                          *
                        </span>
                        <Form.Control
                          disabled={type == "show"}
                          type="number"
                          placeholder={`Maximum ${
                            watch("category") == "Deposit"
                              ? "Deposit"
                              : watch("category") == "Free Spin"
                              ? "Bet"
                              : ""
                          }`}
                          className={
                            errors.maximumDeposite ? " is-invalid mt-1" : "mt-1"
                          }
                          {...register("maximumDeposite", {
                            required: {
                              value: true,
                              required: `Please enter Maximum ${
                                watch("category") == "Deposit"
                                  ? "Deposit"
                                  : watch("category") == "Free Spin"
                                  ? "Bet"
                                  : ""
                              }`,
                            },
                            // validate: (value) => {
                            //   if (watch("MinimumDeposite") > value) {
                            //     return "MaxDeposit should be greater than min deposit";
                            //   }
                            // },
                          })}
                        />
                        {errors.maximumDeposite &&
                          errors.maximumDeposite.message && (
                            <label className="invalid-feedback text-left">
                              {errors.maximumDeposite.message}
                            </label>
                          )}
                      </div>
                    </Form.Group>
                  </Col>{" "}
                </>
              )}
              {watch("offerType") == "Percentage" && (
                <Col sm={12} lg={4} md={4} className="mb-2">
                  <Form.Group className="row">
                    <div>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        Max Bounus Value UpTo *
                      </span>
                      <Form.Control
                        disabled={type == "show"}
                        type="number"
                        placeholder="Max Bounus Value UpTo"
                        className={
                          errors.maxBounusValueUpTo
                            ? " is-invalid mt-1"
                            : "mt-1"
                        }
                        {...register("maxBounusValueUpTo", {
                          required: "Please enter Max Bounus Value UpTo",
                        })}
                      />
                      {errors.maxBounusValueUpTo &&
                        errors.maxBounusValueUpTo.message && (
                          <label className="invalid-feedback text-left">
                            {errors.maxBounusValueUpTo.message}
                          </label>
                        )}
                    </div>
                  </Form.Group>
                </Col>
              )}
              <Col
                sm={12}
                lg={4}
                md={4}
                className=""
                style={{ marginTop: "30px" }}
              >
                <Form.Group className="row">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        marginRight: "10px",
                      }}
                    >
                      Is Cash Bonus
                    </span>
                    <input
                      disabled={type == "show"}
                      type="checkbox"
                      placeholder="Max Bounus Value UpTo"
                      className={
                        errors.isCashBonus ? " is-invalid mt-1" : "mt-1"
                      }
                      {...register("isCashBonus")}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>{" "}
            {/* <h5 style={{ margin: "10px 0", fontWeight: "500" }}>
              Deposite Varitation
            </h5>
            <Row>
              <Col sm={12} lg={4} md={4} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <Form.Control
                      disabled={type == "show"}
                      type="number"
                      placeholder="Min"
                      className={
                        errors.depositeVaritationMin
                          ? " is-invalid mt-1"
                          : "mt-1"
                      }
                      {...register("depositeVaritationMin", {
                        required: "Please enter min",
                      })}
                    />
                    {errors.depositeVaritationMin &&
                      errors.depositeVaritationMin.message && (
                        <label className="invalid-feedback text-left">
                          {errors.depositeVaritationMin.message}
                        </label>
                      )}
                  </div>
                </Form.Group>
              </Col>{" "}
              <Col sm={12} lg={4} md={4} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <Form.Control
                      disabled={type == "show"}
                      type="number"
                      placeholder="Max"
                      className={
                        errors.depositeVaritationMax
                          ? " is-invalid mt-1"
                          : "mt-1"
                      }
                      {...register("depositeVaritationMax", {
                        required: "Please enter max",
                      })}
                    />
                    {errors.depositeVaritationMax &&
                      errors.depositeVaritationMax.message && (
                        <label className="invalid-feedback text-left">
                          {errors.depositeVaritationMax.message}
                        </label>
                      )}
                  </div>
                </Form.Group>
              </Col>{" "}
              <Col sm={12} lg={4} md={4} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <Form.Control
                      disabled={type == "show"}
                      type="number"
                      placeholder="Percentage"
                      className={
                        errors.depositeVaritationPercentage
                          ? " is-invalid mt-1"
                          : "mt-1"
                      }
                      {...register("depositeVaritationPercentage", {
                        required: "Please enter percentage",
                      })}
                    />
                    {errors.depositeVaritationPercentage &&
                      errors.depositeVaritationPercentage.message && (
                        <label className="invalid-feedback text-left">
                          {errors.depositeVaritationPercentage.message}
                        </label>
                      )}
                  </div>
                </Form.Group>
              </Col>{" "}
            </Row> */}
            {["Deposit", "Refer Bonus", "Slots"].includes(
              watch("category")
            ) && (
              <>
                <h5 style={{ margin: "10px 0", fontWeight: "500" }}>
                  {startCase(watch("category"))} Variation
                </h5>
                <div>
                  {fieldGroups.map((group, index) => (
                    <Row key={group.id}>
                      <Col sm={12} lg={4} md={4} className="mb-2">
                        <Form.Group className="row">
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                            }}
                          >
                            Min
                          </span>
                          <div>
                            <Form.Control
                              // disabled={type == "show"}
                              type="number"
                              placeholder="Min"
                              value={group.depositeVaritationMin}
                              onChange={(e) =>
                                handleChange(
                                  group.id,
                                  "depositeVaritationMin",
                                  e.target.value
                                )
                              }
                              style={{ flex: 1, padding: "8px" }}
                            />
                          </div>
                        </Form.Group>
                      </Col>{" "}
                      <Col sm={12} lg={4} md={4} className="mb-2">
                        <Form.Group className="row">
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                            }}
                          >
                            Max
                          </span>
                          <div>
                            <Form.Control
                              // disabled={type == "show"}
                              type="number"
                              placeholder="Max"
                              value={group.depositeVaritationMax}
                              onChange={(e) =>
                                handleChange(
                                  group.id,
                                  "depositeVaritationMax",
                                  e.target.value
                                )
                              }
                              style={{ flex: 1, padding: "8px" }}
                            />
                          </div>
                        </Form.Group>
                      </Col>{" "}
                      <Col sm={12} lg={4} md={4} className="mb-2">
                        <Form.Group className="row">
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                            }}
                          >
                            Percentage / Amount
                          </span>
                          <div style={{ display: `flex`, gap: `10px` }}>
                            <Form.Control
                              // disabled={type == "show"}
                              type="number"
                              placeholder="Percentage"
                              value={group.depositeVaritationPercentage}
                              onChange={(e) =>
                                handleChange(
                                  group.id,
                                  "depositeVaritationPercentage",
                                  e.target.value
                                )
                              }
                              style={{ flex: 1, padding: "8px" }}
                            />
                            <button
                              onClick={() => removeGroup(group.id)}
                              disabled={fieldGroups.length === 1}
                              style={{
                                padding: "8px 12px",
                                backgroundColor: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </Form.Group>
                      </Col>{" "}
                    </Row>
                    // </div>
                  ))}
                  <Row>
                    <Col>
                      <a
                        onClick={addGroup}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "green",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          display: `inline-block`,
                          margin: `20px 0`,
                        }}
                      >
                        Add More
                      </a>
                    </Col>
                  </Row>
                </div>{" "}
              </>
            )}
            {/* {["Welcome Offer"].includes(watch("category")) && (
              <>
                <h5 style={{ margin: "10px 0", fontWeight: "500" }}>
                  Bonus Get Variation
                </h5>
                <div>
                  {WelcomVariation.map((group, index) => (
                    <Row key={group.id}>
                      <Col sm={12} lg={2} md={2} className="mb-2">
                        <Form.Group className="row">
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                            }}
                          >
                            Type
                          </span>
                          <div>
                            <Form.Select
                              style={{ height: "36px" }}
                              disabled={type == "show"}
                              className={"mt-1"}
                              value={group.welcomeVarationType}
                              onChange={(e) => {
                                handleChangeVariation(
                                  group.id,
                                  "welcomeVarationType",
                                  e.target.value
                                );
                              }}
                            >
                              {" "}
                              <option value={""}>Select Type</option>{" "}
                              {selectWelcomVariation?.map((res) => {
                                return <option value={res}>{res}</option>;
                              })}
                            </Form.Select>
                          </div>
                        </Form.Group>
                      </Col>{" "}
                      <Col sm={12} lg={1} md={1} className="mb-2">
                        <Form.Group className="row">
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                            }}
                          >
                            Condition
                          </span>
                          <div>
                            <Form.Control
                              type="text"
                              disabled={type == "show"}
                              placeholder="Condition"
                              value={group.welcomeVarationCondition}
                              onChange={(e) =>
                                handleChangeVariation(
                                  group.id,
                                  "welcomeVarationCondition",
                                  e.target.value
                                )
                              }
                              style={{ flex: 1, padding: "8px" }}
                            />
                          </div>
                        </Form.Group>
                      </Col>{" "}
                      <Col sm={12} lg={2} md={2} className="mb-2">
                        <Form.Group className="row">
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                            }}
                          >
                            Rolling Turnover
                          </span>
                          <div>
                            <Form.Control
                              type="text"
                              disabled={type == "show"}
                              placeholder="Bonus Turnover"
                              value={group.welcomeVarationBonusTurnover}
                              onChange={(e) =>
                                handleChangeVariation(
                                  group.id,
                                  "welcomeVarationBonusTurnover",
                                  e.target.value
                                )
                              }
                              style={{ flex: 1, padding: "8px" }}
                            />
                          </div>
                        </Form.Group>
                      </Col>{" "}
                      <Col sm={12} lg={2} md={2} className="mb-2">
                        <Form.Group className="row">
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                            }}
                          >
                            Bonus Apply On
                          </span>
                          <div>
                            <Multiselect
                              disable={type == "show"}
                              options={Offer}
                              selectedValues={group?.welcomeBonusApplyOn}
                              onSelect={(e) =>
                                handleChangeVariation(
                                  group.id,
                                  "welcomeBonusApplyOn",
                                  e
                                )
                              }
                              displayValue="name"
                            />
                          </div>
                        </Form.Group>
                      </Col>{" "}
                      <Col sm={12} lg={2} md={2} className="mb-2">
                        <Form.Group className="row">
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                              paddingLeft: "0",
                            }}
                          >
                            Expire in days{" "}
                            {isNumber(days) && (
                              <span style={{ color: "red", marginLeft: "2px" }}>
                                (Max : {days} Days)
                              </span>
                            )}
                          </span>

                          <Form.Control
                            disabled={days == true ? true : type == "show"}
                            type="number"
                            placeholder="Expire in days"
                            value={group.welcomeVarationExpireIn}
                            onChange={(e) =>
                              handleChangeVariation(
                                group.id,
                                "welcomeVarationExpireIn",
                                e.target.value
                              )
                            }
                            style={{ flex: 1, padding: "8px" }}
                          />
                        </Form.Group>
                      </Col>{" "}
                      <Col sm={12} lg={3} md={3} className="mb-2">
                        <Form.Group className="row">
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                            }}
                          >
                            Percentage (0 - 100){" "}
                            <span style={{ color: "red", marginLeft: "5px" }}>
                              You Get -{" "}
                              {calculatePercentage(
                                group.welcomeVarationPercentage,
                                watch("fixedValue")
                              )}
                            </span>
                          </span>
                          <div style={{ display: `flex`, gap: `10px` }}>
                            <Form.Control
                              disabled={type == "show"}
                              type="number"
                              placeholder="Percentage"
                              value={group.welcomeVarationPercentage}
                              max={100}
                              min={0}
                              onChange={(e) =>
                                handleChangeVariation(
                                  group.id,
                                  "welcomeVarationPercentage",
                                  e.target.value
                                )
                              }
                              style={{ flex: 1, padding: "8px" }}
                            />

                            {type != "show" && (
                              <button
                                onClick={() => removeGroupVariation(group.id)}
                                disabled={WelcomVariation.length === 1}
                                style={{
                                  padding: "8px 12px",
                                  backgroundColor: "red",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </Form.Group>
                      </Col>{" "}
                    </Row>
                    // </div>
                  ))}
                  {type != "show" && (
                    <Row>
                      <Col>
                        <a
                          onClick={addGroupVariation}
                          style={{
                            padding: "10px 20px",
                            backgroundColor: "green",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: `inline-block`,
                            margin: `20px 0`,
                          }}
                        >
                          Add More
                        </a>
                      </Col>
                    </Row>
                  )}
                </div>{" "}
              </>
            )} */}
            <Row>
              <Col sm={12} className="mb-2">
                <Form.Group className="row">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Description
                    </span>
                    <Form.Control
                      disabled={type == "show"}
                      style={{ height: "80px" }}
                      as="textarea"
                      rows={3}
                      placeholder="Description"
                      className={
                        errors.description ? " is-invalid mt-1" : "mt-1"
                      }
                      {...register("description")}
                    />
                    {errors.description && errors.description.message && (
                      <label className="invalid-feedback text-left">
                        {errors.description.message}
                      </label>
                    )}
                  </div>
                </Form.Group>
              </Col>

              <Col sm={12} lg={6} md={6} className="mb-2">
                <Form.Group className="row">
                  {type !== "show" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          margin: "4px 0",
                          fontSize: "14px",
                        }}
                      >
                        Banner Image
                      </span>
                      <input
                        onChange={(e) => {
                          setImage(e.target.files[0]);
                        }}
                        type="file"
                        class="fileInput"
                        accept="image/webp, image/png, image/jiffy, image/jpeg, image/jpg"
                      />
                    </div>
                  )}
                  {image !== "" && (
                    <Col sm={12} className="mt-2">
                      <img
                        src={
                          isImageInState(image)
                            ? URL?.createObjectURL(image)
                            : !isEmpty(image)
                            ? `${process.env.REACT_APP_API_BASE_URL}${image}`
                            : ""
                        }
                      />
                    </Col>
                  )}
                </Form.Group>
              </Col>
              <Col sm={12} lg={6} md={6} className="mb-2">
                <Form.Group className="row">
                  {type !== "show" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      {" "}
                      <span
                        style={{
                          margin: "4px 0",
                          fontSize: "14px",
                        }}
                      >
                        Description Image
                      </span>
                      <input
                        onChange={(e) => {
                          setImage2(e.target.files[0]);
                        }}
                        type="file"
                        class="fileInput"
                        accept="image/webp, image/png, image/jiffy, image/jpeg, image/jpg"
                      />
                    </div>
                  )}
                  {image2 !== "" && (
                    <Col sm={12} className="mt-2">
                      <img
                        src={
                          isImageInState(image2)
                            ? URL?.createObjectURL(image2)
                            : !isEmpty(image2)
                            ? `${process.env.REACT_APP_API_BASE_URL}${image2}`
                            : ""
                        }
                      />
                    </Col>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end align-items-center mt-1">
              {type != "show" && (
                <Button
                  type="submit"
                  className="green-btn"
                  style={{ color: "black" }}
                >
                  Submit
                </Button>
              )}
              <Button
                type="button"
                onClick={() => onClose()}
                className="theme_light_btn btn btn-primary"
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddOffer;

let Offer = [
  { name: "Exchange", id: "EXCHANGE" },
  { name: "Sports", id: "SPORTS" },
  { name: "Table", id: "TABLE" },
  { name: "Fishing", id: "FISHING" },
  { name: "Slot", id: "SLOT" },
  { name: "E-Sports", id: "ESPORTS" },
  { name: "E-Game", id: "EGAME" },
  { name: "Bingo", id: "BINGO" },
  { name: "Live", id: "LIVE" },
  { name: "Virtual", id: "VIRTUAL" },
];

const OfferOnList = [
  { key: "OnFirstDeposit", value: "OnFirstDeposit" },
  { key: "OnDailyFirstDeposit", value: "OnDailyFirstDeposit" },
  { key: "OnDeposit", value: "OnDeposit" },
  // { key: "OnRegister", value: "OnRegister" },
  { key: "OnSecondDeposit", value: "OnSecondDeposit" },
  { key: "OnThirdDeposit", value: "OnThirdDeposit" },
  // { key: "OneFourthDeposit", value: "OneFourthDeposit" },
  { key: "OnAllTimeDeposit", value: "OnAllTimeDeposit" },
  { key: "SpecialOffer", value: "SpecialOffer" },
  { key: "FreeSpin", value: "FreeSpin" },
  { key: "ReferBonus", value: "Refer Bonus" },
  // { key: "FancyBet", value: "Fancy Bet" },
];

const OfferOnReferList = [
  { key: "OnFirstDeposit", value: "OnFirstDeposit" },
  { key: "OnDailyFirstDeposit", value: "OnDailyFirstDeposit" },
  { key: "OnDeposit", value: "OnDeposit" },
  { key: "OnSecondDeposit", value: "OnSecondDeposit" },
  { key: "OnThirdDeposit", value: "OnThirdDeposit" },
  { key: "OnLossBonus", value: "OnLossBonus" },
];

const OfferOnListWelcome = [
  // { key: "OnFirstDeposit", value: "OnFirstDeposit" },
  { key: "OnRegister", value: "OnRegister" },
  // { key: "OnDeposit", value: "OnVerify" },
  // { key: "SpecialOffer", value: "SpecialOffer" },
];

const selectWelcomVariation = [
  "Telegram Join",
  "Whatasapp Join",
  "App Download",
  "Bet Task",
  "Refer Task",
  "Deposit Task",
];
