import React, { useContext } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Sidebar = () => {
  const params = useParams();
  const location = useLocation();
  const current_url = location.pathname.split("/")[1];
  let { user } = useContext(AuthContext);
  // console.log("usre", user);
  return (
    <div>
      <div className="sidebar">
        <div className="sidebar-main">
          <ul className="menu-list list-unstyled">
            <li>
              <a href="#" className="active">
                Position
              </a>
            </li>
            <li>
              <Link
                to={`/account-summary/${params.id}/${params.type}`}
                className={current_url === "account-summary" ? "select" : ""}
              >
                Account Summary
              </Link>
            </li>
            <li>
              {" "}
              <a href="#" className="active">
                Performance
              </a>
            </li>
            <li>
              <Link
                to={`/current-bets/${params.id}/${params.type}`}
                className={current_url === "current-bets" ? "select" : ""}
              >
                Current Bets
              </Link>
            </li>
            <li>
              <Link
                to={`/betting-history/${params.id}/${params.type}`}
                className={current_url === "betting-history" ? "select" : ""}
              >
                Betting History
              </Link>
            </li>
            <li>
              <Link
                to={`/betting-profit-loss/${params.id}/${params.type}`}
                className={
                  current_url === "betting-profit-loss" ? "select" : ""
                }
              >
                Betting Profit & Loss
              </Link>
            </li>
            <li>
              <Link
                to={`/transaction-history/${params.id}/${params.type}`}
                className={
                  current_url === "transaction-history" ? "select" : ""
                }
              >
                Transaction History
              </Link>{" "}
            </li>
            {params.type === "user" && (
              <li>
                {" "}
                <Link
                  to={`/transaction-history-2/${params.id}/${params.type}`}
                  className={
                    current_url === "transaction-history-2" ? "select" : ""
                  }
                >
                  Transaction History 2
                </Link>
              </li>
            )}
             {params.type === "user" && (
              <li>
                {" "}
                <Link
                  to={`/turnover/${params.id}/${params.type}`}
                  className={
                    current_url === "turnover" ? "select" : ""
                  }
                >
                  Turnover
                </Link>
              </li>
            )}
            <li>
              <Link
                to={`/activity-log/${params.id}/${params.type}`}
                className={current_url === "activity-log" ? "select" : ""}
              >
                Activity Log
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
