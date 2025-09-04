import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { toast } from "wc-toast";
import { useForm } from "react-hook-form";
import { apiPost, apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { isEmpty, pick, startCase } from "lodash";
import constants from "../../utils/constants";
import moment from "moment";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5';
// import 'ckeditor5/ckeditor5.css';
// import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
const AddBanner = ({ type, onClose, data, getData }) => {
  const [isLoader, setLoader] = useState(false);
  const [image, setImage] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [turnOverExpiryDate, setTurnOverExpiryDate] = useState("");
  const [descriptionData, setDescriptionData] = useState("");
  
  var previousDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  var currentDate = moment().format("YYYY-MM-DD");
  const [showImage, setShowImage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      timeZone: "Asia/Kolkata",
      commission: 0,
      exposureLimit: 1000,
    },
  });


  const handleChange = (e) => {
    setImage(e.target.files[0])
    setShowImage(URL.createObjectURL(e.target.files[0]));
  };

  const onSubmit = async (body) => {
    if (image !== "") {
      let imageCheck = await uploadImage();
      const { status, data } = await apiPost(apiPath.addBanner, {
        banner_path: imageCheck,
        type: body?.textType,
      });
      if (status == 200) {
        if (data?.success) {
          toast.success(data?.message);
          setImage("");
          onClose();
          getData();
        } else {
          toast.error(data?.message);
        }
      } else {
        toast.error(data?.message);
      }
    } else {
      toast.error("Please select image");
    }
  };

  const uploadImage = async () => {
    let form = new FormData();
    form.append("image", image);
    const { status, data } = await apiPost(apiPath.uploadBanner, form);
    if (status == 200) {
      return data?.path;
    } else {
      return false;
    }
  };


  return (
    <div>
      <Modal show={true} onHide={onClose} className="super-admin-modal promotional-offer-form-div" >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="modal-title-status">Add Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Form className="super-admin-form" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm={12} md={12} className="mb-2 mb-md-3">
                <Form.Group className="row d-flex">
                  <Col md={2}>
                    <Form.Label>Title</Form.Label>
                  </Col>
                  <Col md={10}>
                    <Form.Control
                      type="text"
                      placeholder="Enter title"
                      autoComplete={false}
                      className={errors.title ? " is-invalid " : ""}
                      {...register("title", {
                        required: "Please enter title",
                        minLength: {
                          value: 3,
                          message:
                            "Title should contain at least 3 characters.",
                        },
                        maxLength: {
                          value: 100,
                          message:
                            "Title should contain at least 100 characters.",
                        },
                       
                      })}
                    />
                    {errors.title && errors.title.message && (
                      <label className="invalid-feedback text-left">
                        {errors.title.message}
                      </label>
                    )}
                  </Col>
                  
                </Form.Group>
              </Col>
              <Col sm={12} md={12} className="mb-2 mb-md-3">
                <Form.Group className="row d-flex">
                  <Col md={2}>
                    <Form.Label>Description</Form.Label>
                  </Col>
                  {/* <Col md={10}>
                              <CKEditor
                        editor={ ClassicEditor }
                        config={ {
                          height:"500px",
                            toolbar: {
                                items: [ 'undo', 'redo', '|', 'bold', 'italic','paragraph' ],
                            },
                            plugins: [
                                Bold, Essentials, Italic, Mention, Paragraph, Undo
                            ],
                            // licenseKey: '<YOUR_LICENSE_KEY>',
                            mention: {
                                // Mention configuration
                            },
                            initialData: '<p>Enter description</p>',
                        } }

                        onInit={ editor => {
                          console.log( 'Editor is ready to use!', editor );
                      } }
                      onChange={ ( event, editor ) => {
                          const data = editor.getData();
                          console.log( data );
                          setDescriptionData(data);
                      } }
                      onBlur={ ( event, editor ) => {
                          console.log( 'Blur.', editor );
                      } }
                      onFocus={ ( event, editor ) => {
                          console.log( 'Focus.', editor );
                      } }
                    />
                  </Col> */}
                  
                </Form.Group>
              </Col>
              

              <Col sm={12} md={6} className="mb-2 mb-md-3">
                <Form.Group className="row d-flex">
                  <Col md={4}>
                    <Form.Label>Text Type</Form.Label>
                  </Col>
                  <Col md={8}>
                  <Form.Select
                        aria-label="Default select example"
                        className={errors.textType ? " is-invalid " : ""}
                        {...register("textType", {
                          required: "Please select type",
                        })}
                      >
                        <option value="1">Image</option>
                        <option value="2">Bottom</option>
                        <option value="3">Top</option>
                      </Form.Select>
                      {errors.textType && errors.textType.message && (
                        <label className="invalid-feedback text-left">
                          {errors.textType.message}
                        </label>
                      )}
                  </Col>
                  
                </Form.Group>
              </Col>
              

              <Col sm={12} md={6} className="mb-2 mb-md-3">
                <Form.Group className="row d-flex">
                  <Col md={4}>
                    <Form.Label>Image</Form.Label>
                  </Col>
                  <Col md={8}>
                  <input
                      onChange={handleChange}
                      type="file"
                      class="fileInput"
                      accept="image/png, image/jiffy, image/jpeg, image/jpg"
                      id="image"
                      name="image"
                    />
                      {image !== "" && (

                        <div className="image-prev">
                        <img src={showImage} />
                    <button
                      onClick={() => {setImage("");setShowImage("")}}
                      class="btn-remove removeReceipt bg-gradient-third"
                    >
                      X
                    </button>
                    </div>
                  )}
                  </Col>
                  
                </Form.Group>
              </Col>
              <Col sm={12} md={6} className="mb-2 mb-md-3">
                <Form.Group className="row d-flex">
                  <Col md={4}>
                    <Form.Label>Expiry date</Form.Label>
                  </Col>
                  <Col md={8}>
                  <Form.Control
                        className="small_form_control"
                        onChange={(e) =>
                          setExpiryDate(e.target.value)
                        }
                        min={
                          currentDate
                            ? new Date(currentDate)
                                .toISOString()
                                .split("T")[0]
                            : new Date()
                        }
                        // max={new Date().toISOString().split("T")[0]}
                        value={currentDate}
                        type="date"
                      />  
                  </Col>
                  
                </Form.Group>
              </Col>
              
                     
                  
             <Col sm={12} md={6} className="mb-2 mb-md-3">
                <Form.Group className="row">
                  <Col md={4}>
                    <Form.Label>Promotional Code</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      placeholder="Enter promotional code"
                      className={errors.promotionalCode ? " is-invalid " : ""}
                      {...register("promotionalCode", {
                        required: "Please enter promotional code",
                        minLength: {
                          value:12,
                          message:
                            "Promotional code should contain at least 12 characters.",
                        },
                        maxLength: {
                          value: 12,
                          message:
                            "Promotional code should contain at least 12 characters.",
                        },
                      })}
                    />
                    {errors.promotionalCode && errors.promotionalCode.message && (
                      <label className="invalid-feedback text-left">
                        {errors.promotionalCode.message}
                      </label>
                    )}
                  </Col>
                </Form.Group>
              </Col> 
              <Col sm={12} md={6} className="mb-2 mb-md-3">
                <Form.Group className="row d-flex">
                  <Col md={4}>
                    <Form.Label>Promotional Code Type</Form.Label>
                  </Col>
                  <Col md={8}>
                  <Form.Select
                        aria-label="Default select example"
                        className={errors.textType ? " is-invalid " : ""}
                        {...register("promotionalCodeType", {
                          required: "Please select type",
                        })}
                      >
                      
                        <option value="1">Cricket</option>
                        <option value="2">Soccer</option>
                        <option value="3">Tennis</option>
                        <option value="4">Casino</option>
                        <option value="5">User</option>
                        <option value="6">Game Loss</option>
                        <option value="7">Casino Loss</option>
                        <option value="8">Other</option>
                      </Form.Select>
                      {errors.promotionalCodeType && errors.promotionalCodeType.message && (
                        <label className="invalid-feedback text-left">
                          {errors.promotionalCodeType.message}
                        </label>
                      )}
                  </Col>
                  
                </Form.Group>
              </Col>
               <Col sm={12} md={6} className="mb-2 mb-md-3">
                <Form.Group className="row">
                  <Col md={4}>
                    <Form.Label>No. Of User (How many user can use)</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="number"
                      placeholder="Enter no. of user"
                      className={errors.noOffUsers ? " is-invalid " : ""}
                      {...register("noOffUsers", {
                        required: "Please enter no. of user",
                      
                      })}
                    />
                    {errors.noOffUsers && errors.noOffUsers.message && (
                      <label className="invalid-feedback text-left">
                        {errors.noOffUsers.message}
                      </label>
                    )}
                  </Col>
                </Form.Group>
              </Col> 
              <Col sm={12} md={6} className="mb-2 mb-md-3">
                <Form.Group className="row">
                  <Col md={4}>
                    <Form.Label>Per user limit (how many times user can use this offer )</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="number"
                      placeholder="Enter limit"
                      className={errors.perUserLimit ? " is-invalid " : ""}
                      {...register("perUserLimit", {
                        required: "Please enter limit",
                      
                      })}
                    />
                    {errors.perUserLimit && errors.perUserLimit.message && (
                      <label className="invalid-feedback text-left">
                        {errors.perUserLimit.message}
                      </label>
                    )}
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={12} md={6} className="mb-2 mb-md-3">
                <Form.Group className="row">
                  <Col md={4}>
                    <Form.Label>Min Amount</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="number"
                      placeholder="Enter min amount"
                      className={errors.minAmount ? " is-invalid " : ""}
                      {...register("minAmount", {
                        required: "Please enter amount",
                      
                      })}
                    />
                    {errors.minAmount && errors.minAmount.message && (
                      <label className="invalid-feedback text-left">
                        {errors.minAmount.message}
                      </label>
                    )}
                  </Col>
                </Form.Group>
              </Col>

              <Col sm={12} md={6} className="mb-2 mb-md-3">
                <Form.Group className="row">
                  <Col md={4}>
                    <Form.Label>Max Amount</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="number"
                      placeholder="Enter amount"
                      className={errors.maxAmount ? " is-invalid " : ""}
                      {...register("maxAmount", {
                        required: "Please enter amount",
                      
                      })}
                    />
                    {errors.maxAmount && errors.maxAmount.message && (
                      <label className="invalid-feedback text-left">
                        {errors.maxAmount.message}
                      </label>
                    )}
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={12} md={6} className="mb-2 mb-md-3">
                <Form.Group className="row d-flex">
                  <Col md={4}>
                    <Form.Label>Redeem Type</Form.Label>
                  </Col>
                  <Col md={8}>
                  <Form.Select
                        aria-label="Default select"
                        className={errors.textType ? " is-invalid " : ""}
                        {...register("redeemType", {
                          required: "Please select redeem type",
                        })}
                      >
                        
                        <option value="1">Bonus</option>
                        <option value="2">Cash Bonus</option>
                      
                      </Form.Select>
                      {errors.redeemType && errors.redeemType.message && (
                        <label className="invalid-feedback text-left">
                          {errors.redeemType.message}
                        </label>
                      )}
                  </Col>
                  
                </Form.Group>
              </Col>
            
              <Col sm={12} md={6} className="mb-2 mb-md-3">
                <Form.Group className="row d-flex">
                  <Col md={4}>
                    <Form.Label>Turnover Type</Form.Label>
                  </Col>
                  <Col md={8}>
                  <Form.Select
                        aria-label="Default select"
                        className={errors.textType ? " is-invalid " : ""}
                        {...register("turnOverType", {
                          required: "Please select redeem type",
                        })}
                      >
                        
                        <option value="1">% (percentage)</option>
                        <option value="2">X (no.of x)</option>
                      
                      </Form.Select>
                      {errors.turnOverType && errors.turnOverType.message && (
                        <label className="invalid-feedback text-left">
                          {errors.turnOverType.message}
                        </label>
                      )}
                  </Col>
                  
                </Form.Group>
              </Col>
              
              <Col sm={12} md={6} className="mb-2 mb-md-3">
                <Form.Group className="row">
                  <Col md={4}>
                    <Form.Label>Turnover</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="number"
                      placeholder="Enter turnover"
                      className={errors.turnover ? " is-invalid " : ""}
                      {...register("turnover", {
                        required: "Please enter turnover",
                      
                      })}
                    />
                    {errors.turnover && errors.turnover.message && (
                      <label className="invalid-feedback text-left">
                        {errors.turnover.message}
                      </label>
                    )}
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={12} md={6}className="mb-2 mb-md-3">
                <Form.Group className="row d-flex">
                  <Col md={4}>
                    <Form.Label>Turnover Expiry date</Form.Label>
                  </Col>
                  <Col md={8}>
                  <Form.Control
                        className="small_form_control"
                        onChange={(e) =>
                          setTurnOverExpiryDate(e.target.value)
                        }
                        min={
                          currentDate
                            ? new Date(currentDate)
                                .toISOString()
                                .split("T")[0]
                            : new Date()
                        }
                        // max={new Date().toISOString().split("T")[0]}
                        value={currentDate}
                        type="date"
                      />  
                  </Col>
                  
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mt-3 text-center">
              <Button
                type="submit"
                disabled={isLoader ? true : false}
                className="theme_dark_btn px-5"
              >
                Create
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddBanner;
