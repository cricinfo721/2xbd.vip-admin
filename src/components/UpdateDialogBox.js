import { startCase } from "lodash";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import PreviewImage from "./PreviewImage";

const UpdateDialogBox = ({
  open,
  onClose,
  onSubmit,
  headerTitle,
  title,
  isLoader,
  item,
  type,
}) => {
  const [show, setShow] = useState({
    status: false,
    image: "",
  });
  const [remark, setRemark] = useState("");
  return (
    <>
      <Modal show={open} onHide={onClose} className="block-modal">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="modal-title-status">
            {headerTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <div className="block-modal-content">
            {type == "wallet" && (
              <div className="confirm-details  mb-2">
                <p>
                  Account Name - <span>{item?.AccountName}</span>
                </p>
                <p>
                  Bank Account - <span>{item?.BankAccount}</span>
                </p>{" "}
                <p>
                  Amount - <span>{item?.amount}</span>
                </p>{" "}
                <p>
                  Transaction Type - <span>{startCase(item?.type)}</span>
                </p>
              </div>
            )}
            {type == "deposit" && (
              <div className="confirm-details mb-2">
                {" "}
                <p>
                  Transaction ID - <span>{item?.TransactionId}</span>
                </p>
                <p>
                  Account Name - <span>{item?.AccountName}</span>
                </p>
                <p>
                  Bank Account - <span>{item?.BankAccount}</span>
                </p>{" "}
                <p>
                  Amount - <span>{item?.amount}</span>
                </p>{" "}
                <p>
                  Transaction Type -{" "}
                  <span>{startCase(item?.transactionType)}</span>
                </p>
                <p className="d-flex">
                  Transaction File -{" "}
                  <span
                    onClick={() => {
                      setShow({
                        status: true,
                        image:
                          process.env.REACT_APP_API_BASE_URL +
                          item?.TransactionFile,
                      });
                    }}
                    style={{ marginLeft: "10px" }}
                  >
                    {item?.TransactionFile?.split("/")?.length > 1 ? (
                      <img
                        style={{ width: "150px" }}
                        src={
                          process.env.REACT_APP_API_BASE_URL +
                          item?.TransactionFile
                        }
                      />
                    ) : (
                      "N/A"
                    )}
                  </span>
                </p>
              </div>
            )}
            <div className="d-flex align-items-start mb-3">
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                Remark:
              </span>
              <textarea
                style={{
                  width: "90%",
                  marginLeft: "5px",
                  borderRadius: "5px",
                  height: "70px",
                }}
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </div>
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
                  onClick={() => onSubmit({ remark: remark })}
                >
                  Confirm
                </Button>
              )}
              <Button
                disabled={isLoader}
                className="green-btn"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {show?.status && (
        <PreviewImage
          onClose={() => setShow({ status: false, image: "" })}
          open={show?.status}
          image={show?.image}
        />
      )}
    </>
  );
};

export default UpdateDialogBox;
