import React, { useState, useContext } from "react";
import { Container, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { apiPost } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import { toast } from "wc-toast";
import { pick } from "lodash";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const WebsiteSetting = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <section className="main-inner-outer py-4">
        <Container fluid>
          <div className="setting_dashboard">
            <div className="setting_dashboard_block">
              <h2 className="common-heading">Manage Website Settings</h2>
              <ul>
                {user?.userType !== "sub_owner" && (
                  <li>
                    <Link to="/add-website">
                      {" "}
                      <figure>
                        {" "}
                        <img src="../assets/images/addweb.png" />{" "}
                      </figure>{" "}
                    </Link>{" "}
                  </li>
                )}
                <li>
                  <Link to="/manage-links">
                    {" "}
                    <figure>
                      {" "}
                      <img src="../assets/images/managelinks.png" />{" "}
                    </figure>{" "}
                  </Link>{" "}
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default WebsiteSetting;
