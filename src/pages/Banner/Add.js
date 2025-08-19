import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { toast } from "wc-toast";
import { useForm } from "react-hook-form";
import { apiPost, apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { isEmpty, pick, startCase } from "lodash";
import constants from "../../utils/constants";

const AddBanner = ({ type, onClose, data, getData }) => {
  const [image, setImage] = useState("");
  const [select, setSelect] = useState("home_top");
  const onSubmit = async () => {
    if (image !== "") {
      let imageCheck = await uploadImage();
      const { status, data } = await apiPost(apiPath.addBanner, {
        banner_path: imageCheck,
        type: select,
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
    form.append("BannerFile", image);
    const { status, data } = await apiPost(apiPath.uploadBanner, form);
    if (status == 200) {
      return data?.path;
    } else {
      return false;
    }
  };


  return (
    <div>
      <Modal show={true} onHide={onClose} className="super-admin-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="modal-title-status">Add Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={12} className="mb-3">
              <select
              className="w-100 p-2"
                value={select}
                onChange={(e) => setSelect(e.target.value)}
              >
                <option value="home_top">Home Top Slider</option>
                <option value="home_mid">Home Middle Slider</option>
              </select>
            </Col>
            <Col sm={12} className="mb-2 mb-md-3">
              <input
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
                type="file"
                class="fileInput"
                accept="image/png, image/jiffy, image/jpeg, image/jpg"
              />
            </Col>
            {image !== "" && (
              <Col sm={12} className="mb-3">
                <img src={URL?.createObjectURL(image)} />
              </Col>
            )}
          </Row>
          <Button
            onClick={onSubmit}
            type="submit"
            className="theme_dark_btn px-5"
          >
            Add
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddBanner;
