import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { id } = useParams();
  const location = useLocation();
  const current_url = location.pathname.split("/")[1];

  return (
    <div>
      <div className="sidebar">
        <div className="sidebar-main">
          <ul className="menu-list list-unstyled">
            <li>
              <a href="#" className="active">
                Position{" "}
              </a>
            </li>
            <li>
              {" "}
              <Link
                to={`/my-account-statement`}
                className={
                  current_url === "my-account-statement" ? "select" : ""
                }
              >
                Account Statement
              </Link>
            </li>
            <li>
              <Link
                to={`/my-account-summary`}
                className={current_url === "my-account-summary" ? "select" : ""}
              >
                Account Summary
              </Link>
            </li>
            <li>
              <a href="#" className="active">
                {" "}
                Account Details{" "}
              </a>
            </li>
            <li>
              <Link
                to={`/my-profile`}
                className={current_url === "my-profile" ? "select" : ""}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to={`/my-activity-log`}
                className={current_url === "my-activity-log" ? "select" : ""}
              >
                Activity Log
              </Link>{" "}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
