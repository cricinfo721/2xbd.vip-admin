import React, { useState, useEffect, useContext } from "react";
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
import { pick, isEmpty } from "lodash";
import { useForm } from "react-hook-form";
import { toast } from "wc-toast";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import moment from "moment";
const AffiliateKyc = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({});
  const { user } = useContext(AuthContext);
  const [isLoader, setLoader] = useState(false);
  const [kycData, setKycData] = useState({});

  var currentDate = moment().format("YYYY-MM-DD");
  const [image, setImage] = useState(null); // Stores the uploaded image file
  const [previewUrl, setPreviewUrl] = useState(
    kycData?.kycFile
      ? process.env.REACT_APP_API_BASE_URL + kycData?.kycFile
      : null
  ); // Stores the URL for preview
 
  const MAX_FILE_SIZE = 5 * 1024 * 1024; 
   // Allowed file types
   const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif','image/webp'];
 
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
        setImage(null);
        setPreviewUrl(null);
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size exceeds 5MB. Please choose a smaller file.');
        setImage(null);
        setPreviewUrl(null);
        return;
      }

      setImage(file);

      // Generate a preview URL using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // Set the preview URL
      };
      reader.readAsDataURL(file);
    }
  };


  const getKycData = async (event) => {
    try {
      const { status, data: response_users } = await apiGet(
        apiPath.kycDocument
      );
      if (status === 200) {
        if (response_users.success) {
          setKycData(response_users.results);
        }
      }
    } catch (err) {}
  };
  const onSubmit = async (request) => {
    try {
      setLoader(true);

      if (image !== "" && image !== null) {
        let imageCheck = await uploadImage();
        const { status, data: response_users } = await apiPost(
          apiPath.affEditDocument,
          {
            kycFile: imageCheck,
            documentType: request?.documentType,
            documentNumber: request?.documentNumber,
            contactNumber: request?.contactNumber,
            kycName: request?.kycName,
          }
        );

        if (status === 200) {
          if (response_users.success) {
            setLoader(false);

            toast.success(response_users.message);
            getKycData();
          } else {
            setLoader(false);
            toast.error(response_users.message);
          }
        }
      } else {
        toast.error("Please select document file");
        setLoader(false);
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(
        "Something went wrong on the server. Please try again later."
      );
    }
  };
  const uploadImage = async () => {
    try {
     
      let form = new FormData();
      form.append("kycFile", image);
      const { status, data } = await apiPost(apiPath.kycUpload, form);
      if (status == 200) {
        return data?.path;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(
        "Something went wrong on the server. Please try again later."
      );
    }
  };
  useEffect(() => {
    getKycData();
  }, []);
  useEffect(() => {
    if (!isEmpty(kycData)) {
      setValue("documentType", kycData?.documentType);
      setValue("documentNumber", kycData?.documentNumber);
      setValue("contactNumber", kycData?.contactNumber);
      setValue("kycName", kycData?.kycName);
      setPreviewUrl(
        kycData?.kycFile
          ? process.env.REACT_APP_API_BASE_URL + kycData?.kycFile
          : null
      );
    }
  }, [kycData]);
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="bet_status">
            <h2 className="common-heading">Affiliate KYC</h2>
            <Form
              onSubmit={handleSubmit(onSubmit)}
              id="deposit_form"
              class="deposit_form"
            >
              <Row>
                <Col lg={6}>
                  <Row className="">
                    <Col sm={12} className="mb-3">
                    <Form.Label className="mt-2 me-2">জাতীয় পরিচয় পত্র অথবা পাসপোর্ট পত্র বাছাই করুন।:</Form.Label>
                      <Form.Group>
                        <Form.Select {...register("documentType")}>
                          <option
                            value="nationalId"
                            selected={kycData?.documentType == "nationalId"}
                          >
                            National ID{" "}
                          </option>{" "}
                          <option
                            value="passportId"
                            selected={kycData?.documentType == "passportId"}
                          >
                            Passport ID
                          </option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col sm={12} className="mb-3">
                    <Form.Label className="mt-2 me-2">আপনার NID কার্ডের নাম্বার লেখুন।:</Form.Label>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Enter number"
                          autoComplete={false}
                          className={
                            errors.documentNumber ? " is-invalid " : ""
                          }
                          {...register("documentNumber", {
                            required: "Please enter documentNumber",
                            minLength: {
                              value: 2,
                              message:
                                "documentNumber should contain at least 2 digit.",
                            },
                            maxLength: {
                              value: 30,
                              message:
                                "documentNumber should contain at least 30 digit.",
                            },
                          })}
                        />
                        {errors.documentNumber &&
                          errors.documentNumber.message && (
                            <label className="invalid-feedback text-left">
                              {errors.documentNumber.message}
                            </label>
                          )}
                      </Form.Group>
                    </Col>
                    <Col sm={12} className="mb-3">
                    <Form.Label className="mt-2 me-2">আপনার পার্সোনাল নাম্বার লেখুন।:</Form.Label>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Enter number"
                          autoComplete={false}
                          className={errors.contactNumber ? " is-invalid " : ""}
                          {...register("contactNumber", {
                            required: "Please enter mobile",
                            minLength: {
                              value: 8,
                              message:
                                "mobile should contain at least 8 digit.",
                            },
                            maxLength: {
                              value: 12,
                              message:
                                "mobile should contain at least 12 digit.",
                            },
                          })}
                        />
                        {errors.contactNumber &&
                          errors.contactNumber.message && (
                            <label className="invalid-feedback text-left">
                              {errors.contactNumber.message}
                            </label>
                          )}
                      </Form.Group>
                    </Col>
                    <Col sm={12} className="mb-3">
                    <Form.Label className="mt-2 me-2">যেভাবে NID কার্ডে যে নাম দেওয়া আছে সেভাবেই নাম লেখুন।:</Form.Label>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Enter name"
                          autoComplete={false}
                          className={errors.kycName ? " is-invalid " : ""}
                          {...register("kycName", {
                            required: "Please enter name",
                            minLength: {
                              value: 2,
                              message:
                                "name should contain at least 2 character.",
                            },
                            maxLength: {
                              value: 30,
                              message:
                                "name should contain at least 30 character.",
                            },
                          })}
                        />
                        {errors.kycName && errors.kycName.message && (
                          <label className="invalid-feedback text-left">
                            {errors.kycName.message}
                          </label>
                        )}
                      </Form.Group>
                    </Col>
                    <Col sm={12} className="mb-3">
                    <Form.Label className="mt-2 me-2">সকল এফিলেট কে নিজ নিজ ভোটার (NID) অথবা পাসপোর্ট আইডি হাতে নিয়ে  সেলফি আপলোড করে KYC পুরন করুন।:</Form.Label>
                      <Form.Group>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        {previewUrl && (
                          <div style={{ margin: "20px 0" }}>
                            <p>Image Preview:</p>
                            <img
                              src={previewUrl}
                              alt="Preview"
                              style={{
                                width: "200px",
                                height: "auto",
                                border: "1px solid #ccc",
                              }}
                            />
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col sm={12} className="mb-3">
                    <Form.Label className="mt-2 me-2">Status:</Form.Label>
                      <Form.Group>
                      {kycData?.status}
                      </Form.Group>
                    </Col>
                   
                    <div>
                      <Button type="submit" className="green-btn">
                        {isLoader ? "Loading..." : "SUBMIT"}
                      </Button>
                    </div>
                  </Row>
                </Col>
              </Row>
            </Form>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AffiliateKyc;
