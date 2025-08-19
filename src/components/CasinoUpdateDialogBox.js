import React from "react";
import { Button, Modal } from "react-bootstrap";

const CasinoUpdateDialogBox = ({
  open,
  onClose,
  onSubmit,
  headerTitle,
  title,
  isLoader,
}) => {
  return (
    <Modal show={open} onHide={onClose} className="block-modal">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="modal-title-status">{headerTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-3">
        <div className="block-modal-content">
          <h3>{title}</h3>
          <div className="text-center">
            {isLoader ? (
              <Button type="submit" className="green-btn me-3">
                ...Loading
              </Button>
            ) : (
              <Button
                type="submit"
                className="green-btn me-3"
                onClick={() => onSubmit()}
              >
                Confirm
              </Button>
            )}
            <Button className="green-btn" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CasinoUpdateDialogBox;
