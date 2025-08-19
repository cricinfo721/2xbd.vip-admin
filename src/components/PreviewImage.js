import React from "react";
import { Modal } from "react-bootstrap";

const PreviewImage = ({onClose, open, image}) => {
  return (
    <Modal size="lg" centered show={open} onHide={onClose} className="preview-model">
      <Modal.Body>
        <img src={image} />
      </Modal.Body>
    </Modal>
  );
};

export default PreviewImage;
